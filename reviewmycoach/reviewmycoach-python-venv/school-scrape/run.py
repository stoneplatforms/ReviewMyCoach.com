import os, re, json, time, hashlib
from datetime import datetime
from typing import List, Dict
from urllib.parse import urlparse
import requests
from tqdm import tqdm
import pandas as pd
try:
    import pdfkit  # optional, requires wkhtmltopdf installed
except Exception:
    pdfkit = None

from ipeds_utils import load_institutions
from search_strategies import build_queries, extract_domain

def head_ok(url: str, timeout: int=15):
    try:
        r = requests.head(url, allow_redirects=True, timeout=timeout)
        ct = r.headers.get("content-type", "").lower()
        return r.status_code, ct, r.url
    except requests.RequestException:
        # Fallback: some servers block HEAD; try GET without downloading body
        try:
            r = requests.get(url, allow_redirects=True, timeout=timeout, stream=True)
            ct = r.headers.get("content-type", "").lower()
            return r.status_code, ct, r.url
        except requests.RequestException:
            return None, "", url

def keyword_probe(url: str, timeout: int=15, max_bytes: int=120000, min_hits: int=1):
    try:
        headers = {"Range": f"bytes=0-{max_bytes}"}
        r = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        sample = r.content.decode("latin-1", errors="ignore").lower()
        # Focus on athletics-specific staff/contact signals
        keywords = [
            "athletics staff directory",
            "athletic staff directory",
            "staff directory",
            "coaches directory",
            "coaching staff",
            "sports information",
            "athletics communications",
            "athletics contacts",
            "athletics phone",
            "athletic department"
        ]
        hits = sum(1 for k in keywords if k in sample)
        return hits >= min_hits, hits
    except requests.RequestException:
        return False, 0

def find_linked_pdfs_from_html(page_url: str, timeout: int=15, max_bytes: int=200000):
    """
    Fetch a likely athletics directory HTML page and extract .pdf links.
    Returns list of absolute PDF URLs.
    """
    try:
        r = requests.get(page_url, timeout=timeout, allow_redirects=True)
        if not r.headers.get("content-type", "").lower().startswith("text/html"):
            return []
        html = r.text
        # naive regex for hrefs ending with .pdf
        hrefs = re.findall(r'href=["\']([^"\']+\.pdf)(?:\?[^"]*)?["\']', html, flags=re.I)
        if not hrefs:
            return []
        from urllib.parse import urljoin
        pdf_urls = [urljoin(r.url, h) for h in hrefs]
        # dedup while preserving order
        seen = set()
        uniq = []
        for u in pdf_urls:
            if u not in seen:
                seen.add(u)
                uniq.append(u)
        return uniq
    except requests.RequestException:
        return []

def render_html_to_pdf(page_url: str, dest_dir: str, filename: str, wkhtmltopdf_path: str = "") -> str:
    if pdfkit is None:
        return ""
    os.makedirs(dest_dir, exist_ok=True)
    if not filename.lower().endswith(".pdf"):
        filename += ".pdf"
    out_path = os.path.join(dest_dir, filename)
    try:
        cfg = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path) if wkhtmltopdf_path else None
        options = {
            "quiet": "",
            "print-media-type": None,
            "enable-local-file-access": None
        }
        pdfkit.from_url(page_url, out_path, configuration=cfg, options=options)
        return out_path
    except Exception:
        return ""

def candidate_staff_directory_urls(domain: str, athletics_domain: str) -> List[str]:
    candidates = []
    domains = [d for d in {domain, athletics_domain} if d]
    for d in domains:
        scheme = "https://"
        base = scheme + d
        # Common patterns seen across SIDEARM/Presto/CBSi/Arbiter sites
        paths = [
            "/staff-directory",
            "/staff-directory/",
            "/athletics/staff-directory",
            "/athletics/staff-directory/",
            "/directory/staff",
            "/department/staff-directory",
            "/staff.aspx",
            "/staff.aspx?path=",
        ]
        for p in paths:
            candidates.append(base + p)
    # Also try athletics.<domain>
    if domain:
        candidates.append(f"https://athletics.{domain}/staff-directory")
        candidates.append(f"https://athletics.{domain}/staff-directory/")
    # Deduplicate while preserving order
    seen = set()
    uniq = []
    for u in candidates:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq

def html_has_staff_directory_signals(html_text: str) -> bool:
    text = (html_text or "").lower()
    needles = [
        "staff directory",
        "athletics",
        "coaches",
        "athletic department",
        "sports information",
    ]
    return any(n in text for n in needles)

def url_title_snippet_heuristic(url: str, title: str, snippet: str) -> bool:
    url_l = (url or "").lower()
    title_l = (title or "").lower()
    snip_l = (snippet or "").lower()
    signals = [
        "athletics", "athletic", "coach", "coaches", "sports information", "communications", "directory"
    ]
    in_url = any(s in url_l for s in signals)
    in_meta = any(s in title_l or s in snip_l for s in signals)
    return in_url or in_meta

def slugify(value: str) -> str:
    value = (value or "").strip()
    value = re.sub(r"[\\/:*?\"<>|]+", "_", value)
    value = re.sub(r"\s+", "_", value)
    return value[:150] if value else "file"

def make_pdf_filename(institution: str, domain: str, title: str, url: str) -> str:
    parsed = urlparse(url)
    name_part = slugify(f"{institution}_{domain}_{title}")
    h = hashlib.sha256(url.encode("utf-8")).hexdigest()[:10]
    base = os.path.basename(parsed.path) or "document.pdf"
    if not base.lower().endswith(".pdf"):
        base += ".pdf"
    return f"{name_part}_{h}.pdf"

def download_pdf(url: str, dest_dir: str, filename: str, timeout: int=30) -> str:
    os.makedirs(dest_dir, exist_ok=True)
    path = os.path.join(dest_dir, filename)
    try:
        with requests.get(url, stream=True, timeout=timeout) as r:
            r.raise_for_status()
            with open(path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
        return path
    except requests.RequestException:
        return ""

def google_search(api_key: str, cx: str, query: str, start: int=1) -> List[Dict]:
    """
    Google Custom Search JSON API.
    - start: 1-based index of first result (increments by 10)
    Returns list of dicts with name/url/snippet.
    """
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": api_key,
        "cx": cx,
        "q": query,
        "num": 10,
        "start": start
    }
    r = requests.get(url, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    out = []
    for item in data.get("items", []):
        out.append({
            "name": item.get("title",""),
            "url": item.get("link",""),
            "snippet": item.get("snippet","")
        })
    return out

def ensure_dir(p): os.makedirs(p, exist_ok=True)

def main():
    with open("config.json","r") as f:
        cfg = json.load(f)

    api_key = cfg["google_api_key"]
    cx = cfg["google_cx"]
    outdir = cfg.get("output_dir","output")
    ensure_dir(outdir)
    pdfs_dir = os.path.join(outdir, cfg.get("pdf_output_dir", "pdfs"))
    should_download = bool(cfg.get("download_pdfs", False))
    delay_ms = int(cfg.get("delay_ms_between_api_calls", 0))
    html_to_pdf = bool(cfg.get("html_to_pdf_fallback", False))
    wkhtmltopdf_path = cfg.get("wkhtmltopdf_path", "")

    institutions = load_institutions(cfg)
    if len(cfg.get("states_filter", []))>0:
        states = set([s.strip().upper() for s in cfg["states_filter"]])
        institutions = institutions[institutions["state"].str.upper().isin(states)].reset_index(drop=True)

    seen_urls = set()
    rows = []
    for _, row in tqdm(institutions.iterrows(), total=len(institutions), desc="Searching"):
        name = row["name"]
        state = row["state"]
        website = row["website"]
        domain = extract_domain(website)
        athletics_domain = extract_domain(row.get("athletics_domain", ""))
        if not domain:
            continue

        queries = build_queries(name, domain, athletics_domain)
        found_for_school = 0

        for q in queries[:cfg.get("queries_per_school",6)]:
            # paginate up to N pages per query
            for page in range(cfg.get("per_query_max_pages",3)):
                start_index = 1 + page * 10
                try:
                    results = google_search(api_key, cx, q, start=start_index)
                except Exception:
                    break  # stop this query on error/rate limit

                if not results:
                    break

                for it in results:
                    url = it["url"]
                    title = it.get("name", "")
                    snippet = it.get("snippet", "")
                    # If result is HTML but looks like an athletics directory, mine that page for PDF links
                    if not url.lower().endswith(".pdf"):
                        if cfg.get("probe_html_for_pdfs", True) and url_title_snippet_heuristic(url, title, snippet):
                            pdf_links = find_linked_pdfs_from_html(url, timeout=cfg.get("timeout_seconds",15))
                            added_from_html = 0
                            for pdf_url in pdf_links:
                                if pdf_url in seen_urls:
                                    continue
                                status, ctype, final_pdf_url = head_ok(pdf_url, timeout=cfg.get("timeout_seconds",15))
                                if status is None:
                                    continue
                                heuristic_ok = url_title_snippet_heuristic(final_pdf_url, title, snippet)
                                ok, hits = keyword_probe(final_pdf_url,
                                                         timeout=cfg.get("timeout_seconds",15),
                                                         max_bytes=cfg.get("keyword_probe_bytes",120000),
                                                         min_hits=cfg.get("min_keyword_hits",1))
                                confidence = "high" if ok else "low"
                                saved_path = ""
                                if should_download and (ok or heuristic_ok):
                                    filename = make_pdf_filename(name, domain, title, final_pdf_url)
                                    saved_path = download_pdf(final_pdf_url, pdfs_dir, filename, timeout=max(30, cfg.get("timeout_seconds",15)))
                                seen_urls.add(pdf_url)
                                rows.append({
                                    "unitid": row.get("unitid",""),
                                    "institution": name,
                                    "state": state,
                                    "domain": domain,
                                    "pdf_title": title,
                                    "url": final_pdf_url,
                                    "status_code": status,
                                    "content_type": ctype,
                                    "query_used": q + " [html-probe]",
                                    "keyword_hits": hits,
                                    "confidence": confidence,
                                    "heuristic_match": heuristic_ok,
                                    "saved_path": saved_path,
                                    "discovered_at": datetime.utcnow().isoformat()+"Z"
                                })
                                found_for_school += 1
                                added_from_html += 1
                                if found_for_school >= cfg.get("max_results_per_school",5):
                                    break
                                if added_from_html >= cfg.get("max_html_pdfs_per_result", 3):
                                    break
                        # If we still want a PDF copy and none were linked, optionally render HTML page to PDF
                        if html_to_pdf and should_download and (not url.lower().endswith('.pdf')) and url_title_snippet_heuristic(url, title, snippet):
                            filename = make_pdf_filename(name, domain, title + "_HTML", url)
                            saved = render_html_to_pdf(url, pdfs_dir, filename, wkhtmltopdf_path=wkhtmltopdf_path)
                            if saved:
                                rows.append({
                                    "unitid": row.get("unitid",""),
                                    "institution": name,
                                    "state": state,
                                    "domain": domain,
                                    "pdf_title": title + " (HTML rendered)",
                                    "url": url,
                                    "status_code": 200,
                                    "content_type": "text/html",
                                    "query_used": q + " [html-render]",
                                    "keyword_hits": 0,
                                    "confidence": "medium",
                                    "heuristic_match": True,
                                    "saved_path": saved,
                                    "discovered_at": datetime.utcnow().isoformat()+"Z"
                                })
                                found_for_school += 1
                        # Skip to next search result (we only harvest PDFs or PDFs from HTML pages)
                        continue
                    if url in seen_urls:
                        continue

                    status, ctype, final_url = head_ok(url, timeout=cfg.get("timeout_seconds",15))
                    if status is None:
                        continue

                    heuristic_ok = url_title_snippet_heuristic(final_url, title, snippet)

                    ok, hits = keyword_probe(final_url,
                                             timeout=cfg.get("timeout_seconds",15),
                                             max_bytes=cfg.get("keyword_probe_bytes",120000),
                                             min_hits=cfg.get("min_keyword_hits",1))
                    confidence = "high" if ok else "low"

                    saved_path = ""
                    if should_download and (ok or heuristic_ok):
                        filename = make_pdf_filename(name, domain, title, final_url)
                        saved_path = download_pdf(final_url, pdfs_dir, filename, timeout=max(30, cfg.get("timeout_seconds",15)))

                    seen_urls.add(url)
                    rows.append({
                        "unitid": row.get("unitid",""),
                        "institution": name,
                        "state": state,
                        "domain": domain,
                        "pdf_title": title,
                        "url": final_url,
                        "status_code": status,
                        "content_type": ctype,
                        "query_used": q,
                        "keyword_hits": hits,
                        "confidence": confidence,
                        "heuristic_match": heuristic_ok,
                        "saved_path": saved_path,
                        "discovered_at": datetime.utcnow().isoformat()+"Z"
                    })
                    found_for_school += 1
                    if found_for_school >= cfg.get("max_results_per_school",5):
                        break

                if found_for_school >= cfg.get("max_results_per_school",5):
                    break

            if found_for_school >= cfg.get("max_results_per_school",5):
                break

            if delay_ms > 0:
                time.sleep(delay_ms/1000.0)

        # Fallback: if nothing found via search, probe common staff-directory URLs directly
        if found_for_school == 0 and cfg.get("probe_common_staff_urls", True):
            for test_url in candidate_staff_directory_urls(domain, athletics_domain):
                try:
                    r = requests.get(test_url, timeout=cfg.get("timeout_seconds",15), allow_redirects=True)
                except requests.RequestException:
                    continue
                if r.status_code >= 400:
                    continue
                if not r.headers.get("content-type", "").lower().startswith("text/html"):
                    continue
                if not html_has_staff_directory_signals(r.text):
                    continue
                # Extract PDFs linked from the staff directory HTML
                pdf_links = find_linked_pdfs_from_html(r.url, timeout=cfg.get("timeout_seconds",15))
                added = 0
                for pdf_url in pdf_links:
                    if pdf_url in seen_urls:
                        continue
                    status, ctype, final_pdf_url = head_ok(pdf_url, timeout=cfg.get("timeout_seconds",15))
                    if status is None:
                        continue
                    ok, hits = keyword_probe(final_pdf_url,
                                             timeout=cfg.get("timeout_seconds",15),
                                             max_bytes=cfg.get("keyword_probe_bytes",120000),
                                             min_hits=cfg.get("min_keyword_hits",1))
                    confidence = "high" if ok else "low"
                    saved_path = ""
                    if should_download and (ok or cfg.get("download_from_staff_html_anyway", True)):
                        filename = make_pdf_filename(name, domain, f"StaffDirectory_{added+1}", final_pdf_url)
                        saved_path = download_pdf(final_pdf_url, pdfs_dir, filename, timeout=max(30, cfg.get("timeout_seconds",15)))
                    seen_urls.add(pdf_url)
                    rows.append({
                        "unitid": row.get("unitid",""),
                        "institution": name,
                        "state": state,
                        "domain": domain,
                        "pdf_title": f"Linked PDF {added+1}",
                        "url": final_pdf_url,
                        "status_code": status,
                        "content_type": ctype,
                        "query_used": "staff-url-fallback",
                        "keyword_hits": hits,
                        "confidence": confidence,
                        "heuristic_match": True,
                        "saved_path": saved_path,
                        "discovered_at": datetime.utcnow().isoformat()+"Z"
                    })
                    found_for_school += 1
                    added += 1
                    if found_for_school >= cfg.get("max_results_per_school",5):
                        break
                # Optionally render HTML when no PDFs linked
                if added == 0 and html_to_pdf and should_download:
                    filename = make_pdf_filename(name, domain, "Staff_Directory_HTML", r.url)
                    saved = render_html_to_pdf(r.url, pdfs_dir, filename, wkhtmltopdf_path=wkhtmltopdf_path)
                    if saved:
                        rows.append({
                            "unitid": row.get("unitid",""),
                            "institution": name,
                            "state": state,
                            "domain": domain,
                            "pdf_title": "Staff Directory (HTML rendered)",
                            "url": r.url,
                            "status_code": r.status_code,
                            "content_type": r.headers.get("content-type",""),
                            "query_used": "staff-url-fallback [html-render]",
                            "keyword_hits": 0,
                            "confidence": "medium",
                            "heuristic_match": True,
                            "saved_path": saved,
                            "discovered_at": datetime.utcnow().isoformat()+"Z"
                        })
                        found_for_school += 1
                if found_for_school >= cfg.get("max_results_per_school",5):
                    break

    out_csv = os.path.join(outdir, "athletics_staff_directory_pdfs.csv")
    pd.DataFrame(rows).to_csv(out_csv, index=False)
    print(f"Wrote {len(rows)} rows to {out_csv}")

if __name__ == "__main__":
    main()

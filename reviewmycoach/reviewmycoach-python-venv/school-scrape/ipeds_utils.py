# ipeds_utils.py (replace entire file)

import os, re, zipfile
from io import BytesIO
import pandas as pd

def _read_csv_with_fallback(path_or_buf):
    # Try utf-8, then latin-1
    try:
        return pd.read_csv(path_or_buf)
    except UnicodeDecodeError:
        return pd.read_csv(path_or_buf, encoding="latin1")

def _read_any_table(path_or_bytes):
    """
    Accepts:
      - Path to .csv / .xlsx / .xls / .zip (containing a single CSV)
      - Bytes of CSV/XLSX (XLSX bytes start with PK)
    """
    # Bytes input
    if isinstance(path_or_bytes, (bytes, bytearray)):
        bio = BytesIO(path_or_bytes)
        bio.seek(0)
        if bio.read(2) == b"PK":  # XLSX (zip)
            bio.seek(0)
            x = pd.ExcelFile(bio)
            sheet = next((s for s in x.sheet_names if "public" in s.lower()), x.sheet_names[0])
            return x.parse(sheet)
        bio.seek(0)
        return _read_csv_with_fallback(bio)

    # Path input
    p = str(path_or_bytes)
    low = p.lower()
    if low.endswith(".zip"):
        with zipfile.ZipFile(p) as z:
            # Pick the first *.csv inside
            csv_names = [n for n in z.namelist() if n.lower().endswith(".csv")]
            if not csv_names:
                raise ValueError("ZIP does not contain a CSV")
            with z.open(csv_names[0]) as f:
                return _read_csv_with_fallback(f)
    if low.endswith(".xlsx") or low.endswith(".xls"):
        x = pd.ExcelFile(p)
        sheet = next((s for s in x.sheet_names if "public" in s.lower()), x.sheet_names[0])
        return x.parse(sheet)
    # CSV
    return _read_csv_with_fallback(p)

def _normalize_domain(url: str) -> str:
    if not isinstance(url, str) or not url.strip():
        return ""
    url = url.strip()
    if not re.match(r'^https?://', url):
        url = "http://" + url
    from urllib.parse import urlparse
    host = urlparse(url).netloc.lower()
    return host[4:] if host.startswith("www.") else host

def load_institutions(cfg) -> pd.DataFrame:
    """
    Load institutions from user-supplied CSV/XLSX/ZIP (IPEDS HD2023 zip works).
    Returns DataFrame with columns: unitid (opt), name, state, website
    """
    path = (cfg.get("institutions_csv") or "").strip()
    if not path:
        raise ValueError("institutions_csv must point to IPEDS HD CSV/XLSX/ZIP locally (set it in config.json).")

    df = _read_any_table(path)

    # Map common IPEDS + Carnegie headers
    cols = {c.lower(): c for c in df.columns}
    name_col   = cols.get("institution name") or cols.get("instnm") or cols.get("name") or list(df.columns)[0]
    state_col  = cols.get("state") or cols.get("stabbr") or cols.get("usps") or cols.get("state abbreviation")
    web_col    = cols.get("website") or cols.get("insturl") or cols.get("webaddr") or cols.get("url")
    unitid_col = cols.get("unitid") or cols.get("ipeds unitid")
    ath_col    = cols.get("athurl") or cols.get("athletics url")

    if not web_col:
        # If no website column exists, create empty and drop later
        df["website"] = ""
        web_col = "website"

    out = pd.DataFrame({
        "unitid": df[unitid_col] if unitid_col in df.columns else "",
        "name": df[name_col],
        "state": df[state_col] if state_col in df.columns else "",
        "website": df[web_col],
        "athletics_domain": df[ath_col] if ath_col in df.columns else ""
    })

    out["website"] = out["website"].fillna("").astype(str)
    out["website"] = out["website"].apply(_normalize_domain)
    out["athletics_domain"] = out["athletics_domain"].fillna("").astype(str)
    out["athletics_domain"] = out["athletics_domain"].apply(_normalize_domain)
    # Drop rows without a valid domain
    out = out[out["website"] != ""].drop_duplicates(subset=["website"]).reset_index(drop=True)
    return out

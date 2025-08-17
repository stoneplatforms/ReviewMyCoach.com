import re
from urllib.parse import urlparse

def extract_domain(website: str) -> str:
    if not website:
        return ""
    if not website.startswith("http"):
        website = "http://" + website
    try:
        host = urlparse(website).netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""

def build_queries(name: str, domain: str, athletics_domain: str = ""):
    """
    Generate multiple query patterns to maximize chances of PDF staff directories.
    """
    # Focus on athletics staff directory PDFs (reduce noise from generic "directory"/handbooks)
    base = [
        f'site:{domain} "athletics staff directory" filetype:pdf',
        f'site:{domain} "athletic staff directory" filetype:pdf',
        f'site:{domain} "staff directory" "athletics" filetype:pdf',
        f'site:athletics.{domain} "staff directory" filetype:pdf',
        f'site:{domain} "athletics directory" filetype:pdf',
        f'site:{domain} ("coaches directory" OR "coaches contact") filetype:pdf'
    ]
    # Include institution name for broader coverage
    wide = [
        f'"{name}" "athletics staff directory" filetype:pdf',
        f'"{name}" athletics "staff directory" filetype:pdf'
    ]
    # If explicit athletics domain exists in IPEDS, search it too
    if athletics_domain and athletics_domain != domain:
        base += [
            f'site:{athletics_domain} "staff directory" filetype:pdf',
            f'site:{athletics_domain} ("coaches" OR "directory") filetype:pdf'
        ]
    # Add HTML-focused queries so we can probe pages like /staff-directory and mine linked PDFs
    html_q = [
        f'site:{domain} ("staff directory" AND athletics)',
        f'site:athletics.{domain} "staff directory"',
        f'site:{domain} inurl:staff-directory',
    ]
    if athletics_domain and athletics_domain != domain:
        html_q += [
            f'site:{athletics_domain} "staff directory"',
            f'site:{athletics_domain} inurl:staff-directory'
        ]
    return base + wide + html_q

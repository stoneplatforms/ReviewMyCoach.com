import pdfplumber
import re

def debug_rowan_pdf():
    """Debug the Rowan PDF to see how sports are indicated."""
    print("🔍 Debugging Rowan University PDF structure...")
    
    with pdfplumber.open("pdfs/Staff Directory - Rowan University Athletics.pdf") as pdf:
        all_text = ""
        for page_num, page in enumerate(pdf.pages, 1):
            page_text = page.extract_text()
            if page_text:
                all_text += page_text + "\n"
                if page_num <= 2:  # Show first 2 pages
                    print(f"\n📄 PAGE {page_num} TEXT (first 1000 chars):")
                    print("-" * 50)
                    print(page_text[:1000])
    
    print(f"\n🔍 Looking for sport indicators...")
    lines = all_text.splitlines()
    
    # Look for lines that might indicate sports
    sport_indicators = []
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        if any(sport in line_lower for sport in ['basketball', 'soccer', 'football', 'baseball', 'swimming', 'volleyball', 'lacrosse', 'track', 'field hockey']):
            sport_indicators.append((i, line.strip()))
            # Show context (previous and next lines)
            context_start = max(0, i-2)
            context_end = min(len(lines), i+3)
            print(f"\n🏃‍♂️ SPORT CONTEXT around line {i}:")
            for j in range(context_start, context_end):
                marker = ">>> " if j == i else "    "
                print(f"{marker}{j:3d}: {lines[j].strip()}")
    
    print(f"\n📊 Found {len(sport_indicators)} lines with sport indicators")
    
    # Look for email patterns and their context
    print(f"\n📧 EMAIL CONTEXT ANALYSIS:")
    for i, line in enumerate(lines):
        if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', line) and 'coach' in line.lower():
            print(f"\n📧 Email line {i}: {line.strip()}")
            # Show context around email
            context_start = max(0, i-3)
            context_end = min(len(lines), i+2)
            for j in range(context_start, context_end):
                if j != i:
                    print(f"    {j:3d}: {lines[j].strip()}")

if __name__ == "__main__":
    debug_rowan_pdf()
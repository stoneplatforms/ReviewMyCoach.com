import argparse
import re
import pdfplumber
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

def extract_and_format_phone(line, area_code):
    """
    Extract phone number from line and format with area code if needed.
    """
    # Phone number patterns
    phone_patterns = [
        r'\(\d{3}\)\s*\d{3}-\d{4}',      # (856) 256-4687
        r'\(\d{3}\)\s*\d{3}\.\d{4}',      # (856) 256.4687
        r'\d{3}-\d{3}-\d{4}',             # 856-256-4687
        r'\d{3}\.\d{3}\.\d{4}',           # 856.256.4687
        r'\d{3}\s+\d{3}-\d{4}',           # 856 256-4687
        r'\d{3}-\d{4}',                   # 256-4687 (7-digit)
        r'\d{3}\.\d{4}',                  # 256.4687 (7-digit)
        r'\b\d{7}\b'                      # 2564687 (7-digit no separator)
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, line)
        if match:
            phone = match.group().strip()
            
            # If it's a 7-digit number and we have an area code, add it
            if area_code and (re.match(r'^\d{3}-\d{4}$', phone) or 
                             re.match(r'^\d{3}\.\d{4}$', phone) or 
                             re.match(r'^\d{7}$', phone)):
                if re.match(r'^\d{7}$', phone):
                    # Format 7-digit number with dash
                    phone = phone[:3] + '-' + phone[3:]
                
                return f"({area_code}) {phone}"
            
            # If it already has area code, clean up format
            elif re.match(r'^\d{3}-\d{3}-\d{4}$', phone):
                area = phone[:3]
                number = phone[4:]
                return f"({area}) {number}"
            
            elif re.match(r'^\d{3}\s+\d{3}-\d{4}$', phone):
                parts = phone.split()
                area = parts[0]
                number = parts[1]
                return f"({area}) {number}"
            
            # Return as-is if already well formatted
            elif re.match(r'^\(\d{3}\)', phone):
                return phone
            
            # For other formats, return as-is
            else:
                return phone
    
    return None

def parse_pdf(path, output_txt=None):
    """
    Extract lines with emails from PDF and parse first/last names + username.
    Filter for entries that contain 'coach' in their title/line.
    Also supports text files for testing purposes.
    Detects area codes and adds them to phone numbers.
    """
    entries = []
    all_lines = []  # Store all lines for txt output
    area_code = None  # Store detected area code
    
    # Check if file is a text file (for testing) or PDF
    if path.lower().endswith('.txt'):
        # Handle text file for testing
        print(f"📝 Processing text file: {path}")
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        # Handle PDF file
        print(f"📄 Processing PDF file: {path}")
        with pdfplumber.open(path) as pdf:
            text = "\n".join(
                page.extract_text() 
                for page in pdf.pages 
                if page.extract_text()
            )

    # Extract area code from the text (Rhode Island commonly uses 401)
    area_code_patterns = [
        r'Area Code \((\d{3})\)',
        r'Area Code: \((\d{3})\)',
        r'Area Code (\d{3})',
        r'Area Code: (\d{3})',
        r'\((\d{3})\) area code'
    ]
    
    for pattern in area_code_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            area_code = match.group(1)
            print(f"📞 Detected area code: ({area_code})")
            break
    
    if not area_code:
        print("⚠️  No area code detected - phone numbers will remain as-is")

    # each line with an email becomes one entry
    for line in text.splitlines():
        m = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', line)
        if not m:
            continue
        
        # Filter for lines containing "coach" (case-insensitive)
        if "coach" not in line.lower():
            continue
            
        email = m.group()
        name_part = line[:m.start()].strip()
        
        # Extract and format phone number
        phone_number = extract_and_format_phone(line, area_code)
        
        # Store full line for txt output
        all_lines.append(line.strip())

        # drop common prefixes
        tokens = name_part.split()
        if tokens and tokens[0].lower() in ("dr.", "dr"):
            tokens = tokens[1:]

        # assume first two tokens are name
        first_name = tokens[0] if tokens else ""
        last_name  = tokens[1] if len(tokens) > 1 else ""
        username   = email.split("@", 1)[0]

        entry = {
            "first_name": first_name,
            "last_name":  last_name,
            "email":      email,
            "username":   username,
            "full_line":  line.strip(),  # Store original line for reference
            "role": "coach"  # Add role identifier
        }
        
        # Add phone number if found
        if phone_number:
            entry["phone"] = phone_number
        
        entries.append(entry)
    
    # Output to txt file if specified
    if output_txt and entries:
        write_to_txt(entries, all_lines, output_txt)
    
    return entries

def write_to_txt(entries, all_lines, output_path):
    """
    Write filtered coach entries to a txt file for quick review.
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"COACH ENTRIES FOUND - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 60 + "\n\n")
        
        f.write(f"Total coaches found: {len(entries)}\n\n")
        
        f.write("PARSED ENTRIES:\n")
        f.write("-" * 40 + "\n")
        
        for i, entry in enumerate(entries, 1):
            f.write(f"{i}. {entry['first_name']} {entry['last_name']}\n")
            f.write(f"   Email: {entry['email']}\n")
            f.write(f"   Username: {entry['username']}\n")
            if 'phone' in entry:
                f.write(f"   Phone: {entry['phone']}\n")
            f.write(f"   Original line: {entry['full_line']}\n")
            f.write("\n")
        
        f.write("\n" + "=" * 60 + "\n")
        f.write("RAW LINES WITH 'COACH' KEYWORD:\n")
        f.write("-" * 40 + "\n")
        
        for line in all_lines:
            f.write(f"• {line}\n")
    
    print(f"✔ Results written to {output_path}")

def map_to_coach_profile(entry):
    """
    Map scraped coach data to ReviewMyCoach coach profile structure.
    """
    # Extract sport from role if possible
    sports = []
    role_text = entry.get('full_line', '').lower()
    sport_keywords = {
        'soccer': 'Soccer',
        'football': 'Soccer',  # In case they use "football" to mean soccer
        'men\'s soccer': 'Soccer',
        'mens soccer': 'Soccer',
        'goalkeeper': 'Soccer',
        'goalie': 'Soccer',
        'midfielder': 'Soccer',
        'defender': 'Soccer',
        'forward': 'Soccer',
        'striker': 'Soccer',
        # Keep other common sports as fallback
        'baseball': 'Baseball',
        'basketball': 'Basketball',
        'tennis': 'Tennis',
        'swimming': 'Swimming',
        'track': 'Track & Field',
        'field': 'Track & Field',
        'cross country': 'Cross Country',
        'volleyball': 'Volleyball',
        'golf': 'Golf',
        'wrestling': 'Wrestling',
        'lacrosse': 'Lacrosse',
        'softball': 'Softball',
        'hockey': 'Hockey',
        'rowing': 'Rowing',
        'strength': 'Strength & Conditioning',
        'conditioning': 'Strength & Conditioning'
    }
    
    for keyword, sport in sport_keywords.items():
        if keyword in role_text and sport not in sports:
            sports.append(sport)
    
    # If no sport detected, default to Soccer since this is Men's Soccer Coaches PDF
    if not sports:
        sports = ['Soccer']
    
    # Extract role/title from the line
    role_part = entry.get('full_line', '')
    if 'coach' in role_part.lower():
        # Try to extract the coaching role
        role_match = re.search(r'(Head Coach|Assistant Coach|Defensive Coordinator|[A-Za-z\s]+Coach)', role_part, re.IGNORECASE)
        role = role_match.group(1) if role_match else 'Coach'
    else:
        role = 'Coach'
    
    # Create complete coach profile matching the app structure
    coach_profile = {
        'username': entry['username'],
        'displayName': f"{entry['first_name']} {entry['last_name']}".strip(),
        'email': entry['email'],
        'bio': f"Experienced {role.lower()} specializing in {', '.join(sports).lower()}.",
        'sports': sports,
        'experience': 5,  # Default to 5 years
        'certifications': [],
        'hourlyRate': 0,  # To be set during profile completion
        'location': 'Smithfield, Rhode Island',  # Based on Bryant University location
        'availability': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'specialties': sports,
        'languages': ['English'],
        'organization': 'Bryant University Athletics',
        'role': role,
        'gender': '',  # To be filled during claiming
        'ageGroup': ['Adult', 'Teen', 'Youth'],
        'sourceUrl': 'Bryant University Men\'s Soccer Coaches Directory',
        'averageRating': 0,
        'totalReviews': 0,
        'isVerified': False,
        'isPublic': True,  # Required by search API to show in results
        'hasActiveServices': False,  # Will be set to True when services are added
        'profileImage': '',
        'website': '',
        'socialMedia': {
            'instagram': '',
            'twitter': '',
            'linkedin': ''
        },
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP,
        'profileCompleted': False,
        'isClaimed': False,  # Key field for claiming system
        'userId': None,  # Will be linked when claimed
        'claimedAt': None,
        'verificationStatus': 'pending'  # pending, in_review, verified, rejected
    }
    
    # Add phone number if available
    if 'phone' in entry:
        coach_profile['phoneNumber'] = entry['phone']
    
    return coach_profile

def upload_to_firestore(entries, key_path, collection='coaches', dry_run=False):
    """
    Initialize Firebase Admin and upload coach profiles to Firestore.
    Creates unclaimed coach profiles that can be claimed during onboarding.
    """
    if dry_run:
        print("DRY RUN MODE - No actual upload to Firestore")
        for e in entries:
            coach_profile = map_to_coach_profile(e)
            phone_info = f" | Phone: {coach_profile.get('phoneNumber', 'N/A')}" if 'phoneNumber' in coach_profile else ""
            print(f"[DRY RUN] Would create unclaimed coach profile: {coach_profile['displayName']} ({coach_profile['email']}) → coaches/{coach_profile['username']}{phone_info}")
        return
    
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    uploaded_count = 0
    skipped_count = 0

    for e in entries:
        try:
            coach_profile = map_to_coach_profile(e)
            username = coach_profile['username']
            
            # Check if coach profile already exists
            coach_ref = db.collection('coaches').document(username)
            existing_coach = coach_ref.get()
            
            if existing_coach.exists:
                existing_data = existing_coach.to_dict()
                if existing_data.get('isClaimed', False):
                    print(f"⏭️  Skipped {coach_profile['email']} - already claimed by user")
                    skipped_count += 1
                    continue
                else:
                    print(f"🔄 Updating unclaimed profile for {coach_profile['email']}")
            
            # Upload/update the coach profile
            coach_ref.set(coach_profile)
            
            phone_info = f" | Phone: {coach_profile.get('phoneNumber', 'N/A')}" if 'phoneNumber' in coach_profile else ""
            status = "Updated" if existing_coach.exists else "Created"
            print(f"✔ {status} unclaimed coach profile: {coach_profile['displayName']} ({coach_profile['email']}) → coaches/{username}{phone_info}")
            uploaded_count += 1
            
        except Exception as error:
            print(f"❌ Error processing {e['email']}: {error}")
    
    print(f"\n📊 Upload Summary:")
    print(f"✔ {uploaded_count} coach profiles created/updated")
    print(f"⏭️  {skipped_count} profiles skipped (already claimed)")
    print(f"📧 Coaches can now claim their profiles during onboarding using their email address")

def main():
    p = argparse.ArgumentParser(
        description="Import coaches from Bryant University Men's Soccer PDF into Firestore (filters for 'coach' keyword)"
    )
    p.add_argument("--pdf", default="pdfs/Men's Soccer Coaches - Bryant University.pdf", help="Path to the PDF file (default: Bryant University Men's Soccer Coaches)")
    p.add_argument("--key", help="Path to Firebase Admin JSON key (optional for dry-run)")
    p.add_argument(
        "--collection", default="coaches",
        help="Firestore collection to write documents into (default: coaches)"
    )
    p.add_argument(
        "--output-txt", 
        help="Path to output txt file for quick review (e.g., coaches_found.txt)"
    )
    p.add_argument(
        "--dry-run", action="store_true",
        help="Parse and show results without uploading to Firestore"
    )
    args = p.parse_args()

    # Set default output txt file if not specified
    if not args.output_txt:
        pdf_name = os.path.splitext(os.path.basename(args.pdf))[0]
        args.output_txt = f"coaches_filtered_{pdf_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"

    coaches = parse_pdf(args.pdf, args.output_txt)
    print(f"Found {len(coaches)} coach entries (filtered from PDF).")
    
    if len(coaches) == 0:
        print("No entries with 'coach' keyword found in the PDF.")
        return
    
    # Upload to Firestore if not dry run and key is provided
    if not args.dry_run and args.key:
        upload_to_firestore(coaches, args.key, args.collection)
    elif args.dry_run:
        upload_to_firestore(coaches, None, args.collection, dry_run=True)
    elif not args.key:
        print("No Firebase key provided - results only saved to txt file.")
        print(f"To upload to Firestore, run with --key path/to/firebase-key.json")

if __name__ == "__main__":
    main()
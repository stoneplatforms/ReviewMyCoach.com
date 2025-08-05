#!/usr/bin/env python3
"""
Test script to demonstrate the upload-coaches functionality with sample data.
Creates a sample text file that mimics PDF output to test the filtering logic.
"""

import os
import tempfile
from datetime import datetime

def create_sample_data():
    """Create sample data that mimics what would be extracted from a PDF"""
    sample_lines = [
        "Dr. John Smith, Basketball Coach, john.smith@university.edu, ext. 1234",
        "Mary Johnson, Administrative Assistant, mary.j@university.edu, ext. 5678", 
        "Prof. Sarah Wilson, Tennis Coach, s.wilson@university.edu, ext. 9012",
        "Mike Brown, IT Support, mike.brown@university.edu, ext. 3456",
        "Lisa Davis, Swimming Coach, l.davis@university.edu, ext. 7890",
        "Robert Taylor, Dean of Students, r.taylor@university.edu, ext. 2345",
        "Dr. Emily Chen, Volleyball Coach, e.chen@university.edu, ext. 6789",
        "David Martinez, Facilities Manager, d.martinez@university.edu, ext. 4567",
        "Amanda Rodriguez, Soccer Coach, a.rodriguez@university.edu, ext. 8901",
        "James Wilson, Professor of Mathematics, j.wilson@university.edu, ext. 1357"
    ]
    return sample_lines

def filter_coaches(lines):
    """Apply the same coach filtering logic as the main script"""
    coach_lines = []
    for line in lines:
        if "coach" in line.lower():
            coach_lines.append(line)
    return coach_lines

def main():
    print("🧪 Testing Coach Filter Logic")
    print("=" * 50)
    
    # Create sample data
    sample_lines = create_sample_data()
    print(f"Total sample entries: {len(sample_lines)}")
    print("\nAll sample entries:")
    for i, line in enumerate(sample_lines, 1):
        print(f"{i:2d}. {line}")
    
    # Apply coach filter
    coach_lines = filter_coaches(sample_lines)
    print(f"\n🎯 Filtered coach entries: {len(coach_lines)}")
    print("=" * 30)
    
    for i, line in enumerate(coach_lines, 1):
        print(f"{i}. {line}")
    
    # Create a temporary file to test with the main script
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    test_file = f"sample_test_{timestamp}.txt"
    
    print(f"\n📝 Creating test file: {test_file}")
    with open(test_file, 'w') as f:
        f.write("Sample Staff Directory\n")
        f.write("=" * 50 + "\n\n")
        for line in sample_lines:
            f.write(line + "\n")
    
    print(f"✅ Test file created: {test_file}")
    print(f"\nTo test the upload script with this data:")
    print(f"python upload-coaches.py --pdf {test_file} --dry-run")
    print(f"\nExpected result: {len(coach_lines)} coach entries should be found")
    
    # Clean up instructions
    print(f"\n🧹 To clean up test file:")
    print(f"rm {test_file}")

if __name__ == "__main__":
    main()
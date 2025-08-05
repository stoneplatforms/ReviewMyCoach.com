#!/bin/bash

# Quick test script for the coach upload functionality
echo "🧪 Testing Coach Upload Script"
echo "================================"

# Activate virtual environment
echo "📦 Activating virtual environment..."
source bin/activate

# Generate test data
echo "📝 Generating sample test data..."
python test-sample.py

# Find the generated test file
TEST_FILE=$(ls sample_test_*.txt 2>/dev/null | head -1)

if [ -z "$TEST_FILE" ]; then
    echo "❌ No test file found. Running test-sample.py first..."
    python test-sample.py
    TEST_FILE=$(ls sample_test_*.txt 2>/dev/null | head -1)
fi

if [ ! -z "$TEST_FILE" ]; then
    echo "🚀 Testing upload script with: $TEST_FILE"
    python upload-coaches.py --pdf "$TEST_FILE" --dry-run
    
    echo ""
    echo "✅ Test complete!"
    echo "📄 Check the generated coaches_filtered_*.txt file for results"
    echo ""
    echo "🧹 To clean up test files:"
    echo "rm sample_test_*.txt coaches_filtered_*.txt"
else
    echo "❌ Could not create test file"
fi

echo ""
echo "🚀 To use with real PDF:"
echo "python upload-coaches.py --pdf your-staff-directory.pdf --dry-run"
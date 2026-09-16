#!/usr/bin/env python3
"""
Fix encoding corruption in HTML files caused by mojibake.
The worker read UTF-8 files as Latin-1 (cp1252), then wrote them back as UTF-8.
This script reads them back as Latin-1, re-encodes as Latin-1 (restoring original
UTF-8 bytes), then decodes as UTF-8 to recover the correct text.
"""
import os
import sys

def is_mojibake(data: bytes) -> bool:
    """Detect if file has UTF-8 read-as-Latin1 mojibake."""
    # Common patterns: "Ã©" (Ã + combining), "â‚¬" (â + combining), "Ã¡" (Ã)
    return b'\xc3\xa2' in data or b'\xc3\x83' in data or b'\xc2\x82' in data

def fix_file(path: str) -> bool:
    """Fix a single file's encoding. Returns True if changes were made."""
    with open(path, 'rb') as f:
        data = f.read()
    if not is_mojibake(data):
        return False
    try:
        # Step 1: decode the mojibake as Latin-1 (gets us the original UTF-8 bytes as text)
        # Step 2: re-encode as Latin-1 (gives us back the UTF-8 byte sequence)
        # Step 3: decode those bytes as UTF-8 (gives us the correct text)
        fixed = data.decode('latin-1').encode('latin-1').decode('utf-8')
        with open(path, 'wb') as f:
            f.write(fixed.encode('utf-8'))
        print(f"  FIXED: {path}")
        return True
    except Exception as e:
        print(f"  ERROR: {path}: {e}")
        return False

def main():
    base_dirs = ['routime/tools', 'calculia/tools']
    fixed_count = 0
    total_count = 0
    for base in base_dirs:
        if not os.path.isdir(base):
            continue
        print(f"\n=== Processing {base} ===")
        for activity in sorted(os.listdir(base)):
            for fname in ['index.html', 'strings.es.js', 'strings.en.js', 'app.js']:
                path = os.path.join(base, activity, fname)
                if os.path.isfile(path):
                    total_count += 1
                    if fix_file(path):
                        fixed_count += 1
                        # Also strip BOM if present
                        with open(path, 'rb') as f:
                            data = f.read()
                        if data.startswith(b'\xef\xbb\xbf'):
                            data = data[3:]
                            with open(path, 'wb') as f:
                                f.write(data)
    print(f"\nTotal: fixed {fixed_count}/{total_count} files")

if __name__ == '__main__':
    main()

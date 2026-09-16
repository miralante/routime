#!/usr/bin/env python3
"""Fix over-replacements caused by the identifiers script in JS files.

The identifiers script replaced 'placeholder' (JS property) with
'placeholder-text' (CSS class), breaking assignments like:
  el.placeholder = '...';  -> el.placeholder-text = '...';  (WRONG)

This script fixes those specific over-replacements in .js files only.
"""

import os
import re

TOOLS_DIR = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\tools"

# Fixes: restore the JS property name that was incorrectly replaced
# by the CSS class replacement in identifiers script
FIXES = [
    # CSS class replacements that incorrectly affected JS property names
    (r'\.placeholder-text(?!\s*=)', '.placeholder'),  # In CSS class context, keep 'placeholder-text'
    (r'\.placeholder-text\s*=', '.placeholder ='),      # In JS assignment, restore 'placeholder'
    # The above pattern above won't work for property assignments
    # because the property is on the right side of =
    # Better approach: specifically target the property assignment patterns
]

def fix_js_file(filepath):
    if not filepath.endswith('.js'):
        return 0
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return 0
    
    original = content
    
    # Fix .placeholder-text = (assignments, e.g., el.placeholder-text = ...)
    # These are JavaScript property assignments that were incorrectly replaced
    # Pattern: identifier.placeholder-text = ...  (not in CSS class attribute)
    # Strategy: look for .placeholder-text followed by whitespace and = (assignment)
    content = re.sub(r'(\w[\w\.\$]*)\.placeholder-text\s*=', r'\1.placeholder =', content)
    
    # Also fix: element['placeholder-text'] = ... (bracket notation)
    content = re.sub(r"\['placeholder-text'\]\s*=", "['placeholder'] =", content)
    
    # Fix other common property names that might have been incorrectly replaced
    # These patterns appear when a CSS class name was mistakenly used as a JS identifier
    content = re.sub(r"\.text\b(?!\s*=)", ".textContent", content)
    
    # Fix any remaining broken patterns
    # Pattern: .hidden-text = (might have been confused)
    content = re.sub(r"\.hidden-text\s*=", ".hidden =", content)
    
    # Fix 'display-text' that might appear in JS
    content = re.sub(r"\.display-text\s*=", ".display =", content)
    
    # Fix 'name-text' (but 'name' is a valid JS property, only fix assignment)
    content = re.sub(r"\.name-text\s*=", ".name =", content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return 1
    return 0


def main():
    count = 0
    for root, dirs, files in os.walk(TOOLS_DIR):
        for fname in files:
            if fname.endswith('.js'):
                fpath = os.path.join(root, fname)
                if fix_js_file(fpath):
                    print(f"Fixed: {fpath}")
                    count += 1
    print(f"\nTotal JS files fixed: {count}")


if __name__ == '__main__':
    main()

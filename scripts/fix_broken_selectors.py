#!/usr/bin/env python3
"""Fix broken $() selectors and other issues in JS files.

1. $('##id') -> $('#id') (double hash from bad replacements)
2. Fix any other broken patterns
"""

import os
import re

TOOLS_DIR = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\tools"

def fix_js_file(filepath):
    if not filepath.endswith('.js'):
        return 0
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return 0
    
    original = content
    changes = 0
    
    # Fix: $('##selector') -> $('#selector')
    # Also handles: $("##selector") -> $("#selector")
    # And: $$('##selector') -> $('#selector')
    new_content = content.replace("$('##", "$('#")
    new_content = new_content.replace('$("##', '$("#')
    new_content = new_content.replace("$$('#", "$('#")
    new_content = new_content.replace('$$("#', '$("#')
    new_content = new_content.replace("getElementById('##", "getElementById('#")
    new_content = new_content.replace('getElementById("##', 'getElementById("#')
    new_content = new_content.replace("querySelector('##", "querySelector('#")
    new_content = new_content.replace('querySelector("##', 'querySelector("#')
    
    if new_content != content:
        content = new_content
        changes += 1
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes
    return 0


def main():
    total = 0
    for root, dirs, files in os.walk(TOOLS_DIR):
        for fname in files:
            if fname.endswith('.js'):
                fpath = os.path.join(root, fname)
                n = fix_js_file(fpath)
                if n:
                    print(f"Fixed: {fpath}")
                    total += n
    print(f"\nTotal: {total} files fixed")


if __name__ == '__main__':
    main()

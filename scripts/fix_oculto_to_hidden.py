#!/usr/bin/env python3
"""Replace .oculto CSS class with .hidden across all tools JS/HTML files."""

import os
import re

TOOLS_DIR = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\tools"
ASSETS_CSS = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\assets\css\components.css"

# Patterns to replace
# In JS: classList.toggle('oculto', ...) or classList.add('oculto') or classList.remove('oculto')
# In HTML: class="... oculto ..." or class="oculto"
# In CSS: .oculto { ... }

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace in JS: 'oculto' -> 'hidden'
    content = re.sub(r"\.oculto\b", '.hidden', content)
    # Replace in HTML class attributes: ' oculto' -> ' hidden' and 'oculto ' -> 'hidden '
    content = re.sub(r'\boculto\b', 'hidden', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for root, dirs, files in os.walk(TOOLS_DIR):
    for fname in files:
        if fname.endswith(('.js', '.html', '.css')):
            fpath = os.path.join(root, fname)
            if fix_file(fpath):
                print(f"Fixed: {fpath}")
                count += 1

print(f"\nTotal files fixed: {count}")

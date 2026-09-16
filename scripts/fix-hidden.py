#!/usr/bin/env python3
"""
Fix 'hidden' → 'oculto' in routime files only.
Calculia correctly uses .hidden (their CSS has it), but routime uses .oculto.
"""
import os
import re

def fix_file(path: str) -> bool:
    """Replace 'hidden' with 'oculto' in the file."""
    with open(path, 'rb') as f:
        data = f.read()
    text = data.decode('utf-8')
    original = text
    # Replace classList.add('hidden') / classList.remove('hidden') with oculto
    text = text.replace("classList.add('hidden')", "classList.add('oculto')")
    text = text.replace("classList.remove('hidden')", "classList.remove('oculto')")
    # Replace class="...hidden..." with class="...oculto..."
    # Handle various positions
    text = re.sub(r'class="([^"]*)\bhidden\b([^"]*)"', r'class="\1oculto\2"', text)
    # Handle case "hidden" alone in class attribute
    text = re.sub(r'class="hidden\s', 'class="oculto ', text)
    text = re.sub(r'class="\s*hidden"', 'class="oculto"', text)
    text = re.sub(r'class="(\w+) hidden ', r'class="\1 oculto ', text)
    text = re.sub(r'class=" hidden (\w+)"', r'class=" oculto \1"', text)
    if text != original:
        with open(path, 'wb') as f:
            f.write(text.encode('utf-8'))
        return True
    return False

def main():
    base = 'routime/tools'
    if not os.path.isdir(base):
        print(f'Directory not found: {base}')
        return
    fixed = 0
    total = 0
    for activity in sorted(os.listdir(base)):
        for fname in ['index.html', 'app.js']:
            path = os.path.join(base, activity, fname)
            if not os.path.isfile(path):
                continue
            total += 1
            if fix_file(path):
                fixed += 1
                print(f'  FIXED: {path}')
    print(f'\nFixed {fixed}/{total} routime files')

if __name__ == '__main__':
    main()

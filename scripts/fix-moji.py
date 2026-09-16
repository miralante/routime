#!/usr/bin/env python3
"""
Fix mojibake in strings files by replacing UTF-8 double-encoded sequences
with their correct single-UTF-8 equivalents.

When UTF-8 text is read as Latin-1 and re-saved as UTF-8, common chars become:
  Ã© → é,  Ã­ → í,  Ã¡ → á,  Ã³ → ó,  Ã± → ñ,  Ãº → ú
  Ã‰ → É,  Ã‰ → Í,  Ã → Á,  Ã“ → Ó,  Ã‘ → Ñ,  Ãš → Ú
  Ã‰ → Ê,  Ã¬ → ì,  etc.
  Ã¢€" → "  (em dash),  Ã¢€" → '  (quotes),  Ã¢‚¬ → €
  Ã¢€" → ... (ellipsis)

This script finds these patterns and replaces them.
"""
import os
import re

# Mapping of Latin-1 chars that appear when UTF-8 is double-encoded
# Key: UTF-8 bytes of the CORRUPT pattern
# Value: correct UTF-8 char
MOJIBAKE_MAP = {
    # Vowels with accent
    b'\xc3\x83\xc2\xa9': '\u00a9',  # Ã© → é (but é is c3 a9 in UTF-8)
    # Wait, let me re-think. The mojibake pattern is:
    # Original UTF-8: c3 a9 (é)
    # Read as Latin-1: Ã© (two chars: Ã + ©)
    # Re-saved as UTF-8: c3 83 c2 a9
    # So c3 83 c2 a9 → should become c3 a9 (é)
    b'\xc3\x83\xc2\xa9': '\u00e9',  # é
    b'\xc3\x83\xc2\xa1': '\u00e1',  # á
    b'\xc3\x83\xc2\xb3': '\u00f3',  # ó
    b'\xc3\x83\xc2\xba': '\u00fa',  # ú
    b'\xc3\x83\xc2\xb1': '\u00f1',  # ñ
    b'\xc3\x83\xc2\xad': '\u00ed',  # í
    # Uppercase
    b'\xc3\x83\xc2\x89': '\u00c9',  # É
    b'\xc3\x83\xc2\x81': '\u00c1',  # Á
    b'\xc3\x83\xc2\x93': '\u00d3',  # Ó
    b'\xc3\x83\xc2\x9a': '\u00da',  # Ú
    b'\xc3\x83\xc2\x91': '\u00d1',  # Ñ
    b'\xc3\x83\xc2\x8d': '\u00cd',  # Í
    # Punctuation
    b'\xc3\x83\xc2\xa2': '\u00a2',  # ¢
    b'\xc3\x83\xc2\xab': '\u00ab',  # »
    b'\xc3\x83\xc2\xbb': '\u00bb',  # «
    b'\xc3\x83\xc2\xbf': '\u00bf',  # ¿
    b'\xc3\x83\xc2\xbe': '\u00be',  # ¾
    b'\xc3\x83\xc2\xb6': '\u00b6',  # ¶
    # Special
    b'\xc3\x83\xc2\xac': '\u00ac',  # ¬
    b'\xc3\x83\xc2\xb7': '\u00b7',  # ·
    b'\xc3\x83\xc2\x80': '\u00c0',  # À
    b'\xc3\x83\xc2\xa0': '\u00a0',  # (NBSP)
    b'\xc3\x83\xc2\x82': '\u00c2',  # Â
    b'\xc3\x83\xc2\x87': '\u00c7',  # Ç
    b'\xc3\x83\xc2\x8a': '\u00ca',  # Ê
    b'\xc3\x83\xc2\x8b': '\u00cb',  # Ë
    b'\xc3\x83\xc2\x8c': '\u00cc',  # Ì
    b'\xc3\x83\xc2\x8e': '\u00ce',  # Î
    b'\xc3\x83\xc2\x8f': '\u00cf',  # Ï
    b'\xc3\x83\xc2\x94': '\u00d4',  # Ô
    b'\xc3\x83\xc2\x95': '\u00d5',  # Õ
    b'\xc3\x83\xc2\x96': '\u00d6',  # Ö
    b'\xc3\x83\xc2\x97': '\u00d7',  # ×
    b'\xc3\x83\xc2\x98': '\u00d8',  # Ø
    b'\xc3\x83\xc2\x99': '\u00d9',  # Ù
    b'\xc3\x83\xc2\x9a': '\u00da',  # Ú
    b'\xc3\x83\xc2\x9b': '\u00db',  # Û
    b'\xc3\x83\xc2\x9c': '\u00dc',  # Ü
    b'\xc3\x83\xc2\x9d': '\u00dd',  # Ý
    b'\xc3\x83\xc2\x9e': '\u00de',  # Þ
    b'\xc3\x83\xc2\x9f': '\u00df',  # ß
    b'\xc3\x83\xc2\xa3': '\u00a3',  # £
    b'\xc3\x83\xc2\xa4': '\u00a4',  # ¤
    b'\xc3\x83\xc2\xa5': '\u00a5',  # ¥
    b'\xc3\x83\xc2\xa6': '\u00a6',  # ¦
    b'\xc3\x83\xc2\xa7': '\u00a7',  # §
    b'\xc3\x83\xc2\xa8': '\u00a8',  # ¨
    # â sequences (from em-dash, etc.)
    b'\xc3\xa2\xe2\x82\xac\xcb\x9c': '\u20ac',  # €
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d': '\u201d',  # "
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c': '\u201c',  # "
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x99': '\u2019',  # '
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9a': '\u201a',  # ‚
    b'\xc3\xa2\xe2\x82\xac\xc2\x9c': '\u0152',  # Œ
    b'\xc3\xa2\xe2\x82\xac\xc2\x9d': '\u0153',  # œ
    b'\xc3\xa2\xe2\x82\xac\xcb\x9d': '\u0178',  # Ÿ
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\xa6': '\u2026',  # …
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\xa0': '\u2020',  # †
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\xa1': '\u2021',  # ‡
    b'\xc3\xa2\xe2\x82\xac\xc2\xae': '\u00ae',  # ®
    b'\xc3\xa2\xe2\x82\xac\xc2\xa9': '\u00a9',  # ©
    # Common mojibake patterns for em dash
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c': '\u2014',  # —
    b'\xc3\xa2\xe2\x82\xac\xe2\x80\x93': '\u2013',  # –
    # Ã followed by combining
    b'\xc3\x83\xc2\xae': '\u00ae',  # ®
    b'\xc3\x83\xc2\xa9': '\u00a9',  # ©
    b'\xc3\x83\xc2\xbc': '\u00bc',  # ¼
    b'\xc3\x83\xc2\xbd': '\u00bd',  # ½
    b'\xc3\x83\xc2\xbe': '\u00be',  # ¾
}

def fix_mojibake_file(path):
    """Try to fix mojibake in a file. Returns True if fixed."""
    try:
        with open(path, 'rb') as f:
            data = f.read()
    except:
        return False

    original_len = len(data)
    data = bytearray(data)

    # Sort patterns by length (longest first) to avoid partial matches
    sorted_patterns = sorted(MOJIBAKE_MAP.keys(), key=len, reverse=True)

    for pattern, replacement in sorted_patterns:
        if pattern in data:
            # Replace all occurrences
            while pattern in data:
                idx = data.index(pattern)
                data[idx:idx+len(pattern)] = replacement.encode('utf-8')

    if len(data) != original_len or data != original_len:
        # Only write if changed
        try:
            with open(path, 'wb') as f:
                f.write(data)
            return True
        except Exception as e:
            print(f'  ERROR writing {path}: {e}')
            return False
    return False

def fix_all():
    base_dirs = ['routime/tools', 'calculia/tools']
    total_fixed = 0
    for base in base_dirs:
        if not os.path.isdir(base):
            continue
        print(f'\n=== Processing {base} ===')
        for activity in sorted(os.listdir(base)):
            for sf in ['strings.es.js', 'strings.en.js', 'index.html']:
                path = os.path.join(base, activity, sf)
                if os.path.isfile(path):
                    if fix_mojibake_file(path):
                        print(f'  Fixed: {path}')
                        total_fixed += 1
    print(f'\nTotal fixed: {total_fixed}')

if __name__ == '__main__':
    fix_all()

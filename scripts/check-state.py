#!/usr/bin/env python3
"""Check state of theatre/pairs files."""
paths = [
    'routime/tools/theatre/app.js',
    'routime/tools/theatre/index.html',
    'routime/tools/pairs/app.js',
    'routime/tools/pairs/index.html',
]
for path in paths:
    with open(path, 'rb') as f:
        data = f.read()
    text = data.decode('utf-8')
    has_hidden_class = 'class="hidden' in text or "class='hidden" in text
    has_hidden_js = "classList.add('hidden')" in text or "classList.remove('hidden')" in text
    has_oculto_class = 'class="oculto' in text or "class='oculto" in text
    has_oculto_js = "classList.add('oculto')" in text or "classList.remove('oculto')" in text
    print(f'{path}:')
    print(f'  hidden_class={has_hidden_class} hidden_js={has_hidden_js}')
    print(f'  oculto_class={has_oculto_class} oculto_js={has_oculto_js}')

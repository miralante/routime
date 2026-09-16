#!/usr/bin/env python3
import os

activities = [
    'where-to-store', 'blocks', 'where-is', 'whats-missing', 'clock',
    'friends', 'healthy-food', 'my-body', 'post-or-not', 'self-esteem',
    'sentence', 'signs', 'situations', 'street', 'task-list',
    'times-of-day', 'tracing', 'trust-circle', 'turns-mirrors',
    'what-do-i-need', 'what-first', 'what-to-wear',
    'fit', 'shop', 'shopping'
]

for name in activities:
    path = f'routime/tools/{name}/app.js'
    if not os.path.isfile(path):
        print(f'{name}: FILE NOT FOUND')
        continue
    with open(path, 'rb') as f:
        data = f.read()
    text = data.decode('utf-8', errors='replace')
    has_oculto = "'oculto'" in text
    has_hidden = "'hidden'" in text
    has_mojibake = 'Ã' in text
    has_stars = '#stars' in text
    has_estrellas = '#estrellas' in text
    print(f'{name}: oculto={has_oculto} hidden={has_hidden} mojibake={has_mojibake} stars={has_stars} estrellas={has_estrellas}')

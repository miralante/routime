#!/usr/bin/env python3
import re

activities = [
    'where-to-store', 'blocks', 'where-is', 'whats-missing', 'clock',
    'friends', 'healthy-food', 'my-body', 'post-or-not', 'self-esteem',
    'sentence', 'signs', 'situations', 'street', 'task-list',
    'times-of-day', 'tracing', 'trust-circle', 'turns-mirrors',
    'what-do-i-need', 'what-first', 'what-to-wear', 'whats-missing',
    'where-is', 'where-to-store', 'shop', 'shopping'
]

for name in activities:
    path = f'routime/tools/{name}/app.js'
    try:
        with open(path, 'rb') as f:
            data = f.read().decode('utf-8', errors='replace')
    except:
        print(f'{name}: FILE NOT FOUND')
        continue
    # Find variable declarations: var X = $('#id')
    vars_ = re.findall(r"var\s+(\w+)\s*=\s*\$\(['\"]#(\w+)['\"]\)", data)
    # Find btn listeners
    btns = re.findall(r"\$\(['\"]#(\w+)['\"]\)\.addEventListener\(['\"]click", data)
    # Find renderStars
    has_renderStars = 'renderStars' in data
    has_renderDifficulty = 'renderDifficulty' in data
    has_renderProgress = 'renderProgress' in data
    has_levelFromProgress = 'levelFromProgress' in data
    has_startGame = 'startGame' in data
    print(f'\n=== {name} ===')
    for vname, id_ in vars_:
        print(f'  var {vname} = $("#{id_}")')
    print(f'  Buttons: {btns}')
    print(f'  has_renderStars={has_renderStars}, renderDiff={has_renderDifficulty}, levelFrom={has_levelFromProgress}, startGame={has_startGame}')

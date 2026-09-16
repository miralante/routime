#!/usr/bin/env python3
"""
Audit state of all activities after worker modifications.
"""
import os

results = {}

for project in ['routime', 'calculia']:
    base = f'{project}/tools'
    if not os.path.isdir(base):
        continue
    for activity in sorted(os.listdir(base)):
        path = os.path.join(base, activity)
        if not os.path.isdir(path):
            continue
        result = {'project': project, 'activity': activity}
        js_path = os.path.join(path, 'app.js')
        if os.path.isfile(js_path):
            with open(js_path, 'rb') as f:
                js_data = f.read().decode('utf-8', errors='replace')
            result['js_ok'] = 'Ã' not in js_data and 'â€' not in js_data
            result['js_niveles'] = 'pintarNiveles' in js_data or 'paintLevels' in js_data
            result['js_pattern'] = 'nivelSegunProgreso' in js_data
            result['js_btnJugar'] = 'btnJugar' in js_data
            result['js_oculto'] = "'oculto'" in js_data
            result['js_hidden'] = "'hidden'" in js_data
        html_path = os.path.join(path, 'index.html')
        if os.path.isfile(html_path):
            with open(html_path, 'rb') as f:
                html_data = f.read().decode('utf-8', errors='replace')
            result['html_ok'] = 'Ã' not in html_data and 'â€' not in html_data
            result['html_startScreen'] = 'startScreen' in html_data
            result['html_pantallaInicio'] = 'pantallaInicio' in html_data
        for sf in ['strings.es.js', 'strings.en.js']:
            s_path = os.path.join(path, sf)
            if os.path.isfile(s_path):
                with open(s_path, 'rb') as f:
                    s_data = f.read().decode('utf-8', errors='replace')
                result[f'{sf}_ok'] = 'Ã' not in s_data and 'â€' not in s_data
        results[f'{project}/{activity}'] = result

print(f"{'Activity':40s} {'JS':3s} {'HTML':4s} {'STR':3s} {'PAT':3s} {'Issues'}")
print("-" * 100)
for name, r in sorted(results.items()):
    js_ok = 'OK ' if r.get('js_ok', False) else 'BAD'
    html_ok = 'OK  ' if r.get('html_ok', False) else 'BAD '
    str_ok = 'OK ' if (r.get('strings.es.js_ok', False) and r.get('strings.en.js_ok', False)) else 'BAD'
    has_pattern = 'YES' if r.get('js_pattern', False) else 'NO '
    issues = []
    if r.get('js_hidden', False):
        issues.append('JS-has-hidden')
    if r.get('js_niveles', False):
        issues.append('JS-still-has-niveles')
    if not r.get('html_ok', False):
        issues.append('HTML-bad-enc')
    if r.get('html_startScreen', False) and r.get('js_btnJugar', False):
        issues.append('ID-mismatch')
    print(f"{name:40s} {js_ok:3s} {html_ok:4s} {str_ok:3s} {has_pattern:3s} {','.join(issues)}")

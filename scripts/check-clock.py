#!/usr/bin/env python3
import re

with open('routime/tools/clock/app.js', 'rb') as f:
    data = f.read().decode('utf-8', errors='replace')

matches = re.findall(r'estrellasEl\s*=\s*\$\(["\']#(\w+)["\']\)', data)
print('estrellasEl ID:', matches)

screen_vars = re.findall(r'var\s+(\w+)\s*=\s*\$\(["\']#(\w+)["\']\)', data)
for v, id_ in screen_vars:
    print('  var ' + v + ' = $("#' + id_ + '")')

#!/usr/bin/env python3
"""Replace Spanish property names in data.js files with English equivalents."""

import os
import re

# For house/data.js:
# nombre -> name
# pasos -> steps
# iconos -> icons
# pasosPlantilla -> templateSteps
# tareas -> tasks (in context, for catalog/array name)

TOOLS_DIR = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\tools\house"

def fix_data_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace property names in data.js (house)
    # Be careful not to replace inside strings (content values)
    # Since property names are followed by : we can target those
    content = re.sub(r'\bnombre\b(?![\w\u4e00-\u9fff])', 'name', content)
    content = re.sub(r'\bpasos\b', 'steps', content)
    content = re.sub(r'\biconos\b', 'icons', content)
    content = re.sub(r'\bpasosPlantilla\b', 'templateSteps', content)
    # Only replace 'tareas:' when it's a property name (followed by colon)
    content = re.sub(r'\btareas\b(?=\s*:)', 'tasks', content)
    
    # Also fix: tareasUsuario -> userTasks (already done in app.js)
    # Fix: tareasCatalogo -> catalogTasks (already done in app.js)
    # Fix: tareasRonda -> roundTasks (already done in app.js)
    
    # Fix comments in data.js
    content = re.sub(r'# pool de emojis', '# emoji pool', content)
    content = re.sub(r'# 5 pictogramas por defecto', '# 5 default pictograms', content)
    content = re.sub(r'# tareas del hogar', '# household tasks', content)
    content = re.sub(r'# se conserva en el orden correcto', '# preserved in correct order', content)
    content = re.sub(r'# se traduce; .*? se mantienen', '# translated; steps are pictograms and are kept', content)
    content = re.sub(r'# emojis no se traducen', '# emojis are shared between locales', content)
    content = re.sub(r'# sesion por la persona', '# session by the user', content)
    content = re.sub(r'# no se persisten', '# not persisted', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if fix_data_file(os.path.join(TOOLS_DIR, 'data.js')):
    print(f"Fixed: {TOOLS_DIR}\\data.js")
else:
    print(f"No changes: {TOOLS_DIR}\\data.js")

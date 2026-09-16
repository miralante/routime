#!/usr/bin/env python3
"""Fix critical syntax errors in Routime app.js files."""
import re
from pathlib import Path

TOOLS_DIR = Path(__file__).parent.parent / "tools"

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        changes = 0
        
        # Fix .textContent.textContent = '';
        # Pattern: $('#id').textContent.textContent = '';
        # Fix: $('#id').textContent = App.i18n.t('key');
        # or just: $('#id').textContent = '';
        
        # Find all .textContent.textContent patterns
        pattern = r"\$\(['\"](\w+)['\"]\)\.textContent\.textContent\s*=\s*['\"]['\"];"
        matches = list(re.finditer(pattern, content))
        if matches:
            for m in matches:
                el_id = m.group(1)
                # Try to determine the right key based on element ID
                if 'resumen' in el_id.lower() or 'summary' in el_id.lower():
                    replacement = f"$('#{el_id}').textContent = App.i18n.t('summary', {{ n: roundHits, total: progress.stars }});"
                elif 'transfer' in el_id.lower():
                    replacement = f"App.i18n.applyTo('#{el_id}');"
                else:
                    replacement = f"$('#{el_id}').textContent = '';"
                content = content[:m.start()] + replacement + content[m.end():]
                changes += 1
        
        # Fix orphan ); followed by $ - this is broken renderLevels
        # Pattern:   );
        #       $('levelsEl')...
        orphan_pattern = r'\n  \);\n      \$'
        if re.search(orphan_pattern, content):
            # Find the broken renderLevels function and replace it
            content = re.sub(
                r'\n  \);\n      \$[^}]+\n    \}\n  \}\n',
                '',
                content
            )
            # Add a proper renderLevels function after the bank() function
            content = re.sub(
                r'(\n  function banco\(\) \{[^\}]+\}\n)',
                r'\1\n\n  /* Renders the level selection buttons. */\n  function renderLevels() {\n    levelsEl.innerHTML = \'\';\n    banco().niveles.forEach(function (level) {\n      var btn = document.createElement(\'button\');\n      btn.type = \'button\';\n      btn.className = \'btn btn-nivel\';\n      btn.innerHTML = \'<strong>\' + level.nombre + \'</strong><br><small>\' + level.descripcion + \'</small>\';\n      btn.addEventListener(\'click\', function () { selectLevel(level); });\n      levelsEl.appendChild(btn);\n    });\n  }\n',
                content
            )
            changes += 1
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes
        return 0
    except Exception as e:
        print(f"Error: {filepath} - {e}")
        return 0

def main():
    total_changes = 0
    files_fixed = 0
    
    for tool_dir in sorted(TOOLS_DIR.iterdir()):
        if not tool_dir.is_dir():
            continue
        app_js = tool_dir / "app.js"
        if app_js.exists():
            changes = fix_file(app_js)
            if changes > 0:
                print(f"Fixed {app_js.parent.name}: {changes} changes")
                total_changes += changes
                files_fixed += 1
    
    print(f"\nTotal: {files_fixed} files, {total_changes} changes")

if __name__ == "__main__":
    main()

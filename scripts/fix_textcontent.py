#!/usr/bin/env python3
"""Fix .textContent.textContent = '' in Routime app.js files."""
import re
from pathlib import Path

TOOLS_DIR = Path(__file__).parent.parent / "tools"

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix single-line pattern: $('#id').textContent.textContent = '';
        content = re.sub(
            r"\$\(['\"]([^'\"]+)['\"]\)\.textContent\.textContent\s*=\s*['\"]['\"];",
            lambda m: "$('#" + m.group(1) + "').textContent = '';",
            content
        )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error: {filepath} - {e}")
        return False

def main():
    fixed = 0
    for tool_dir in sorted(TOOLS_DIR.iterdir()):
        if not tool_dir.is_dir():
            continue
        app_js = tool_dir / "app.js"
        if app_js.exists():
            if fix_file(app_js):
                print(f"Fixed: {app_js.parent.name}")
                fixed += 1
    print(f"\nTotal: {fixed} files")

if __name__ == "__main__":
    main()

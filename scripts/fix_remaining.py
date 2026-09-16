#!/usr/bin/env python3
"""Mass-fix common issues in Routime app.js files."""
import re
import os
from pathlib import Path

TOOLS_DIR = Path(__file__).parent.parent / "tools"

def fix_textcontent_double(content):
    """Fix $('#id').textContent.textContent = '' -> $('#id').textContent = ''"""
    # Pattern: $('#resumenFinal').textContent.textContent = '';
    content = re.sub(
        r"\$\(['\"](\w+)['\"]\)\.textContent\.textContent\s*=\s*['\"]['\"];?\s*\n?",
        lambda m: "$('#" + m.group(1) + "').textContent = '';\n",
        content
    )
    # Pattern: $('#resumenFinal').textContent.textContent = '';\n $('#transferencia').textContent.textContent = '';
    content = re.sub(
        r"\$\(['\"](\w+)['\"]\)\.textContent\.textContent\s*=\s*['\"]['\"];\s*\n\s*\$\(['\"]#?transferencia['\"]\)\.textContent\.textContent\s*=\s*['\"]['\"];",
        "$('#\\1').textContent = App.i18n.t('resumenFinal', { n: roundHits, total: progress.stars });\n    App.i18n.applyTo('#transferencia');",
        content
    )
    return content

def fix_encoding(content):
    """Fix encoding corruption"""
    replacements = {
        'â­"': '⭐',
        'â€"': '...',
        'Ã³': 'ó',
        'Ã©': 'é',
        'Ã±': 'ñ',
        'Ã': 'í',
        'Ã¼': 'ü',
        'â†"': '->',
        'â†': '->',
        '4Ã—4': '4x4',
    }
    for old, new in replacements.items():
        content = content.replace(old, new)
    return content

def fix_spanish_vars(content):
    """Fix common Spanish variable/function names to English"""
    replacements = [
        ('pantallaInicio', 'startScreen'),
        ('pantallaJuego', 'gameScreen'),
        ('pantallaFinal', 'endScreen'),
        ('progreso', 'progress'),
        ('nivelActual', 'currentLevel'),
        ('aciertosRonda', 'roundHits'),
        ('intentos', 'attempts'),
        ('resuelto', 'solved'),
        ('pintarEstrellas', 'renderStars'),
        ('pintarNiveles', 'renderLevels'),
        ('pintarProgreso', 'renderProgress'),
        ('seleccionarNivel', 'selectLevel'),
        ('nivelSegunProgreso', 'levelBasedOnProgress'),
        ('mostrarExplicacion', 'showExplanation'),
        ('mostrarPista', 'showHint'),
        ('responder', 'answer'),
        ('terminarRonda', 'endRound'),
        ('iniciarJuego', 'startGame'),
        ('btnSiguiente', 'btnNext'),
        ('dificultadEl', 'levelEl'),
        ('nivelesEl', 'levelsEl'),
        ('guardar()', 'save()'),
        ('banco()', 'bank()'),
        ('esCorrecta', 'isCorrect'),
    ]
    for old, new in replacements:
        content = content.replace(old, new)
    return content

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        content = fix_textcontent_double(content)
        content = fix_encoding(content)
        content = fix_spanish_vars(content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath.name}")
            return True
        return False
    except Exception as e:
        print(f"Error in {filepath}: {e}")
        return False

def main():
    fixed = 0
    for tool_dir in sorted(TOOLS_DIR.iterdir()):
        if not tool_dir.is_dir():
            continue
        app_js = tool_dir / "app.js"
        if app_js.exists():
            if process_file(app_js):
                fixed += 1
    print(f"\nTotal files fixed: {fixed}")

if __name__ == "__main__":
    main()

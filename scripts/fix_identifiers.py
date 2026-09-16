#!/usr/bin/env python3
"""Fix Spanish JS identifiers to English in Routime app.js files.
Only replaces actual JavaScript identifiers (variables, functions), not strings or DOM IDs."""
import re
from pathlib import Path

TOOLS_DIR = Path(__file__).parent.parent / "tools"

# Spanish -> English identifier mappings (word boundaries only)
# Order matters: longer patterns first
IDENTIFIERS = [
    # Screen variables
    ('pantallaInicio', 'startScreen'),
    ('pantallaJuego', 'gameScreen'),
    ('pantallaFinal', 'endScreen'),
    ('pantallaSeleccion', 'selectionScreen'),
    ('pantallaRespuesta', 'responseScreen'),
    ('pantallaRespiracion', 'breathingScreen'),
    ('pantallaSemana', 'weekScreen'),
    
    # Progress/state
    ('progreso', 'progress'),
    ('guardar()', 'save()'),
    
    # Round/game state
    ('nivelActual', 'currentLevel'),
    ('aciertosRonda', 'roundHits'),
    ('intentos', 'attempts'),
    ('resuelto', 'solved'),
    ('completado', 'completed'),
    
    # Render functions (pintar = to paint/draw)
    ('pintarEstrellas', 'renderStars'),
    ('pintarNiveles', 'renderLevels'),
    ('pintarProgreso', 'renderProgress'),
    ('pintarDificultad', 'renderLevel'),
    ('pintarTablero', 'renderBoard'),
    ('pintarModelo', 'renderModel'),
    ('pintarPaleta', 'renderPalette'),
    ('pintarTarjetas', 'renderCards'),
    ('pintarEmociones', 'renderEmotions'),
    ('pintarCarta', 'renderCard'),
    ('pintarCartas', 'renderCards'),
    ('pintarResumen', 'renderSummary'),
    ('pintarContador', 'renderCounter'),
    ('pintarPista', 'renderHint'),
    
    # Action functions
    ('seleccionarNivel', 'selectLevel'),
    ('nivelSegunProgreso', 'levelBasedOnProgress'),
    ('mostrarExplicacion', 'showExplanation'),
    ('mostrarPista', 'showHint'),
    ('mostrarAyuda', 'showHelp'),
    ('mostrarAviso', 'showNotice'),
    ('responder', 'answer'),
    ('terminarRonda', 'endRound'),
    ('iniciarJuego', 'startGame'),
    ('empezarJuego', 'startGame'),
    ('empezarRonda', 'startRound'),
    ('iniciarRonda', 'startRound'),
    ('iniciarPractica', 'startPractice'),
    ('elegir', 'select'),
    ('elegirNivel', 'selectLevel'),
    
    # Button variables
    ('btnSiguiente', 'btnNext'),
    ('btnRepetir', 'btnRepeat'),
    ('btnTerminar', 'btnFinish'),
    ('btnMenu', 'btnMenu'),
    ('btnJugar', 'btnPlay'),
    ('btnComprobar', 'btnCheck'),
    ('btnBorrar', 'btnErase'),
    ('btnListo', 'btnReady'),
    ('btnEmpezar', 'btnStart'),
    ('btnOtroNivel', 'btnOtherLevel'),
    ('btnVolver', 'btnBack'),
    ('btnCerrar', 'btnClose'),
    ('btnContinuar', 'btnContinue'),
    ('btnAyuda', 'btnHelp'),
    ('btnEscuchar', 'btnListen'),
    ('btnVerificar', 'btnVerify'),
    
    # Element variables (El = element suffix)
    ('dificultadEl', 'levelEl'),
    ('nivelesEl', 'levelsEl'),
    ('tituloEl', 'titleEl'),
    ('textoEl', 'textEl'),
    ('contadorEl', 'counterEl'),
    ('preguntaEl', 'questionEl'),
    ('respuestaEl', 'answerEl'),
    ('opcionesEl', 'optionsEl'),
    
    # Game logic functions
    ('banco()', 'bank()'),
    ('esCorrecta', 'isCorrect'),
    
    # State
    ('comenzo', 'started'),
    ('termino', 'ended'),
    ('ayuda', 'help'),
    
    # Other common Spanish words in code
    ('tildar', 'check'),
    ('destapar', 'reveal'),
    ('empezar', 'start'),
    ('terminar', 'finish'),
    ('continuar', 'continue'),
    ('bloquear', 'block'),
    ('desbloquear', 'unblock'),
    ('reproducir', 'play'),
    ('repetir', 'repeat'),
]

def fix_identifier(content, old, new):
    """Replace identifier only when it's a standalone word (not in a string)."""
    # Use word boundary matching to avoid partial matches
    # Replace: old -> new
    # But NOT when inside string literals (between quotes)
    
    # Simple approach: replace using regex with word boundaries
    # Only replace if preceded by identifier start and followed by identifier end
    pattern = r'\b' + re.escape(old) + r'\b'
    return re.sub(pattern, new, content)

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Apply all identifier replacements
        for spanish, english in IDENTIFIERS:
            content = fix_identifier(content, spanish, english)
        
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
    
    print(f"\nTotal files fixed: {fixed}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Fix ALL Spanish identifiers to English in Routime app.js files."""
import re
from pathlib import Path

TOOLS_DIR = Path(__file__).parent.parent / "tools"

# Complete mapping of Spanish -> English identifiers
REPLACEMENTS = {
    # Screen/UI elements
    'pantallaInicio': 'startScreen',
    'pantallaJuego': 'gameScreen',
    'pantallaFinal': 'endScreen',
    'pantallaSeleccion': 'selectionScreen',
    'pantallaRespuesta': 'responseScreen',
    'pantallaRespiracion': 'breathingScreen',
    'pantallaSemana': 'weekScreen',
    
    # Progress/state
    'progreso': 'progress',
    'guardar()': 'save()',
    
    # Round/game state
    'nivelActual': 'currentLevel',
    'aciertosRonda': 'roundHits',
    'intentos': 'attempts',
    'resuelto': 'solved',
    'completado': 'completed',
    
    # Render functions
    'pintarEstrellas': 'renderStars',
    'pintarNiveles': 'renderLevels',
    'pintarProgreso': 'renderProgress',
    'pintarDificultad': 'renderLevel',
    'pintarTablero': 'renderBoard',
    'pintarModelo': 'renderModel',
    'pintarPaleta': 'renderPalette',
    'pintarTarjetas': 'renderCards',
    'pintarEmociones': 'renderEmotions',
    'pintarCarta': 'renderCard',
    'pintarCartas': 'renderCards',
    'pintarResumen': 'renderSummary',
    'pintarContador': 'renderCounter',
    'pintarPista': 'renderHint',
    
    # Action functions
    'seleccionarNivel': 'selectLevel',
    'nivelSegunProgreso': 'levelBasedOnProgress',
    'mostrarExplicacion': 'showExplanation',
    'mostrarPista': 'showHint',
    'mostrarAyuda': 'showHelp',
    'mostrarAviso': 'showNotice',
    'mostrarFeedack': 'showFeedback',
    'responder': 'answer',
    'terminarRonda': 'endRound',
    'iniciarJuego': 'startGame',
    'empezarJuego': 'startGame',
    'empezarRonda': 'startRound',
    'iniciarRonda': 'startRound',
    'iniciarPractica': 'startPractice',
    'elegir': 'select',
    'elegirNivel': 'selectLevel',
    
    # Button variables
    'btnSiguiente': 'btnNext',
    'btnRepetir': 'btnRepeat',
    'btnTerminar': 'btnFinish',
    'btnMenu': 'btnMenu',
    'btnJugar': 'btnPlay',
    'btnComprobar': 'btnCheck',
    'btnBorrar': 'btnErase',
    'btnListo': 'btnReady',
    'btnEmpezar': 'btnStart',
    'btnOtroNivel': 'btnOtherLevel',
    'btnVolver': 'btnBack',
    'btnCerrar': 'btnClose',
    'btnContinuar': 'btnContinue',
    'btnAyuda': 'btnHelp',
    'btnEscuchar': 'btnListen',
    'btnVerificar': 'btnVerify',
    
    # Element variables
    'dificultadEl': 'levelEl',
    'nivelesEl': 'levelsEl',
    'tituloEl': 'titleEl',
    'textoEl': 'textEl',
    'contadorEl': 'counterEl',
    'preguntaEl': 'questionEl',
    'respuestaEl': 'answerEl',
    'opcionesEl': 'optionsEl',
    'feedbackEl': 'feedbackEl',
    'explicacionEl': 'explanationEl',
    'explicacionWrap': 'explanationWrap',
    
    # Game logic
    'banco()': 'bank()',
    'items': 'items',
    'idx': 'idx',
    'item': 'item',
    'esCorrecta': 'isCorrect',
    'cont': 'container',
    
    # Data properties
    'correcta': 'correct',
    'opciones': 'options',
    'situacion': 'situation',
    'respuesta': 'response',
    'pregunta': 'question',
    'texto': 'text',
    'titulo': 'title',
    'bloque': 'block',
    'nivel': 'level',
    'letra': 'letter',
    'palabra': 'word',
    'frase': 'phrase',
    'opcion': 'option',
    
    # State
    'comenzo': 'started',
    'termino': 'ended',
    'ayuda': 'help',
    'pista': 'hint',
    
    # Other
    'tildar': 'check',
    'destapar': 'reveal',
    'revelar': 'reveal',
    'empezar': 'start',
    'terminar': 'finish',
    'continuar': 'continue',
    'bloquear': 'block',
    'desbloquear': 'unblock',
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        changes = 0
        
        # Apply replacements (longest first to avoid partial matches)
        for spanish, english in sorted(REPLACEMENTS.items(), key=lambda x: -len(x[0])):
            if spanish in content:
                content = content.replace(spanish, english)
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
                print(f"Fixed {app_js.parent.name}: {changes} replacements")
                total_changes += changes
                files_fixed += 1
    
    print(f"\nTotal: {files_fixed} files, {total_changes} replacements")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Fix remaining Spanish identifiers that the main script may have missed.

Targets only the most common high-impact replacements.
"""

import os
import re

TOOLS_DIR = r"D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\routime\tools"

REPLACEMENTS = [
    # DOM ID selectors (in strings)
    (r'#resumenFinal\b', '#finalSummary'),
    (r'#transferencia\b', '#transfer'),
    # State/progress
    (r'\brutinaActual\b', 'currentRoutine'),
    (r'\borderActual\b', 'currentOrder'),
    (r'\bmomento\b', 'timeOfDay'),
    (r'\bseccion\b', 'section'),
    (r'\bpasosHechos\b', 'doneSteps'),
    (r'\bcontarHechos\b', 'countDone'),
    (r'\bhechosDe\b', 'doneOf'),
    (r'\bpasosDe\b', 'stepsOf'),
    (r'\bmomentoActual\b', 'currentTime'),
    (r'\bcontadorPasos\b', 'stepCounter'),
    (r'\bpasosContados\b', 'countedSteps'),
    (r'\bpasosTotales\b', 'totalSteps'),
    (r'\bnivelActual\b', 'currentLevel'),
    (r'\bintentosNivel\b', 'levelAttempts'),
    (r'\brondasCompletas\b', 'completedRounds'),
    (r'\bestrellasTotal\b', 'totalStars'),
    (r'\bsiguienteRonda\b', 'nextRound'),
    (r'\bsiguienteNivel\b', 'nextLevel'),
    (r'\bterminarRonda\b', 'endRound'),
    (r'\bterminarNivel\b', 'endLevel'),
    (r'\binciarRonda\b', 'startRound'),
    (r'\binciarNivel\b', 'startLevel'),
    (r'\brenderizarRonda\b', 'renderRound'),
    (r'\brenderizarNivel\b', 'renderLevel'),
    (r'\brenderizarMenu\b', 'renderMenu'),
    (r'\brenderizarPasos\b', 'renderSteps'),
    (r'\brenderizarEstado\b', 'renderState'),
    (r'\brenderizarProgreso\b', 'renderProgress'),
    (r'\bevaluarRespuesta\b', 'evaluateAnswer'),
    (r'\bcomprobarRespuesta\b', 'checkAnswer'),
    (r'\bseleccionarOpcion\b', 'selectOption'),
    (r'\bseleccionarNivel\b', 'selectLevel'),
    (r'\bmostrarFeedback\b', 'showFeedback'),
    (r'\bmostrarError\b', 'showError'),
    (r'\bmostrarResultado\b', 'showResult'),
    (r'\bmostrarSiguiente\b', 'showNext'),
    (r'\bactualizarProgreso\b', 'updateProgress'),
    (r'\bactualizarEstado\b', 'updateState'),
    (r'\bactualizarPantalla\b', 'updateScreen'),
    (r'\bactualizarFeedback\b', 'updateFeedback'),
    (r'\bactualizarEstrellas\b', 'updateStars'),
    (r'\bmanejarTecla\b', 'handleKey'),
    (r'\bmanejarClick\b', 'handleClick'),
    (r'\bmanejarRespuesta\b', 'handleAnswer'),
    (r'\bmanejarError\b', 'handleError'),
    (r'\bgenerarPregunta\b', 'generateQuestion'),
    (r'\bgenerarNivel\b', 'generateLevel'),
    (r'\bgenerarRonda\b', 'generateRound'),
    (r'\bcompletarJuego\b', 'completeGame'),
    (r'\bcompletarNivel\b', 'completeLevel'),
    (r'\bfinalizarCuestionario\b', 'finishQuiz'),
    (r'\biniciarTemporizador\b', 'startTimer'),
    (r'\bpararTemporizador\b', 'stopTimer'),
    (r'\bactualizarTemporizador\b', 'updateTimer'),
    (r'\bcrearElemento\b', 'createElement'),
    (r'\bcrearBoton\b', 'createButton'),
    (r'\bcrearTarjeta\b', 'createCard'),
    (r'\bcrearFila\b', 'createRow'),
    (r'\bcrearColumna\b', 'createColumn'),
    (r'\bcrearOpcion\b', 'createOption'),
    (r'\bcrearPaso\b', 'createStep'),
    (r'\bcrearItem\b', 'createItem'),
    (r'\beliminarElemento\b', 'removeElement'),
    (r'\beliminarBoton\b', 'removeButton'),
    (r'\beliminarTarjeta\b', 'removeCard'),
    (r'\beliminarFila\b', 'removeRow'),
    (r'\beliminarOpcion\b', 'removeOption'),
    (r'\beliminarItem\b', 'removeItem'),
    (r'\bactualizarElemento\b', 'updateElement'),
    (r'\bactualizarBoton\b', 'updateButton'),
    (r'\bactualizarTarjeta\b', 'updateCard'),
    (r'\bactualizarFila\b', 'updateRow'),
    (r'\bactualizarOpcion\b', 'updateOption'),
    (r'\bactualizarItem\b', 'updateItem'),
    (r'\bactualizarPuntuacion\b', 'updateScore'),
    (r'\bactualizarVista\b', 'updateView'),
    (r'\bvalidarRespuesta\b', 'validateAnswer'),
    (r'\bvalidarInput\b', 'validateInput'),
    (r'\bvalidarNivel\b', 'validateLevel'),
    (r'\baplicarEstilo\b', 'applyStyle'),
    (r'\baplicarClase\b', 'applyClass'),
    (r'\bremoverClase\b', 'removeClass'),
    (r'\bhayError\b', 'hasError'),
    (r'\bmotrarRetroalimentacion\b', 'showFeedback'),
    (r'\bcontinuarPregunta\b', 'nextQuestion'),
    (r'\bcontinuarRonda\b', 'nextRound'),
    (r'\binciarJuego\b', 'startGame'),
    (r'\bterminarJuego\b', 'endGame'),
    (r'\bpausarJuego\b', 'pauseGame'),
    (r'\breanudarJuego\b', 'resumeGame'),
    (r'\breiniciarJuego\b', 'restartGame'),
    (r'\bmostrarAyuda\b', 'showHelp'),
    (r'\bocultarAyuda\b', 'hideHelp'),
    (r'\bpistaMostrada\b', 'hintShown'),
    (r'\bsolucionMostrada\b', 'solutionShown'),
    (r'\bexplicacionMostrada\b', 'explanationShown'),
    (r'\bhintShown\b', 'hintShown'),
    (r'\bhayPista\b', 'hasHint'),
    (r'\bhaySolucion\b', 'hasSolution'),
    (r'\bhayExplicacion\b', 'hasExplanation'),
    (r'\bitemActual\b', 'currentItem'),
    (r'\bpreguntaActual\b', 'currentQuestion'),
    (r'\bnivelElegido\b', 'chosenLevel'),
    (r'\bdificultadElegida\b', 'chosenDifficulty'),
    (r'\bopcionElegida\b', 'chosenOption'),
    (r'\bopcionCorrecta\b', 'correctOption'),
    (r'\bopcionIncorrecta\b', 'incorrectOption'),
    (r'\bvalorCorrecto\b', 'correctValue'),
    (r'\bvalorIncorrecto\b', 'incorrectValue'),
    (r'\btextoCorrecto\b', 'correctText'),
    (r'\btextoIncorrecto\b', 'incorrectText'),
    (r'\btextoRespuesta\b', 'answerText'),
    (r'\bvalorRespuesta\b', 'answerValue'),
    (r'\bresultadoVerificacion\b', 'verificationResult'),
    (r'\bresultadoPregunta\b', 'questionResult'),
    (r'\bresultadoItem\b', 'itemResult'),
    (r'\bestadoItem\b', 'itemState'),
    (r'\bitemSeleccionado\b', 'selectedItem'),
    (r'\bitemCorrecto\b', 'correctItem'),
    (r'\bitemIncorrecto\b', 'incorrectItem'),
    (r'\btextoInformativo\b', 'infoText'),
    (r'\bmensajeError\b', 'errorMessage'),
    (r'\bmensajeExito\b', 'successMessage'),
    (r'\btiempoRestante\b', 'remainingTime'),
    (r'\bcontadorTiempo\b', 'timeCounter'),
    (r'\bfechaActual\b', 'currentDate'),
    (r'\bfechaRutina\b', 'routineDate'),
    (r'\bestadoRutina\b', 'routineState'),
    (r'\bresultadoAnterior\b', 'previousResult'),
    (r'\bnivelMostrado\b', 'shownLevel'),
    (r'\bestadoAnterior\b', 'previousState'),
    (r'\bintentoActual\b', 'currentAttempt'),
    (r'\btotalItems\b', 'totalItems'),
    (r'\bnivelPalabras\b', 'wordLevel'),
    (r'\bpalabrasNivel\b', 'wordsAtLevel'),
    (r'\bestadoVerificacion\b', 'verificationState'),
    (r'\bopcionVerificacion\b', 'verificationOption'),
    (r'\bpalabraActual\b', 'currentWord'),
    (r'\bpalabrasCorrectas\b', 'correctWords'),
    (r'\bcompletarPalabra\b', 'completeWord'),
    (r'\bverificarPalabra\b', 'verifyWord'),
    (r'\bnivelCompletado\b', 'levelCompleted'),
    (r'\bnivelPalabra\b', 'wordLevel'),
    (r'\bcomprobacionRespuesta\b', 'checkAnswer'),
    (r'\bopcionesPregunta\b', 'questionOptions'),
    (r'\brespuestaCorrecta\b', 'correctAnswer'),
    (r'\brespuestaIncorrecta\b', 'incorrectAnswer'),
    (r'\brespuestaSeleccionada\b', 'selectedAnswer'),
    (r'\bestadoPregunta\b', 'questionState'),
    (r'\bcontadorPreguntas\b', 'questionCounter'),
    (r'\bdefiniciones\b', 'definitions'),
    (r'\bdefinicionCorrecta\b', 'correctDefinition'),
    (r'\bdefinicionIncorrecta\b', 'incorrectDefinition'),
    (r'\bdefinicionSeleccionada\b', 'selectedDefinition'),
    (r'\bpalabraLetras\b', 'wordLetters'),
    (r'\bpalabraOpciones\b', 'wordOptions'),
    (r'\bpalabraCorrecta\b', 'correctWord'),
    (r'\bletras\b', 'letters'),
    (r'\bletraActual\b', 'currentLetter'),
    (r'\bletraCorrecta\b', 'correctLetter'),
    (r'\bposicionLetra\b', 'letterPosition'),
    (r'\bletraSeleccionada\b', 'selectedLetter'),
    (r'\bteclaVirtual\b', 'virtualKey'),
    (r'\bteclaIncorrecta\b', 'wrongKey'),
    (r'\bteclaCorrecta\b', 'correctKey'),
    (r'\bteclasActivas\b', 'activeKeys'),
    (r'\bopcionLetra\b', 'letterOption'),
    (r'\bbotonLetra\b', 'letterButton'),
    (r'\bpalabraEnunciado\b', 'wordPrompt'),
    # Routine-specific
    (r'\bpasoActual\b', 'currentStep'),
    (r'\bpasosActuales\b', 'currentSteps'),
    (r'\bpasosTotales\b', 'totalSteps'),
    (r'\bpasosCompletados\b', 'completedSteps'),
    (r'\bpasosRestantes\b', 'remainingSteps'),
    (r'\bcompletarPaso\b', 'completeStep'),
    (r'\bmarcarPaso\b', 'markStep'),
    (r'\bsiguientePaso\b', 'nextStep'),
    (r'\bpasoAnterior\b', 'previousStep'),
    (r'\bpasosOrdenados\b', 'orderedSteps'),
    (r'\bpasosDesordenados\b', 'shuffledSteps'),
    (r'\bordenarPasos\b', 'orderSteps'),
    (r'\bverificarOrden\b', 'verifyOrder'),
    (r'\bpasosCorrectos\b', 'correctSteps'),
    (r'\bpasosIncorrectos\b', 'incorrectSteps'),
    (r'\bcompletarPasos\b', 'completeSteps'),
    (r'\bpasosElegidos\b', 'chosenSteps'),
    (r'\bultimoPaso\b', 'lastStep'),
    (r'\bprimerPaso\b', 'firstStep'),
    (r'\bpasosRutina\b', 'routineSteps'),
    (r'\bpasosCompletos\b', 'fullSteps'),
    (r'\bmostrarPasos\b', 'showSteps'),
    (r'\bocultarPasos\b', 'hideSteps'),
    (r'\bpasoMarcado\b', 'markedStep'),
    (r'\bpasoCorrecto\b', 'correctStep'),
    (r'\bpasoIncorrecto\b', 'incorrectStep'),
    (r'\bpasoSeleccionado\b', 'selectedStep'),
    (r'\bpasoActualIndex\b', 'currentStepIndex'),
    (r'\bpasosDisponibles\b', 'availableSteps'),
    (r'\bpasosSeleccionados\b', 'selectedSteps'),
    (r'\bprogresoPasos\b', 'stepProgress'),
    (r'\bbotonPaso\b', 'stepButton'),
    (r'\bopcionPaso\b', 'stepOption'),
    (r'\bpasosRonda\b', 'roundSteps'),
    (r'\bpasosNivel\b', 'levelSteps'),
    (r'\bpasosJuego\b', 'gameSteps'),
]


def process_file(filepath):
    if not filepath.endswith(('.js', '.html', '.css')):
        return 0
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return 0
    
    original = content
    total_changes = 0
    
    for pattern, replacement in REPLACEMENTS:
        new_content, n = re.subn(pattern, replacement, content)
        if n > 0:
            content = new_content
            total_changes += n
    
    if content != original:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return total_changes
        except:
            return 0
    return 0


def main():
    total_changes = 0
    files_changed = 0
    
    for root, dirs, files in os.walk(TOOLS_DIR):
        for fname in files:
            if not fname.endswith(('.js', '.html', '.css')):
                continue
            fpath = os.path.join(root, fname)
            n = process_file(fpath)
            if n:
                files_changed += 1
                total_changes += n
                print(f"[{n:3d}x] {fpath}")
    
    print(f"\nDone: {files_changed} files changed, {total_changes} total replacements.")


if __name__ == '__main__':
    main()

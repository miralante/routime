/* ============================================================
   Miralante — Spanish Identifier Audit
   Scans JS/HTML files for Spanish identifiers, protecting
   string literals and comments.
   ============================================================ */
'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────────────
const EXTS    = ['.js', '.html', '.htm'];
const EXCLUDE = /node_modules|\.git|assets[/\\]|\b dist\b|\b build\b|\b coverage\b/;

const TRANSLATIONS = {
  'banco': 'bank', 'nivel': 'level', 'niveles': 'levels',
  'elemento': 'element', 'elementos': 'elements',
  'opcion': 'option', 'opciones': 'options',
  'pregunta': 'question', 'preguntas': 'questions',
  'respuesta': 'answer', 'respuestas': 'answers',
  'pista': 'hint', 'pistas': 'hints',
  'indice': 'index',
  'intento': 'attempt', 'intentos': 'attempts',
  'acierto': 'hit', 'aciertos': 'hits',
  'fallo': 'miss', 'fallos': 'misses',
  'puntos': 'score', 'puntuacion': 'score', 'puntuacionTotal': 'totalScore',
  'estrella': 'star', 'estrellas': 'stars',
  'resultado': 'result', 'resultados': 'results',
  'ronda': 'round', 'rondas': 'rounds',
  'partida': 'game',
  'fase': 'phase',
  'estado': 'state',
  'configuracion': 'config',
  'historial': 'history',
  'racha': 'streak',
  'modalidad': 'mode', 'modo': 'mode', 'modoJuego': 'gameMode',
  'correcto': 'correct', 'incorrecto': 'incorrect',
  'completo': 'complete', 'incompleto': 'incomplete',
  'activo': 'active', 'inactivo': 'inactive',
  'bloque': 'block', 'bloques': 'blocks',
  'cuadro': 'box', 'cuadros': 'boxes',
  'celda': 'cell', 'celdas': 'cells',
  'letra': 'letter', 'letras': 'letters',
  'palabra': 'word', 'palabras': 'words',
  'frase': 'phrase', 'frases': 'phrases',
  'oracion': 'sentence', 'oraciones': 'sentences',
  'titulo': 'title',
  'mensaje': 'message',
  'ayuda': 'help',
  'resumen': 'summary',
  'contenedor': 'container',
  'juego': 'game', 'juegos': 'games',
  'practica': 'practice',
  'trazo': 'stroke',
  'rejilla': 'grid',
  'grupo': 'group', 'grupos': 'groups',
  'tecla': 'key', 'teclas': 'keys',
  'teclado': 'keyboard',
  'boton': 'button',
  'pantalla': 'screen',
  'inicial': 'initial',
  'iniciar': 'init', 'iniciarJuego': 'initGame',
  'empezar': 'begin', 'empezarRonda': 'beginRound',
  'comenzar': 'start', 'comenzarRonda': 'startRound',
  'terminar': 'end', 'terminarRonda': 'endRound', 'terminarNivel': 'endLevel',
  'reiniciar': 'restart', 'resetear': 'reset',
  'guardar': 'save', 'guardarPartida': 'saveGame', 'guardarProgreso': 'saveProgress', 'guardarEstado': 'saveState',
  'cargar': 'load', 'cargarPartida': 'loadGame', 'cargarProgreso': 'loadProgress', 'cargarEstado': 'loadState',
  'mostrar': 'show', 'mostrarNivel': 'showLevel',
  'generar': 'generate', 'generarPregunta': 'generateQuestion', 'generarPista': 'generateHint',
  'obtener': 'get', 'obtenerDato': 'getData', 'obtenerNivel': 'getLevel',
  'elegir': 'choose', 'elegirOpcion': 'chooseOption',
  'toggle': 'toggle', 'toggleLetra': 'toggleLetter',
  'marcar': 'mark', 'marcarSeleccion': 'markSelection', 'desmarcarSeleccion': 'unmarkSelection',
  'pintar': 'draw', 'pintarGrupo': 'drawGroup', 'pintarPads': 'drawPads',
  'pintarRejilla': 'drawGrid', 'pintarResumen': 'drawSummary',
  'pintarTrazo': 'drawStroke', 'pintarLetras': 'drawLetters', 'pintarNivel': 'drawLevel',
  'seleccion': 'selection',
  'seleccionado': 'selected',
  'secuencia': 'sequence',
  'aleatorio': 'random',
  'aleatoria': 'random',
  'orden': 'order',
  'mezclar': 'shuffle',
  'reproducir': 'play', 'reproducirAudio': 'playAudio',
  'detener': 'stop',
  'pausar': 'pause',
  'continuar': 'resume',
  'verificar': 'verify',
  'comparar': 'compare',
  'evaluar': 'evaluate',
  'registrar': 'record',
  'actualizar': 'update',
  'reiniciarNivel': 'restartLevel',
  'siguienteNivel': 'nextLevel',
  'nivelAnterior': 'previousLevel',
  'completarNivel': 'completeLevel',
  'validarRespuesta': 'validateAnswer',
  'mostrarFeedback': 'showFeedback',
  'mostrarResultado': 'showResult',
  'mostrarAyuda': 'showHelp',
  'ocultarAyuda': 'hideHelp',
  'iniciarPractica': 'initPractice',
  'iniciarTrazo': 'initStroke',
  'iniciarNivel': 'initLevel',
};

// ─── Safe English identifiers to skip ───────────────────────────────────────
const SAFE = new Set([
  'bank','level','levels','element','elements','option','options',
  'question','questions','answer','answers','hint','hints',
  'index','attempt','attempts','hit','hits','miss','misses',
  'score','totalScore','star','stars','result','results',
  'round','rounds','game','games','phase','state','config','history','streak',
  'mode','gameMode','correct','incorrect','complete','incomplete','active','inactive',
  'block','blocks','box','boxes','cell','cells','letter','letters',
  'word','words','phrase','phrases','sentence','sentences',
  'title','message','help','summary','container',
  'practice','stroke','grid','group','groups','key','keys',
  'button','screen','initial',
  'init','initGame','initLevel','initPractice','initStroke',
  'begin','beginRound',
  'start','startRound','startGame',
  'end','endRound','endLevel',
  'restart','restartLevel','reset',
  'save','saveGame','saveProgress','saveState',
  'load','loadGame','loadProgress','loadState',
  'show','showLevel','showFeedback','showResult','showHelp','hideHelp',
  'generate','generateQuestion','generateHint',
  'get','getData','getLevel',
  'choose','chooseOption',
  'toggle','toggleLetter',
  'mark','markSelection','unmarkSelection','selection','selected',
  'draw','drawGroup','drawPads','drawGrid','drawSummary','drawStroke','drawLetters','drawLevel',
  'sequence','random','order','shuffle',
  'play','playAudio','stop','pause','resume',
  'verify','compare','evaluate','record','update',
  'nextLevel','previousLevel','completeLevel','validateAnswer',
  'totalScore','gameMode','gameState','gameConfig',
  'Bank','Nivel','Niveles','Banco','Puntuacion','Ronda','Rondas',
  'Pista','Pistas','Pantalla','PantallaInicial',
  'StartGame','InitGame','EndGame','BeginRound','EndRound','StartRound',
  'Iniciar','Empezar','Comenzar','Terminar',
  'IniciarJuego','IniciarNivel','IniciarPractica','IniciarTrazo',
  'TerminarRonda','TerminarNivel','ReiniciarNivel',
  'ShowLevel','ShowHelp','ShowFeedback','ShowResult','ShowResult',
  'GenerateQuestion','GenerateHint','GeneratePista',
  'GetData','GetLevel','ChooseOption',
  'MarkSelection','UnmarkSelection','ToggleSelection',
  'DrawGroup','DrawPads','DrawGrid','DrawSummary','DrawStroke','DrawLetters','DrawLevel',
  'SaveState','LoadState','SaveGame','LoadGame','SaveProgress','LoadProgress',
  'UpdateState','UpdateScore','UpdateLevel',
]);

// ─── Build scan patterns ─────────────────────────────────────────────────────
const SPANISH_WORDS = Object.keys(TRANSLATIONS).filter(w => !SAFE.has(w));

// ─── Helpers ────────────────────────────────────────────────────────────────
function isInStringOrComment(content, matchStart) {
  const before = content.substring(0, matchStart);
  const lines   = before.split('\n');
  const lastLine = lines[lines.length - 1];
  let sq = 0, dq = 0, bq = 0, inML = false;
  let mlEnd = before.lastIndexOf('*/');
  if (mlEnd >= 0) {
    const mlStart = before.lastIndexOf('/*');
    if (mlStart >= 0 && mlStart > mlEnd) inML = true;
  }
  for (let i = 0; i < lastLine.length; i++) {
    const c = lastLine[i];
    if (inML) {
      if (c === '*' && lastLine[i+1] === '/') { inML = false; i++; }
      continue;
    }
    if (c === '/' && lastLine[i+1] === '*') { inML = true; i++; continue; }
    if (c === '/' && lastLine[i+1] === '/') break;
    if (c === '`') { bq ^= 1; continue; }
    if (bq) continue;
    if (c === "'") { sq ^= 1; continue; }
    if (c === '"') { dq ^= 1; continue; }
  }
  return sq || dq || bq || inML;
}

function buildPatterns() {
  return SPANISH_WORDS.map(w => {
    // identifier boundary: not preceded/followed by letter, digit, or _
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      word: w,
      re:   new RegExp(`(?<![a-zA-Z0-9_])${esc}(?![a-zA-Z0-9_])`, 'g'),
    };
  });
}

function scanFile(filePath, patterns) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();
  const issues = [];
  for (const p of patterns) {
    let m;
    p.re.lastIndex = 0;
    while ((m = p.re.exec(content)) !== null) {
      if (!isInStringOrComment(content, m.index)) {
        const lineNo = content.substring(0, m.index).split('\n').length;
        issues.push({ word: p.word, line: lineNo });
      }
    }
  }
  return issues;
}

// ─── Main ────────────────────────────────────────────────────────────────────
const TARGET = process.argv[2] || __dirname;
const patterns = buildPatterns();

let totalIssues = 0;
let totalFiles  = 0;

function walk(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!EXCLUDE.test(full)) walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (EXTS.includes(ext)) {
          const issues = scanFile(full, patterns);
          if (issues.length > 0) {
            totalFiles++;
            totalIssues += issues.length;
            console.log(`\n[${full}]`);
            const byLine = {};
            for (const iss of issues) {
              if (!byLine[iss.line]) byLine[iss.line] = iss.word;
            }
            for (const [ln, word] of Object.entries(byLine)) {
              console.log(`  L${ln}: "${word}" → "${TRANSLATIONS[word] || '?'}"`);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error reading ' + dir + ': ' + e.message);
  }
}

console.log('=== Miralante Spanish Identifier Audit ===');
console.log('Target: ' + TARGET);
console.log('Scanning for ' + SPANISH_WORDS.length + ' Spanish terms...');
console.log('');

walk(TARGET);

console.log('\n=== Result ===');
console.log(totalFiles + ' file(s) with issues, ' + totalIssues + ' total issue(s)');
if (totalIssues === 0) console.log('CLEAN — no untranslated Spanish identifiers found.');
else console.log('⚠  Run migrations or fix manually.');

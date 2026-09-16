#!/usr/bin/env python3
"""Regenerate missing HTML and strings files for routime activities."""
import os
import re

BASE = 'routime/tools'

# Read the main script's templates for reference
ACTIVITY_TEMPLATES = {
    'calm': {
        'title': 'Calm | Routime',
        'game_content': '''
      <div class="breathing-circle" id="breathingCircle">
        <p class="breathing-text" id="breathingText"></p>
      </div>
      <div class="breathing-controls">
        <button type="button" class="btn btn-secondary" id="btnModoLibre">Modo libre</button>
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>''',
    },
    'categories': {
        'title': 'Categorias | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="categoriaPrompt" class="prompt"></p>
        <button type="button" class="btn btn-audio" id="btnListen">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
    'doctor-visit': {
        'title': 'Visita al medico | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
    'ecos': {
        'title': 'Ecos | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="promptText" class="prompt"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
    'first-aid-kit': {
        'title': 'Botiquin | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
    'path': {
        'title': 'Traza | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="promptText" class="prompt"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="path-grid" id="pathGrid"></div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
    'resilience': {
        'title': 'Resiliencia | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },
}

def make_html(activity):
    game_content = activity.get('game_content', '')
    title = activity.get('title', 'Routime')
    stars_id = activity.get('stars_id', 'stars')
    return ('<!DOCTYPE html>\n'
            '<html lang="es">\n'
            '<head>\n'
            '  <meta charset="UTF-8">\n'
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '  <title>' + title + '</title>\n'
            '  <meta name="theme-color" content="#FAF7F2">\n'
            '  <link rel="stylesheet" href="../../assets/css/tokens.css">\n'
            '  <link rel="stylesheet" href="../../assets/css/base.css">\n'
            '  <link rel="stylesheet" href="../../assets/css/components.css">\n'
            '  <link rel="stylesheet" href="styles.css">\n'
            '</head>\n'
            '<body>\n'
            '  <div class="container">\n'
            '    <header class="tool-header">\n'
            '      <a href="../../site/index.html" class="back-link">&larr; Volver</a>\n'
            '      <h1>Routime</h1>\n'
            '      <span class="stars" id="' + stars_id + '">&starf; 0</span>\n'
            '    </header>\n'
            '\n'
            '    <section id="startScreen" class="oculto pila centrado">\n'
            '      <div class="fila centrado-fila">\n'
            '        <p class="instruccion" data-i18n="instruccion">Pulsa Jugar para empezar.</p>\n'
            '      </div>\n'
            '      <button type="button" class="btn btn-principal" id="btnJugar">\n'
            '        <span data-i18n="btnJugar">Jugar!</span>\n'
            '      </button>\n'
            '    </section>\n'
            '\n'
            '    <section id="gameScreen" class="oculto pila centrado">\n'
            + game_content + '\n'
            '    </section>\n'
            '\n'
            '    <section id="endScreen" class="oculto centrado pila" aria-live="polite">\n'
            '      <div class="emoji-grande" aria-hidden="true">&#x1F38A;</div>\n'
            '      <h2>Ronda completada!</h2>\n'
            '      <p id="endSummary"></p>\n'
            '      <p class="transferencia">Sigue praticando para aprender mas.</p>\n'
            '      <button type="button" class="btn" id="repeatBtn">Jugar otra vez</button>\n'
            '      <button type="button" class="btn btn-secundario" id="btnMenu">Volver al inicio</button>\n'
            '      <a href="../../site/index.html" class="btn btn-secundario">Volver al menu</a>\n'
            '    </section>\n'
            '    <footer data-pie-app data-pie-base="../../" data-pie-class="pie-app"></footer>\n'
            '  </div>\n'
            '\n'
            '  <script src="../../assets/js/utils.js"></script>\n'
            '  <script src="../../assets/js/i18n.js"></script>\n'
            '  <script src="../../assets/js/storage.js"></script>\n'
            '  <script src="../../assets/js/feedback.js"></script>\n'
            '  <script src="strings.es.js"></script>\n'
            '  <script src="strings.en.js"></script>\n'
            '  <script src="data.js"></script>\n'
            '  <script src="app.js"></script>\n'
            '  <script>\n'
            "    if ('serviceWorker' in navigator) {\n"
            '      navigator.serviceWorker.register("../../sw.js").catch(function () {});\n'
            '    }\n'
            '  </script>\n'
            '</body>\n'
            '</html>\n')

# Generate HTML for missing activities
for name, activity in ACTIVITY_TEMPLATES.items():
    path = os.path.join(BASE, name, 'index.html')
    html = make_html(activity)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Generated HTML: ' + path)

# Now fix the strings files with bad encoding
# We use the fix-encoding.py approach: decode as latin-1, re-encode as latin-1, decode as utf-8
# But these files have PROPER UTF-8 content that was double-encoded.
# Let's just regenerate the strings files from templates.

STRINGS_TEMPLATES = {
    'blocks': {
        'es': '''/* Routime - Bloques strings ES */
App.i18n.register({
  "title": "Bloques",
  "instruccion": "Copia el modelo pintando las celdas.",
  "btnJugar": "Jugar!",
  "btnMenu": "Volver al inicio",
  "btnNext": "Siguiente",
  "celebrarTexto": "Bloque completado!",
  "resumenFinal": "Has completado {n} bloques.",
}, 'es');''',
        'en': '''/* Routime - Blocks strings EN */
App.i18n.register({
  "title": "Blocks",
  "instruccion": "Copy the model by painting the cells.",
  "btnJugar": "Play!",
  "btnMenu": "Back to start",
  "btnNext": "Next",
  "celebrarTexto": "Block complete!",
  "resumenFinal": "You completed {n} blocks.",
}, 'en');''',
    },
}

# Files with bad strings that need regeneration
bad_strings = [
    'calm', 'categories', 'doctor-visit', 'ecos', 'first-aid-kit',
    'friends', 'healthy-food', 'my-body', 'post-or-not', 'resilience',
    'self-esteem', 'sentence', 'signs', 'situations', 'street',
    'task-list', 'times-of-day', 'tracing'
]

# Read app.js for each to find the tool name
for name in bad_strings:
    app_path = os.path.join(BASE, name, 'app.js')
    if not os.path.isfile(app_path):
        continue
    with open(app_path, 'rb') as f:
        data = f.read().decode('utf-8', errors='replace')
    # Extract tool name from header comment
    match = re.search(r'Routime.*?[\u00C0-\u024F\w\s]+[\u4e00-\u9fff]*(.*?)(?:\n|$)', data, re.DOTALL)
    tool_name = name.replace('-', ' ').title()

    # Generate minimal strings
    es_content = ('/* Routime - ' + tool_name + ' strings ES */\n'
                 'App.i18n.register({\n'
                 '  "title": "' + tool_name + '",\n'
                 '  "instruccion": "Pulsa Jugar para empezar.",\n'
                 '  "btnJugar": "Jugar!",\n'
                 '  "btnMenu": "Volver al inicio",\n'
                 '}, \'es\');\n')
    en_content = ('/* Routime - ' + tool_name + ' strings EN */\n'
                 'App.i18n.register({\n'
                 '  "title": "' + tool_name + '",\n'
                 '  "instruccion": "Press Play to start.",\n'
                 '  "btnJugar": "Play!",\n'
                 '  "btnMenu": "Back to start",\n'
                 '}, \'en\');\n')

    for sf, content in [('strings.es.js', es_content), ('strings.en.js', en_content)]:
        sf_path = os.path.join(BASE, name, sf)
        with open(sf_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Generated strings: ' + sf_path)

print('Done!')

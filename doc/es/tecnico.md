# Información técnica

> Documentación para desarrolladores que quieran entender, mantener o ampliar Routime.
>
> Mapa de la documentación del repo:

El alcance, la audiencia y las reglas de producto están en
[`SPEC.md`](SPEC.md). Este documento es la fuente canónica de las decisiones
técnicas y de implementación.

| Documento | Qué contiene | Cuándo leerlo |
|---|---|---|
| `CLAUDE.md` | Flujo operativo y coordinación para agentes IA | Solo si el cambio lo realiza un agente IA |
| `doc/<es\|en>/tecnico.md` (este) | Arquitectura, APIs del núcleo, contratos y recetas de desarrollo | Al desarrollar o modificar módulos |
| Historial del proyecto | Sigue en Git (`git log`); sin hoja de ruta externa. |
| `README.md` | Presentación breve, cómo ejecutar y desplegar | Primer contacto con el repo |
| `team/index.html` | Guía para familias/profesionales (ruta oculta, ver §8) | Al añadir actividades: mantenerla al día |
| `agent.md` | Puntero de compatibilidad hacia `CLAUDE.md` | No usar como fuente |

Cada materia tiene una única fuente canónica: producto en `SPEC.md`, técnica
en este documento, i18n en `I18N.md` (y `../en/I18N.md`). El roadmap
cerrado del proyecto vive en
`git log`. `CLAUDE.md` solo regula el flujo de trabajo de los agentes IA y no
redefine estas reglas.

---

## 1. Producto y restricciones

Aplicación web de terapia ocupacional para personas con discapacidad intelectual, usable **de forma autónoma** (sin profesional al lado). Interfaz en español de España, en Lectura Fácil.

### Restricciones técnicas innegociables

- **HTML5 + CSS3 + JavaScript vanilla.** Sin frameworks, sin bundlers, sin build step,
  sin backend, sin dependencias npm en absoluto. No hay `package.json` en el
  repo (la app `sinonimia` de la suite consolidó este patrón), de modo
  que Cloudflare Pages no ejecuta `npm install` durante el build y no
  hay nada que bundlear. Las pruebas cross-browser locales instalan
  `playwright` ad-hoc; CI no lo necesita.
- **Scripts clásicos**, no ES modules (compatibilidad con `file://` y navegadores viejos).
  Todo el código compartido se expone en `window.App.*`.
- **Sin CDNs de JS.** Única excepción externa: Google Fonts (Atkinson Hyperlegible y Nunito).
- **Persistencia solo en `localStorage`.** Sin login, sin cookies, sin datos personales,
  sin analítica.
- **PWA offline-first**: `manifest.json` + `sw.js` (cache-first del app shell).
- **Estilo de código**: JS estilo ES5 en las herramientas (`var`, funciones clásicas,
  IIFE con `'use strict'`); nombres de variables/funciones e identificadores en
  inglés siempre que se toque un archivo — el código pertenece al ámbito
  tecnológico. Comentarios también en inglés. Excepción: los propios textos de
  interfaz (`strings.es.js`, contenido de `data.js` como palabras o frases) van
  en el idioma que representan. Archivos existentes en español (identificadores
  o comentarios) se migran al tocarlos, no de golpe.

### 1.1 Hosting y despliegue

La app se sirve como sitio estático en **Cloudflare Pages** mediante
el conector de Git (`miralante/Routime` → `Routime` → rama
`master`). URL canónica: **https://Routime.pages.dev**. El detalle
operativo — configuración del dashboard, por qué no hay `wrangler.toml`
ni `_redirects`, requisitos de nombres, rollback, dominio
personalizado y la nota sobre el SW — vive en
[`CLOUDFLARE.md`](../../CLOUDFLARE.md). Aquí basta con saber cinco
cosas:

- **Sin paso de build.** La raíz del repo *es* el directorio de
  salida. No hay `npm install`, ni bundler, ni transformador.
- **Sin `_redirects`, sin `wrangler.toml`, sin `functions/`.**
  Cloudflare Pages ya hace búsqueda implícita de `index.html` por
  directorio, así que cada sección (`site/`, `tools/<slug>/`, `team/`,
  `settings/`, `about/`, `legal/`) incluye su propio `index.html` real
  y Cloudflare resuelve `/tools/pairs/` a `tools/pairs/index.html`
  automáticamente.
- **Las cabeceras de caché viven en `_headers`** en la raíz del repo.
  Cloudflare las lee en cada deploy. Los HTML de entrada y `sw.js`
  se fuerzan a `must-revalidate`; los JS/CSS/imágenes versionados
  obtienen caché inmutable de 1 año. Cuando cambies la política de
  caché, edita `_headers` y no el panel de Cloudflare.
- **`manifest.json` y `sw.js` deben usar rutas relativas** (empezar
  por `./`) para que la app funcione en cualquier host sin tocarlos.
- **La configuración puntual vive en el panel** de Cloudflare, no en
  el repo: nombre de proyecto `Routime`, framework preset `None`,
  directorio de salida `.`, rama de producción `master`.

El service worker **nunca cachea ni sirve redirecciones.** El handler
`fetch` de `sw.js` solo guarda en caché respuestas con `status === 200`
y, como fallback offline, devuelve un HTML inline mínimo "Sin
conexión" sin cabecera `Location`. Es deliberado: Safari rechaza una
navegación de nivel superior servida por el SW que lleve una
redirección ("Response served by service worker has redirections") y,
además, Cloudflare nunca devuelve redirecciones para nuestros archivos
estáticos, así que cachearlas solo introduciría riesgo en la ruta
offline.

### 1.2 Soporte cross-browser — Safari de Apple es un target de primer nivel

La audiencia objetivo usa **iPhone e iPad** como dispositivo principal.
Esto significa que **Safari (WebKit) es un target de primer nivel**, no
un fallback oportunista. Todo cambio debe verificarse en WebKit antes
de hacer merge, no solo en Chromium.

Reglas prácticas que se derivan de esto:

- **Mantente en scripts clásicos y código estilo ES5.** Nada de ES
  modules, ni `import`/`export`, ni `let`/`const` en el nivel
  superior, ni arrow functions en `tools/`. Todo se publica en
  `window.App.*`. Es también la regla que permite que la app
  funcione desde `file://` para uso offline.
- **Usa `var`, expresiones de función clásicas e IIFE con
  `'use strict'`.**
- **Nada de Web APIs modernas sin feature-check.** Prefiere el
  subconjunto mínimo que funcione en el Safari actual de la versión
  de iOS más antigua que aún soportemos. Si necesitas una API más
  reciente, protégela con `'apiName' in navigator` (o equivalente)
  y ofrece un fallback elegante.
- **Registra el service worker desde cada punto de entrada**, no
  solo desde `site/index.html`. El `index.html` raíz, `about/`,
  `settings/`, `team/`, `legal/` y cada `tools/<slug>/index.html`
  deben llamar a `navigator.serviceWorker.register(...)` con la ruta
  relativa correcta. Motivo: si el usuario llega directamente a una
  página (marcador, icono de pantalla de inicio, enlace externo,
  recarga) y el SW no se ha registrado en esa sesión, Safari puede
  fallar la siguiente navegación con el mensaje genérico
  "Safari no puede abrir la página".
- **Sin CDNs de JavaScript.** Los scripts externos bloqueados por
  las políticas cross-origin de Safari son una fuente habitual de
  reportes del tipo "en Chrome va, en Safari no". Todo el código
  compartido está commiteado en `assets/js/` y se carga con rutas
  relativas.
- **La verificación cross-browser es obligatoria.** El repo incluye
  `scripts/cross-browser.js`, que lanza cada actividad en Chromium +
  Firefox + WebKit, en escritorio + iPhone 12 + Pixel 5, en ES (y
  EN con `--lang en`). Las actividades nuevas y cualquier cambio
  que afecte a navegación, al service worker o al layout deben
  pasar `node scripts/cross-browser.js <slug>` antes de hacer
  merge del PR. CI no lo ejecuta (no hay `playwright` en CI), así
  que la persona que desarrolla es la última línea de defensa para
  Safari.

---

## 2. Arquitectura y diseño modular

El proyecto tiene **tres niveles de modularidad**:

```
Routime/
├── index.html             # Nivel 0: redirección a site/index.html
├── site/index.html        # Nivel 0: landing = menú de actividades (7 módulos)
├── assets/                # Nivel 1: NÚCLEO COMPARTIDO
│   ├── css/tokens.css     #   variables de diseño (colores, tipografía, táctil)
│   ├── css/base.css       #   reset, foco visible, prefers-reduced-motion
│   ├── css/components.css #   componentes reutilizables (.btn, .card, …)
│   ├── js/utils.js        #   window.App.utils
│   ├── js/i18n.js         #   window.App.i18n
│   ├── js/tts.js          #   window.App.tts
│   ├── js/storage.js      #   window.App.storage
│   ├── js/feedback.js     #   window.App.feedback
│   ├── js/dinero.js       #   window.App.dinero (actividades de euros)
│   └── img/               #   pictogramas SVG e iconos PWA; la interfaz usa primero iconos del sistema y emojis para gráficos simples; si hace falta algo más, usar imágenes libres descargadas localmente desde fuentes CC0 o de uso libre
├── tools/<slug>/          # Nivel 2: una carpeta por ACTIVIDAD (69 actuales)
│   ├── index.html         #   estructura y carga de assets
│   ├── app.js             #   solo lógica
│   ├── data.js            #   solo datos
│   ├── strings.es.js      #   textos en español
│   ├── strings.en.js      #   textos en inglés
│   └── styles.css         #   solo estilos específicos (< 150 líneas)
├── equipo/                # Ruta oculta: guía para el equipo de apoyo (§8)
├── ajustes/               # Ruta oculta: ver/borrar localStorage (§8.2)
├── presentacion/          # Ruta oculta: presentación pública del proyecto (§8.3)
├── manifest.json          # PWA
├── sw.js                  # Service worker: lista de caché + VERSION (§7)
├── firebase.json          # Hosting (despliegue)
└── .firebaserc            # Proyecto Firebase: Routime
```

### 2.1 Nivel 1 — Núcleo compartido (`assets/`)

Un cambio aquí afecta a **todas** las actividades. `i18n.js` debe cargar después de
`utils.js` y antes de `tts.js`/`feedback.js`, porque ambos leen el idioma activo.
Después del núcleo se carga **solo** `strings.<locale>.js`, seguido de `data.js` y
`app.js`. La carga condicional exacta está documentada en §6.2 y forma parte de la
anatomía estándar de §4.

### 2.2 Nivel 2 — Módulos terapéuticos (agrupación de la landing)

Las actividades se agrupan en **7 módulos** (áreas terapéuticas). Cada módulo es solo
una `<section class="modulo">` en `site/index.html` con dos variables CSS de acento —
no hay código por módulo:

| Módulo | Área | Token de color | Actividades |
|---|---|---|---|
| 🎯 Puntería y manos | Coordinación y motricidad | `--mod-coordinacion` (azul) | catch, connect-dots, tracing, coloring, piano-keys, builders |
| 📋 Mi día a día | Autonomía y hogar | `--mod-secuencia` (verde) | routines, house, situations, safe-chat, bullying-chat, post-or-not, social-safety, signs, times-of-day, what-first, what-do-i-need, where-to-store, task-list, my-agenda, what-to-wear, street, emergencies, phone-numbers, my-details, shopping, shop, healthy-food |
| 🧠 Memoria y atención | Memoria y atención | `--mod-memoria` (naranja) | pairs, differences, whats-missing, ecos, turns-mirrors, blocks, where-is, path, fit, theatre |
| 💬 Lenguaje y comprensión | Lenguaje y comunicación | `--mod-lenguaje` (frambuesa) | comedy-club, idioms, double-meaning, categories, sentence, words, vocabulary, dictionary, spelling, colored-spelling, word-search |
| 💜 Emociones | Emociones y relaciones | `--mod-emocional` (morado) | emotions, calm, friends, my-body, good-manners, education-norms, self-esteem, resilience, trust-circle |
| 💗 Cuerpo y relaciones | Educación afectivo-sexual | `--mod-cuerpo` (terracota) | sexual-health |

> **Nota multi-área**: una actividad puede trabajar más de un área terapéutica
> (por ejemplo, una actividad puede entrenar coordinación y también lenguaje y
> escritura). En la landing aparece **una sola vez**, dentro de su **módulo
> principal**: el que mejor representa su objetivo principal. Los módulos
> terapéuticos sirven para navegar; las áreas se reflejan en la descripción de
> cada actividad en `team/index.html`. El catálogo global se reconstruye a
> partir de los slugs reales en `tools/` (verificado por `scripts/check.js`).

Cada token tiene su par suave: `--mod-<x>` y `--mod-<x>-suave` (fondos).
El catálogo funcional está en [`actividades.md`](actividades.md) y el propósito
terapéutico en [`equipo.md`](equipo.md) y `team/index.html`.

### 2.3 Nivel 3 — Actividades (`tools/<slug>/`)

Cada actividad es **autónoma y aislada**:

- No comparte estado con otras actividades (cada una lee/escribe solo su clave de storage).
- No importa nada de otra carpeta `tools/`.
- Funciona si se abre su `index.html` directamente.
- Separación estricta: datos en `data.js` (formato documentado en comentario de
  cabecera), lógica en `app.js`, un archivo de texto por idioma
  (`strings.es.js` / `strings.en.js`) y estilos propios en `styles.css`
  (< 150 líneas, usando los tokens del núcleo).

### 2.4 Landing pública (`site/`)

`site/` es la **cara pública** del proyecto: una landing estática, apta para
SEO, que presenta la app y enlaza hacia ella. **No** es la aplicación en sí:
el punto de entrada de la PWA es el `index.html` raíz, que redirige a
`site/index.html` para el menú de actividades.

La carpeta publica exactamente cuatro archivos (la variante `calculia/site/`
puede incluir también `app.js` si la landing necesita interactividad propia):

```
site/
├── index.html        # marcado de la landing, meta SEO, JSON-LD, selector de idioma
├── styles.css        # estilos exclusivos de la landing (anclas, .tarjeta-cta, .pasos)
├── strings.es.js     # copia en español, registrada con App.i18n.register
└── strings.en.js     # copia en inglés (paridad obligatoria)
```

**Por qué vive junto a la app, no dentro de `assets/`**: la landing necesita
sus propias meta-etiquetas SEO (canonical, Open Graph, Twitter Card, JSON-LD)
que contaminarían el shell de actividades. Mantener `site/` separado significa
que cada sección incluye su propio `index.html` real y Cloudflare resuelve
`/site/` automáticamente (ver §1.1).

**Cuando añadas un archivo nuevo bajo `site/`** (por ejemplo, una sección
nueva, una ilustración o una variación de copia), añádelo al array `FILES`
de `sw.js` y bumpea `VERSION`. Sin el bump, los usuarios con la PWA instalada
siguen viendo el shell antiguo. Es la misma regla documentada en `CLAUDE.md`
y se aplica a cualquier archivo cacheado.

**Proyectos de la suite que publican una landing `site/` hoy** (solo estos
cuatro siguen el patrón canónico; las demás apps de la suite o bien
alojan sus actividades en otro sitio, o son la propia landing del
metaproyecto — ver `apptonomia.uk`):

| Proyecto | `site/` | `tools/` | Notas |
|---|:---:|:---:|---|
| `routime` | ✅ | ✅ (69) | Referencia canónica; la landing hace de menú de actividades. |
| `calculia` | ✅ | ✅ (15) | Referencia canónica; la landing es un catálogo didáctico. |
| `memofun` | ✅ | ✅ (1) | Flashcards; el catálogo de barajas vive en `decks/concepts/`. |
| `okeymoney` | ✅ | ✅ (8) | App de finanzas; la landing lleva al `index.html` raíz. |

`apptonomia`, `sinonimia` y `teclatlon` no publican `site/`: el primero es
la landing del metaproyecto (`apptonomia.uk`), el segundo no tiene catálogo
`tools/<slug>/`, y el tercero es una app de mecanografía sin landing por
actividad.

---

## 3. API del núcleo compartido (referencia)

### 3.1 `window.App.utils` (`utils.js`)

| Función | Firma | Descripción |
|---|---|---|
| `shuffle` | `(array) → array` | Copia barajada (Fisher-Yates). **Nunca** `sort(() => Math.random()-0.5)` |
| `$` | `(selector) → Element` | Atajo de `querySelector` |
| `$$` | `(selector) → Array<Element>` | Atajo de `querySelectorAll` (devuelve Array real) |
| `hoy` | `() → 'YYYY-MM-DD'` | Fecha local de hoy (para rutinas diarias) |
| `reducedMotion` | `() → boolean` | true si el sistema pide menos animación |

### 3.2 `window.App.tts` (`tts.js`)

| Función | Firma | Descripción |
|---|---|---|
| `speak` | `(texto, [onEnd])` | Lee en el idioma activo (`App.i18n.lang()`: es-ES o en-US) a velocidad 0.9. Cancela la lectura anterior. Si no hay síntesis disponible, llama a `onEnd` igualmente |
| `stop` | `()` | Detiene la lectura |
| `disponible` | `boolean` | Si el navegador soporta speechSynthesis |

### 3.3 `window.App.i18n` (`i18n.js`)

Sistema ES/EN. Idioma activo: `localStorage['routime:locale']`, o se detecta de
`navigator.language` si no hay nada guardado. Cambiar de idioma recarga la página.
**Referencia completa de la arquitectura y receta para añadir un idioma nuevo: `I18N.md`.**

| Función | Firma | Descripción |
|---|---|---|
| `locale` | `() → 'es'\|'en'` | Idioma activo |
| `setLocale` | `(loc)` | Guarda el idioma y recarga la página |
| `lang` | `() → 'es-ES'\|'en-US'` | Código BCP-47 para `App.tts.speak` |
| `register` | `(dict, locale)` | Registra el diccionario de un solo idioma desde `strings.<locale>.js`. La firma antigua `({es:{…}, en:{…}})` sigue disponible por compatibilidad |
| `t` | `(clave) → string` | Busca `clave` (con puntos, p. ej. `'core.back'` o `'nivel.c1'`) en el idioma activo; si falta, cae a español; si no existe, devuelve la propia clave |
| `pick` | `(clave) → string` | Como `t`, pero si el valor es un array (p. ej. `feedback.success`) devuelve un elemento al azar |
| `apply` | `([raíz])` | Aplica `data-i18n` (textContent) y `data-i18n-aria` (aria-label) a todo el DOM bajo `raíz` (por defecto, `document`) |

Claves comunes ya registradas en `core.*` (no redefinir en los archivos de cada
actividad): `back`, `backToMenu`, `playAgain`, `next`, `listen`,
`listenInstructions`, `listenText`, `loading`, `roundComplete`, `rest`.

Cada `strings.<locale>.js` registra `{ title, instruccion, … }` con su locale, y
`strings.es.js` / `strings.en.js` deben conservar exactamente las mismas claves.
`scripts/check.js` comprueba esa paridad. Los placeholders con llaves
(`'{n} veces'`) se sustituyen en `app.js` con `.replace('{n}', valor)`. La
arquitectura, los patrones de datos traducibles y las reglas para números y fechas
están desarrollados en [`I18N.md`](I18N.md).

### 3.4 `window.App.storage` (`storage.js`)

Clave interna: `routime:<toolId>`. Todas las funciones son tolerantes a fallos
(modo privado, storage lleno): nunca lanzan.

**Migración automática de claves heredadas.** Hasta el renombrado a `Routime`, el prefijo
era `apptonomia:` y las personas usuarias existentes acumularon progreso bajo ese prefijo.
La primera vez que el código nuevo lee una clave, una migración de un solo paso copia
`apptonomia:<id>` → `routime:<id>` (solo si la clave nueva está ausente) y borra la
heredada, así las personas usuarias existentes conservan su progreso sin hacer nada
manual. La migración se registra por id en una bandera en memoria para no re-escanear en
cada llamada; también es tolerante a fallos (modo privado, errores de cuota): cualquier
fallo deja la clave heredada legible y devuelve un progreso vacío. `remove()` limpia
ambos prefijos. `listaToolIds()` recorre ambos prefijos para que `settings/` muestre las
claves heredadas como "guardadas" hasta que el siguiente `get()` de cada una la migre.

| Función | Firma | Descripción |
|---|---|---|
| `get` | `(toolId) → object` | Progreso guardado, o `{}` si no hay nada o hay error. Migra `apptonomia:<toolId>` → `routime:<toolId>` en la primera lectura |
| `set` | `(toolId, data) → boolean` | Guarda JSON. `false` si falló |
| `remove` | `(toolId) → boolean` | Borra el progreso de la herramienta bajo ambos prefijos |
| `estrellasTotales` | `() → number` | Suma `datos.estrellas` de todas las claves `routime:*` (la usa la landing) |
| `listaToolIds` | `() → string[]` | Ids de las herramientas con algo guardado bajo cualquier prefijo (sin `'locale'`/`'prefs'`); la usa `settings/` |

**Contrato de progreso**: el objeto guardado debe incluir `estrellas` (number) si la
actividad da estrellas — es lo que suma la landing. El resto del objeto es libre por
actividad. Ejemplo típico: `{ estrellas: 3, completado: { nivel1: true }, opciones: {...} }`.

### 3.5 `window.App.feedback` (`feedback.js`)

| Función | Firma | Descripción |
|---|---|---|
| `acierto` | `([zona]) → string` | Mensaje positivo aleatorio + sonido suave. Escribe en `zona` (elemento con `aria-live="polite"`) y le pone clase `.acierto` |
| `animo` | `([zona]) → string` | Mensaje de ánimo tras fallo (nunca punitivo) + tono neutro. Clase `.animo` |
| `celebrar` | `(mensaje, [despues])` | Capa de celebración a pantalla completa ≤ 2 s (1,2 s con reduced motion); llama a `despues` al ocultarse |
| `lockUntilAck` | `(botones, zona, [alConfirmar])` | Tras un fallo, bloquea las opciones de la ronda sin probar y muestra un botón "Entendido" (con foco automático) dentro de `zona` que las reactiva al pulsarlo — pausa de lectura del método socrático (regla 12), nunca limita los reintentos |

Sonidos: generados con Web Audio (sin archivos), fallan en silencio.

### 3.6 `window.App.dinero` (`dinero.js`)

Módulo compartido para representar y explicar euros en El Monedero y La Tienda.
Todos los importes se expresan como **céntimos enteros**, nunca como decimales en
coma flotante. Las actividades que lo usan cargan `dinero.js` después de
`feedback.js` y antes de `strings.<locale>.js`. El aspecto visual vive en
`components.css`.

| Miembro | Descripción |
|---|---|
| `CATALOGO` | Denominaciones disponibles de 5 céntimos a 50 euros |
| `info(cent)` | Devuelve tipo y clase CSS de una denominación |
| `etiqueta(cent)` | Etiqueta corta impresa en la ficha (`2 €`, `50 cts`) |
| `formatear(cent)` | Importe localizado (`1,50 €` / `1.50 €`) |
| `hablado(cent)` | Importe escrito para TTS y explicaciones |
| `aria(cent)` | Nombre accesible de una moneda o billete |
| `crearFicha(cent, interactiva)` | Crea el elemento visual, decorativo o botón |
| `descomponer(cent)` | Descompone un importe en fichas de mayor a menor |
| `desglose(piezas)` | Explica verbalmente una colección de fichas |
| `pintarFichas(contenedor, piezas)` | Renderiza fichas decorativas con ARIA |

### 3.7 Componentes CSS (`components.css`)

Clases disponibles — **no duplicarlas** en los `styles.css` locales:

- Estructura: `.container` (máx. 900 px), `.pila` (columna con gap), `.fila`
  (fila con wrap), `.centrado`, `.oculto` (display none !important).
- Botones: `.btn` (primario, ≥ 64 px), `.btn-secundario`, `.btn-acierto`, `.btn-audio`
  (botón 🔊; estado `.hablando` o `aria-pressed="true"`), `.btn-opcion`
  (respuesta de opción múltiple; estados `.correcta` / `.animo`), `.back-link`.
- Juego: `.card`, `.progress-bar` + `.progress-fill` + `.progress-text`, `.stars`,
  `.feedback` (zona aria-live; estados `.acierto` / `.animo`), `.celebration`
  (la crea feedback.js), `.tool-header`, `.grid-tarjetas`.

**Tokens principales** (`tokens.css`): colores base (`--color-fondo/superficie/texto/
texto-suave/borde`), 6 pares de módulo (`--mod-*` / `--mod-*-suave`), feedback
(`--color-acierto`, `--color-animo` — naranja, nunca rojo agresivo —, `--color-estrella`),
tipografía (`--texto-base` 20px, `--texto-pequeno` 17px, `--texto-grande`, `--texto-titulo`),
táctil (`--boton-min` 64px, `--espacio` 16px, `--radio`, `--sombra`).

---

## 4. Anatomía de una actividad

Cada actividad en `tools/<slug>/` sigue este patrón:

### 4.1 `index.html`

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="title">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Routime</title>
    <link rel="stylesheet" href="../../assets/css/tokens.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/components.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <a href="../../site/index.html" class="back-link" data-i18n="core.back">← Volver</a>
    <h1 data-i18n="title">Parejas</h1>
    <div id="app"></div>
    <script src="../../assets/js/utils.js"></script>
    <script src="../../assets/js/i18n.js"></script>
    <script src="../../assets/js/tts.js"></script>
    <script src="../../assets/js/storage.js"></script>
    <script src="../../assets/js/feedback.js"></script>
    <script src="strings.es.js"></script>
    <script src="strings.en.js"></script>
    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### 4.2 `data.js`

```javascript
// Los datos de la actividad van aquí.
// NO poner lógica ni texto de UI.
// Formato: documentado en comentario de cabecera según la actividad.

var DATA = {
    // Niveles de dificultad
    niveles: [
        { nombre: 'nivel.nivel1', pares: 3 },
        { nombre: 'nivel.nivel2', pares: 4 },
        { nombre: 'nivel.nivel3', pares: 6 }
    ]
};
```

### 4.3 `strings.es.js` y `strings.en.js`

Cada archivo contiene un solo idioma y ambos mantienen las mismas claves:

```javascript
// strings.es.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Parejas',
        instruction: 'Toca las cartas para encontrar las que son iguales.',
        nivel1: 'Fácil',
        nivel2: 'Medio',
        nivel3: 'Difícil'
    }, 'es');
})();
```

```javascript
// strings.en.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Pairs',
        instruction: 'Tap the cards to find the matching ones.',
        nivel1: 'Easy',
        nivel2: 'Medium',
        nivel3: 'Hard'
    }, 'en');
})();
```

### 4.4 `app.js`

```javascript
// Lógica de la actividad
(function() {
    'use strict';

    // Leer progreso guardado
    var saved = App.storage.get('parejas') || {};

    function init() {
        // Aplicar traducciones
        App.i18n.apply();

        // Generar contenido dinámico
        var instruction = App.i18n.t('instruction');
        // ... resto de la lógica
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', init);
})();
```

### 4.5 `styles.css`

```css
/* Estilos específicos de la actividad */
/* Usar tokens CSS disponibles en tokens.css */

.actividad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--espacio);
}
```

---

## 5. Reglas de accesibilidad

Al crear actividades nuevas, seguir estas **13 reglas obligatorias**:

1. **Lectura Fácil**: frases cortas, una idea por frase
2. **Botones ≥ 64×64 px**, separación ≥ 16 px
3. **Alto contraste** (WCAG AA mínimo)
4. **Audio solo cuando la gamificación o el diseño de la actividad lo requiera** (p. ej. escuchar lo escrito con el teclado, lectura de secuencias): usa el botón 🔊 con `App.tts.speak()` únicamente donde la actividad lo pida. No es una regla general para todo texto importante.
   - **Sí, cuando el audio aporta algo que el usuario no puede obtener de otro modo**: una palabra o expresión nueva que está aprendiendo a pronunciar (vocabulario, spelling, diccionario, palabra del día); un estímulo sonoro al que tiene que reaccionar (una secuencia a recordar, lo que acaba de escribir o tocar, la operación a calcular, el caso sobre el que decidir); una guía hablada no visible (el ritmo de respiración en un ejercicio de calma, la etiqueta de una octava al explorar el piano).
   - **No, cuando el audio repite un texto ya en pantalla**: no se reproduce automáticamente el feedback ("muy bien / casi"), la explicación visible tras un ejercicio, el texto de la solución de una rutina ni el estado del juego en pantalla. Si la persona quiere oír ese texto, se ofrece un botón 🔊 al lado del bloque concreto, **nunca** por defecto: leer y escuchar a la vez cansa y ralentiza la actividad.
5. **Sin presión**: sin cronómetros, puntuación negativa ni "game over"
6. **Refuerzo positivo** al acertar: `App.feedback.acierto()`
7. **Respetar `prefers-reduced-motion`**
8. **Navegación por teclado** completa
9. **ARIA** en botones de icono y zonas de feedback
10. **Máximo 4-6 opciones** por pantalla
11. **Preguntas tipo quiz**: máximo 3 opciones, siempre con explicación
12. **Método socrático** al fallar: pista antes de dar la respuesta
13. **Progresión gradual**: cada nivel cambia una sola variable

---

## 6. Internacionalización

### 6.1 Sistema multi-archivo por idioma

Los textos de cada actividad/landing viven en **archivos separados por idioma** (no
en un único monolítico). Así, el cliente solo descarga el idioma activo y el
mantenimiento es independiente por idioma.

```
site/strings.es.js    ← solo español (registra en locale 'es')
site/strings.en.js    ← solo inglés (registra en locale 'en')

tools/pairs/strings.es.js    ← solo español
tools/pairs/strings.en.js    ← solo inglés
... (mismo patrón para todas las 68 actividades)
```

Cada archivo sigue este patrón:

```js
(function () {
  'use strict';
  App.i18n.register({
    title: '🃏 Parejas',
    instruccion: 'Busca las dos cartas iguales.',
    // ... resto de claves en su idioma
  }, 'es');  // o 'en', 'fr'...
})();
```

`register(dict, locale)` (con segundo argumento) registra los textos solo en ese idioma.
La API completa está en `assets/js/i18n.js` (también tiene una firma legacy
`register({es:..., en:...})` retrocompatible).

### 6.2 Carga condicional en `index.html`

`assets/js/i18n.js` debe cargarse **antes** que los `tts.js`/`feedback.js`, que
leen el idioma activo. El archivo de textos se inyecta de forma síncrona según
el locale:

```html
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/i18n.js"></script>
<script src="../../assets/js/tts.js"></script>
<script src="../../assets/js/storage.js"></script>
<script src="../../assets/js/feedback.js"></script>
<script src="strings.es.js"></script>
<script src="strings.en.js"></script>
<script src="data.js"></script>
<script src="app.js"></script>
```

Ambos archivos de locale se cargan de forma síncrona (sin `document.write`), así
que `App.i18n.register` se ejecuta antes de `data.js` y `app.js`. **No** uses
`document.write` para inyectar el archivo de textos: Chrome y Firefox procesan
los `<script>` inyectados por `document.write` de forma asíncrona, por lo que
los textos terminan cargando **después** de `data.js`/`app.js`. Como
consecuencia, `App.i18n.t()` devuelve la clave literal durante el renderizado
inicial y el DOM la conserva (el `title` del header, las etiquetas de los
botones, los títulos de sección, etc.). El patrón antiguo con `document.write`
era una regresión: el script inline se ejecutaba, el parser continuaba, y
`data.js`/`app.js` llegaban a `App.i18n.t()` antes de que el `<script>`
inyectado se hubiera ejecutado.

### 6.3 Claves comunes (`core.*`, `feedback.*`)

Ya están definidas en `assets/js/i18n.js` (no redefinir en `strings.<locale>.js`):

| Clave | ES | EN |
|-------|----|----|
| `core.back` | ← Volver | ← Back |
| `core.backToMenu` | Volver al menú | Back to menu |
| `core.playAgain` | Jugar otra vez | Play again |
| `core.next` | Siguiente → | Next → |
| `core.understood` | Entendido | Got it |
| `core.listen` | 🔊 Escuchar | 🔊 Listen |
| `feedback.success` | [array] | [array] |
| `feedback.encourage` | [array] | [array] |

### 6.4 Añadir un idioma nuevo (pasos)

1. Añadir el código a `SOPORTADOS` en `assets/js/i18n.js`
2. Añadir textos core y feedback en `i18n.js` §1.2
3. Añadir botón al selector en `site/index.html`
4. Crear `site/strings.<locale>.js`
5. Crear `tools/<slug>/strings.<locale>.js` para cada actividad (mismas claves)
6. Subir `VERSION` en `sw.js` y añadir los nuevos archivos a `ARCHIVOS`
7. Añadir `'fr'` (o el nuevo idioma) a `STRING_LOCALES` en `scripts/check.js`
8. Ejecutar `node scripts/check.js` (valida paridad de claves)
9. Ejecutar `node scripts/smoke.js --lang <locale>` (valida carga en navegadores)

Receta detallada y consideraciones (números, horas, contenido cultural) en
`I18N.md` §5.

---

## 7. Contratos transversales

- **Aislamiento**: una actividad nunca lee la clave de storage de otra. El único
  acoplamiento permitido es `estrellasTotales()` desde la landing.
- **El error nunca castiga**: no restar estrellas ni progreso; el fallo produce
  `animo()` y se puede reintentar sin límite.
- **Pausa de lectura tras un fallo**: en toda actividad de opción múltiple, un fallo
  debe bloquear las demás opciones sin probar de esa ronda con
  `App.feedback.lockUntilAck()` hasta que la persona pulse "Entendido"; las
  opciones ya probadas siguen deshabilitadas como hoy. El reintento sigue siendo
  ilimitado — es una pausa de lectura del método socrático (regla 12), nunca un
  castigo ni un bloqueo del progreso. Excepción documentada: `safe-chat` y
  `bullying-chat` aplican el bloqueo pero aún no tienen pista/explicación en dos
  fases (solo un aviso), una brecha pendiente de contenido, no de este contrato.
- **Sin cronómetros visibles**: medir tiempos internamente está permitido (dato en
  storage), mostrarlos como presión no.
- **Textos de la UI**: español de España e inglés, Lectura Fácil en los dos, sin
  lenguaje clínico ("paciente", "terapia", "discapacidad"). El lenguaje clínico solo
  se permite en `team/` y en la documentación del repo. Todo texto vive en
  `strings.<locale>.js` (nunca hardcodeado en `app.js` ni como único contenido de un nodo HTML
  sin `data-i18n`).
- **Sin etiquetas sobre la persona usuaria**: la persona nunca debe leer en la
  app nada que la etiquete como "discapacitada", "con discapacidad" o similar.
  El objetivo terapéutico se entrena con situaciones de la vida cotidiana sin
  ponerle esa etiqueta. Lo mismo se aplica a compañeros o terceros
  mencionados en una situación. Las actividades pueden hablar de diferencias y
  de apoyos sin usar el término clínico (ver [`SPEC.md` §3.3](SPEC.md)).
- **Banco de casos en simulaciones**: una actividad de simulación o entrenamiento
  debe ofrecer al menos **25 casos** para evitar que las rondas se memoricen. En
  chats pueden ser variantes de tarjetas temáticas, siempre sin superar el máximo
  de opciones visibles de §5.
- **Contrato de simulación de la vida diaria**: toda actividad cuyo objetivo
  terapéutico pueda contextualizarse debe construirse como una simulación
  de la vida diaria (según [`SPEC.md` §3.6](SPEC.md) y el principio 11): una
  escena reconocible, una decisión, consecuencia inmediata con feedback,
  ayuda socrática y una línea `transferencia` al cierre. Mecánicamente la
  actividad **debe** exponer las claves i18n `contexto`, `instruccion`
  (ya parte de la anatomía estándar) y `transferencia` en la pantalla
  final, y **debe** mantener el patrón socrático (`mostrarPista()` en el
  primer fallo, `mostrarExplicacion()` en el segundo). Cuando el objetivo
  terapéutico es entrenar una habilidad pura (memoria, motricidad fina,
  lógica, puzzles, percepción), la actividad sigue el **vehículo de
  habilidad pura** (según [`SPEC.md` §3.6.b](SPEC.md)): `contexto` y
  `transferencia` se exigen cuando aporten, `pista` / `explicacion` se
  exigen cuando aporten, `App.feedback.success` y `App.feedback.encourage`
  se exigen **siempre**, y la decisión se documenta en `team/index.html`
  como **decisión de diseño priorizada**, no como excepción. Los cuatro
  patrones mecánicos que el contrato reconoce hoy son: **escena +
  decisión**, **diálogo o chat seguro**, **rutina paso a paso** (ver
  [`guia-crear-actividades.md` §2.3](guia-crear-actividades.md)) y
  **entrenamiento de habilidad pura** (ver §3.6.b).
- **Contrato de anclajes del aprendizaje significativo**: la simulación es
  el vehículo preferente; el aprendizaje significativo (Ausubel–Novak) es
  lo que hace que una ronda — simulada o de habilidad pura — se quede.
  Además del contrato de simulación o del vehículo de habilidad pura
  ([`SPEC.md` §3.6 y §3.6.b](SPEC.md)), el contenido de cada actividad
  **debe** respetar los cuatro anclajes definidos en
  [`guia-crear-actividades.md` §5.8](guia-crear-actividades.md):
  **(a)** vocabulario cotidiano que la persona ya usa en casa, nunca
  términos clínicos o taxonómicos; **(b)** estímulos tomados del entorno
  real de la persona (tienda cercana, su rutina matutina real, no
  ejemplos abstractos); **(c)** personalización ligera cuando proceda
  (avatar estable, campo de nombre — ver `tools/piano-keys/`);
  **(d)** práctica espaciada vía `localStorage`
  (nivel guardado) para que la landing reanude a la persona en el nivel
  alcanzado y no en uno aleatorio. Una actividad que cumple el contrato
  de simulación pero omite estos anclajes se considera "solo simulación"
  y la omisión se documenta en `team/index.html` como decisión de diseño
  priorizada, no como excepción.
- **Contrato de comunicación persuasiva**: cada actividad debe comunicar
  bien, al servicio del aprendizaje, elevado a principio de producto en
  [`SPEC.md` §3.7 y principio 12](SPEC.md). En concreto, cada actividad
  **debe** ser didáctica (objetivo visible + ejemplo modelado + pista
  permanente), aplicar art effects con cuidado (lentos ≥ 300 ms, de un
  solo elemento, sin destellos, respetando `prefers-reduced-motion`),
  usar un micro-relato cercano y buen copy, ofrecer un único CTA claro
  por pantalla y gamificación con moderación (estrellas progresivas que
  se suman, nunca se restan, sin leaderboards). El detalle operativo vive
  en [`guia-crear-actividades.md` §5 y §6](guia-crear-actividades.md).
  Igual de importante, la actividad **no debe** incluir ninguno de los
  patrones de mercado prohibidos listados en `SPEC.md §3.7`: escasez
  ("solo te queda 1"), falsa urgencia ("date prisa", cuentas atrás),
  prueba social como presión (rankings, "otros ya lo han hecho"),
  coste irrecuperable / FOMO ("no pierdas tu racha"), reciprocidad
  manipuladora / dark patterns (registros forzados, casillas
  premarcadas, costes ocultos, alertas falsas), ni aversión explotadora
  a la pérdida ("tenías 5 ⭐, has perdido 2"). La presión no es una
  técnica de persuasión en Routime.
---

## 8. Rutas ocultas

Páginas para adultos (familia/profesorado/agente IA) que gestionan el dispositivo,
no para la persona usuaria. Reglas comunes a todas: **no enlazarlas nunca** desde
`site/index.html` ni desde las actividades (acceso solo por URL conocida), llevan
`<meta name="robots" content="noindex, nofollow">`, son las únicas páginas del
producto donde se permite lenguaje clínico o de administración del dispositivo, y
siguen el mismo patrón multiidioma que el resto del sitio (`strings.es.js` /
`strings.en.js`, `data-i18n`, selector de idioma) — verificado por `scripts/check.js`
igual que en `tools/`.

### 8.1 `/team/`

Guía para familias, terapeutas y profesorado + nota técnica para agentes de IA
sobre el proyecto, el diseño y el catálogo de actividades. Mantenerla actualizada
al añadir actividades o módulos, en los dos idiomas.

### 8.2 `/settings/`

Ver y borrar lo guardado en `localStorage` de este navegador. Dos acciones,
cada una con confirmación en dos pasos (un clic pide confirmar, el segundo
borra):

- **Restablecer datos de la persona**: `App.storage.remove('locale')` +
  vaciar el campo `nombre` de las herramientas que lo piden (hoy
  `piano-keys` — mantener esta lista en
  `config/app.js` si una herramienta nueva pide un nombre).
- **Restablecer toda la aplicación**: borra todas las claves `routime:*`
  (`App.storage.listaToolIds()` + `remove('locale')`). Equivale a un primer uso.

### 8.3 `/about/`

Página pública de presentación del proyecto, pensada para periodistas,
financiadores, nuevos colaboradores y cualquier persona que llega al sitio o al
repositorio y quiere entender qué es Routime sin abrir el código.

Tiene siete secciones: el origen del proyecto, los seis principios que no se
negocian (autonomía, sin presión, privacidad, Lectura Fácil, accesibilidad,
tecnología sobria), cómo está hecha la aplicación (PWA estática, sin backend,
`localStorage` único, MIT, sólo fuentes externas), las seis áreas terapéuticas
con el total de 68 actividades, las otras apps de la suite (Calculia,
Okeymoney, Sinonimia, Teclatlon — mismo equipo y filosofía, servicios
independientes con enlace externo a su propio dominio), autoría y cinco
formas de colaborar (probar, proponer, revisar, contribuir código,
difundir). El pie enlaza al menú de actividades y a la guía del equipo
de apoyo, pero ningún enlace público apunta a ella: solo se llega
escribiendo la URL.

Mantener la lista y las URLs de las otras apps de la suite sincronizadas
con `README.md`/`README.es.md` y con la sección equivalente de
`site/index.html` si cambia algún proyecto del grupo.

Actualizarla cuando se añadan módulos o cuando cambie el número total de
actividades, en los dos idiomas. No añadir aquí texto dirigido a la persona
usuaria: esa página no es para ella.

### 8.4 `/legal/`

Página de protección de datos: qué guarda Routime (solo `localStorage`
— ver §3.4/SPEC.md), dónde, para qué, cómo verlo o borrarlo (enlaza a
`/settings/`) y cómo plantear una pregunta (el repositorio público de
GitHub). Es la única excepción a las reglas de "ruta oculta" de arriba:
**sí** está enlazada desde el pie de todas las demás páginas (`site/`,
`settings/`, `team/`, `about/` y todas las `tools/<slug>/`, mediante la
clave i18n compartida `core.dataProtection` en `assets/js/i18n.js` y los
estilos `.pie-app`/`.enlace-legal` de `assets/css/components.css`), no
lleva `noindex`, y su lenguaje se mantiene claro y accesible en vez de
clínico, porque cualquiera —incluida la persona usuaria— puede llegar a
ella. Sigue igualmente el patrón `strings.es.js`/`strings.en.js`
verificado por `scripts/check.js`.

Mantenerla actualizada, en los dos idiomas, cada vez que cambie lo que la
aplicación guarda localmente (una herramienta nueva que pida un nombre o
datos personales, una acción nueva de borrado en `settings/`, etc.).

---

## 9. Receta: desarrollar una actividad nueva

1. **Elegir módulo y objetivo terapéutico.** Consultar la cobertura en
   [`equipo.md`](equipo.md). Las prioridades pendientes, si las hay, viven
   en issues de GitHub; el plan del proyecto cerrado se reconstruye con
   `git log`.
2. **Crear `tools/<slug>/`** con los 6 archivos de §4: `index.html`, `app.js`,
   `data.js`, `strings.es.js`, `strings.en.js` y `styles.css`. Copiar la estructura
   HTML y el pie de scripts de una actividad existente del mismo módulo.
3. **`data.js`**: `var DATA = {...}` — solo datos, con el formato documentado en un
   comentario de cabecera. Sin lógica ni textos de interfaz. En un quiz debe haber
   como máximo 3 opciones, una explicación por opción y una pista para el primer
   fallo. Si hay niveles, cada uno cambia una sola variable de dificultad (§5).
4. **`strings.es.js` y `strings.en.js`**: registrar un diccionario por archivo con
   `App.i18n.register(dict, 'es' | 'en')`. Ambos deben tener las mismas claves (§6).
5. **`app.js`**: IIFE con `'use strict'`. Leer y guardar con
   `App.storage.get/set('<slug>')`; reutilizar las APIs de `App.*` antes de crear
   lógica compartida nueva.
6. **`styles.css`**: solo estilos específicos (< 150 líneas), usando tokens y el
   color de acento del módulo.
7. **Cumplir las 13 reglas de accesibilidad** (§5).
8. **Registrar la actividad en todos los puntos canónicos**:
   - Tarjeta en `site/index.html` y claves correspondientes en
     `site/strings.es.js` / `site/strings.en.js`.
   - Los 6 archivos de la actividad en `ARCHIVOS` de `sw.js`, y subir `VERSION` (§11).
   - Fila en `team/index.html` y entrada bilingüe en `actividades.md` / `activities.md`.
9. **Verificar** con los comandos y criterios de §12: estructura, ambos idiomas,
   persistencia, audio, teclado, objetivos táctiles y vista responsive.
10. **Crear un commit** pequeño y coherente, con mensaje en inglés.

---

## 10. Receta: añadir un módulo terapéutico nuevo

Solo si el área no encaja en los 7 módulos existentes (comprobar la cobertura en
[`equipo.md`](equipo.md)):

1. Añadir el par de tokens en `assets/css/tokens.css`:
   `--mod-<nombre>: <color AA sobre blanco>;` y `--mod-<nombre>-suave: <fondo claro>;`.
   Verificar contraste AA del color sobre `--color-superficie`.
2. Añadir la `<section class="modulo">` en `site/index.html` con
   `style="--acento: var(--mod-<nombre>); --acento-suave: var(--mod-<nombre>-suave);"`,
   un `<h2>` con emoji + nombre en Lectura Fácil, y su `grid-tarjetas`.
3. Documentar el módulo en `actividades.md` / `activities.md`, `equipo.md` /
   `team.md`, `team/index.html` y §2.2 de esta documentación.
4. Crear la primera actividad del módulo (receta §9).

---

## 11. PWA y service worker

- `sw.js` es **cache-first** del app shell. Contrato al tocar archivos:
  1. Archivo nuevo → añadirlo a la lista `ARCHIVOS`.
  2. Cualquier cambio en archivos cacheados → **subir `VERSION`** (`Routime-vNN`),
     de lo contrario quienes tengan la PWA instalada no recibirán el cambio.
- **Sube `VERSION` en cada commit que toque un archivo cacheado.** No
  es solo "añadir una actividad": aplica a cualquier retoo de CSS,
  cualquier fix de cadena, cualquier refactor de JS en `tools/`, cada
  asignación de color de un símbolo. La caché es silenciosa: el
  desarrollador ve el código nuevo en un Ctrl+Shift+R, pero el usuario
  ve la versión vieja hasta desregistrar el SW a mano. El coste de
  subir el entero es trivial; el coste de no subirlo es "el usuario
  cree que el fix no llegó". Sube liberalmente, no de forma
  conservadora.
  El patrón de bug en la práctica: el desarrollador edita una clase
  CSS, espera ver el nuevo color en la app en ejecución, no lo ve,
  "arregla" el código otra vez, sigue sin verlo — y lo único que
  faltaba era el bump de `VERSION`. La solución es bumpear primero y
  verificar después.
     si no, los usuarios con la PWA instalada no reciben el cambio.
- El fetch handler cachea también recursos nuevos del mismo origen bajo demanda y
  hace fallback a `site/index.html` sin conexión.
- Sin aviso de actualización: el SW hace `skipWaiting()` + `clients.claim()`
  sin preguntar y los recursos nuevos se sirven de forma transparente en la
  siguiente navegación, sin interrumpir a la persona usuaria con un diálogo.
- `manifest.json`: `display: standalone`, `start_url` en `site/index.html`,
  iconos 192/512 en `assets/img/`.
- Para comprobar instalabilidad de forma objetiva: DevTools → Lighthouse →
  categoría "PWA".

---

## 12. Ejecución, verificación y despliegue

### 12.1 Servidor local

```bash
# Opción 1: Python
python -m http.server 8080          # → http://localhost:8080/site/index.html

# Opción 2: npx serve
npx serve .                         # alternativa si no hay Python
```

### 12.2 Comprobaciones de sintaxis y estructura

```bash
# Comprobación rápida de sintaxis de un archivo JS
node --check tools/<slug>/app.js

# Check estructural completo
node scripts/check.js
```

`scripts/check.js` comprueba, entre otros aspectos:
- Sintaxis JavaScript
- Estructura de carpetas de actividades
- Paridad de claves entre `strings.es.js` y `strings.en.js`
- Caché del service worker

### 12.3 Smoke test

```bash
node scripts/smoke.js
```

Abre las 68 actividades en Chromium (ES y EN) y verifica que no hay errores de consola.

### 12.4 Test cross-browser y cross-device

```bash
# Solo prueba (3 navegadores × 3 dispositivos × 1 idioma = 9 pruebas por actividad)
node scripts/cross-browser.js

# Probar también en ambos idiomas (× 2 idiomas = 18 pruebas por actividad)
node scripts/cross-browser.js --all-langs

# Probar una sola actividad
node scripts/cross-browser.js parejas

# Vía scripts de npm (no disponibles — no hay package.json)
# npm run test:cross
# npm test          # check + smoke + cross-browser
```

El proyecto no tiene `package.json`, así que no hay alias `npm run`:
cada script se invoca directamente con `node scripts/<nombre>.js`. CI
(`.github/workflows/ci.yml`) hace lo mismo.

`scripts/cross-browser.js` abre cada actividad en **Chromium (Chrome/Edge),
Firefox y WebKit (Safari)**, en **escritorio, iPhone 12 y Pixel 5**, y
verifica:

- Sin errores de consola ni de página
- Botón "Volver" visible
- Botón de audio (`.btn-audio`) presente
- Todos los `.btn` son ≥ 64×64 px (regla 2 de accesibilidad)
- Cambio de idioma ES → EN funciona (si hay selector en la actividad)
- En móvil: no hay scroll horizontal (responsive 360 px)

Requisitos (una sola vez, solo en desarrollo local — CI no los necesita):

```bash
npm install --no-save playwright
npx playwright install chromium firefox webkit
```

El flag `--no-save` evita crear un `package.json` en el repo. Las
pruebas cross-browser **no** forman parte del pipeline de CI (CI
ejecuta los scripts sin dependencias `scripts/check.js`,
`scripts/i18n-keys-smoke.js` y `scripts/scan-secrets.js`).

### 12.5 Despliegue

El sitio se publica en **Cloudflare Pages** (proyecto `Routime`). La raíz
del repositorio es el build output: no hay bundler ni paso de build.
Cloudflare recoge `_headers` automáticamente. Consulta `CLOUDFLARE.md`
en la raíz del repo para la configuración completa.

No hay workflow personalizado de GitHub Actions ni script CLI de despliegue:
los pushes a `master` disparan el build a través del conector Git de
Cloudflare, y los pull requests reciben un canal de preview automático
(`https://<hash>.Routime.pages.dev`). Redesplegar es hacer push, y
cualquier rollback se hace desde el dashboard de Cloudflare
(Workers & Pages → `Routime` → Deployments).

El único "comando de despliegue" relevante para mantenimiento es abrir un PR
— el canal de preview sustituye a las pruebas locales con navegador en
sesiones **remote-control**, según `CLAUDE.md` §A.3 (las URLs de preview siguen
siendo una operación de red, así que hay que avisar al usuario antes de
hacer push).

Los scripts anteriores (`check`, `smoke`, `test:cross`) automatizan estructura
y carga básica. Los recorridos funcionales completos, la calidad del
contenido y la revisión de accesibilidad siguen requiriendo comprobación
manual.

---

## 13. Licencia

Este proyecto es de código abierto bajo licencia MIT. Consulta el repositorio para más detalles.

## Cabecera compacta de la aplicación

La cabecera principal sigue el modelo de Memofun: icono de 44px (32px por
debajo de 650px), título Nunito de 28px (22px en móvil), atribución a la suite
y controles alineados. Usa un margen interior vertical de 8px y separa las
filas 6px. El texto secundario tiene peso normal y el contador de estrellas
es compacto. Los botones de idioma de la cabecera muestran nombres completos en escritorio
y ES/EN en móvil, con nombres accesibles completos. Teclatlon conserva sus
controles de teclado y ajustes; Enroca conserva navegación y ajustes. Estos
estilos de cabecera no cambian los controles de las actividades.

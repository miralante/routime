# SPEC.md — Definición del producto

> **Este documento define QUÉ es Routime, PARA QUIÉN es y por qué.**
>
> Para saber CÓMO está construida la aplicación (arquitectura, APIs, recetas),
> consulta [`tecnico.md`](tecnico.md).

---

## 1. Producto

Routime es una **aplicación web de actividades de terapia ocupacional** para
personas con discapacidad intelectual. Está pensada para que la persona usuaria
pueda practicar habilidades de la vida diaria de forma **autónoma**, sin necesidad
de que un profesional esté presente en cada momento.

### 1.1 Qué es y qué no es

**Es:**
- Una herramienta de práctica autónoma y refuerzo entre sesiones
- Un complemento a la intervención profesional (familia, terapeuta, profesor)
- Una aplicación usable sin conocimientos técnicos
- Una PWA instalable en el dispositivo de la persona usuaria

**No es:**
- Un sustituto del profesional de terapia ocupacional
- Una herramienta de evaluación clínica estandarizada
- Un registro de datos personales (no guarda información personal identificable)
- Una red social ni un sistema con conexión a internet obligatoria

### 1.2 Público objetivo

**Usuario final (persona con discapacidad intelectual):**
- Practica las actividades de forma autónoma o con apoyo puntual
- Necesita una interfaz accesible, clara y sin presión

**Familias:**
- Encuentran una herramienta para trabajar en casa
- Acompañan y supervisan el uso diario
- Observan progreso a través de las estrellas ⭐

**Terapeutas ocupacionales y profesores:**
- Seleccionan actividades que se ajustan a objetivos terapéuticos concretos
- Usan la aplicación como complemento entre sesiones
- Pueden ver la guía de uso en `team/`

---

## 2. Objetivos del producto

### 2.1 Objetivos terapéuticos

Routime trabaja **6 áreas terapéuticas** (módulos):

| Módulo | Área | Objetivo principal |
|--------|------|-------------------|
| 🎯 Puntería y manos | Coordinación y motricidad | Movimientos precisos con manos y dedos, coordinación ojo-mano |
| 📋 Mi día a día | Autonomía y hogar | Habilidades para la vida diaria independiente |
| 🧠 Memoria y atención | Memoria y atención | Memoria visual y auditiva, atención y concentración |
| 🔢 Pensar y contar | Razonamiento y matemáticas | Lógica, matemáticas y estrategias |
| 💬 Lenguaje y palabras | Lenguaje y comunicación | Vocabulario, comprensión, expresión |
| 💜 Emociones | Emociones y relaciones | Reconocimiento y regulación emocional, habilidades sociales |

El catálogo completo, área por área y actividad por actividad, está en
[`actividades.md`](actividades.md). El propósito terapéutico específico de cada
actividad está en `team/index.html`.

### 2.2 Objetivos de UX

- **Autonomía real**: que la persona usuaria pueda usar la app sin necesitar a otra persona a su lado
- **Accesibilidad universal**: usable por personas con distintas capacidades (lectura fácil, botones grandes, alto contraste, audio)
- **Sin presión**: nada de cronómetros visibles, ni notas negativas, ni "game over"
- **Refuerzo positivo continuo**: celebrar los intentos, no solo los aciertos
- **Bajo riesgo emocional**: nunca se muestra error explícito ni se resta puntuación
- **Entrenar con simulaciones de la vida diaria siempre que sea posible**: cada actividad es, en la medida en que el objetivo terapéutico lo permita, una **simulación de la vida diaria** — una escena reconocible (cocina, tienda, calle, chat, rutina) en la que la persona toma una decisión y ve su consecuencia en el espacio seguro de la app. Los ejercicios abstractos sin contexto son la excepción, no la regla.

---

## 3. Restricciones innegociables (de producto)

Estas restricciones vienen del **producto**, no son técnicas. Son las "leyes"
que nunca se rompen, porque definen qué tipo de experiencia ofrecemos.

### 3.1 El error nunca castiga

- No se restan estrellas ni progreso por fallar
- El fallo produce un mensaje de **ánimo** (`animar()`), nunca un "incorrecto"
- Se puede reintentar sin límite
- Se usan pistas (método socrático) antes de mostrar la respuesta

### 3.2 Sin presión temporal

- **No hay cronómetros visibles** en la interfaz
- No se mide el tiempo que tarda la persona (internamente puede, pero no se enseña)
- El ritmo lo marca la persona usuaria

### 3.3 Lectura Fácil siempre

La accesibilidad cognitiva es un principio rector: todo el contenido
sigue las pautas de **lectura fácil** y la norma **UNE 153101:2018 EX**
(estándar español de lectura fácil), alineada con las pautas europeas
de Inclusion Europe. La comprensión prevalece sobre la precisión
técnica expresada con dificultad.

- Frases cortas, una idea por frase
- Vocabulario cotidiano (sin tecnicismos)
- Sin lenguaje clínico en la interfaz ("paciente", "terapia", "discapacidad")
- El lenguaje clínico solo se permite en `team/` y en la documentación del repo
- **La persona usuaria nunca debe leer nada en la app que la etiquete
  como "discapacitada", "con discapacidad" o similar.** El objetivo
  terapéutico (p. ej. autoaceptación, respuesta a la exclusión) se
  entrena con situaciones de la vida cotidiana **sin ponerle al lector
  esa etiqueta**. Lo mismo se aplica a un compañero o a un tercero
  mencionado en una situación. Las actividades pueden hablar de
  diferencias (de ritmo, de gusto, de idioma, etc.) y de apoyos
  cotidianos sin usar el término clínico.

### 3.4 Eufemismo público: "usuario/a tipo"

Cuando se presenta Routime de cara al **público general** (prensa,
charlas, READMEs públicos que cualquiera pueda leer, el portal
`apptonomia.uk`, notas en redes sociales, marketing), el término
"discapacidad intelectual" **no debe usarse** para describir la
audiencia de la app, ni siquiera cuando el texto que lo rodea sería
público. El eufemismo aceptado en esas superficies para referirse a
la audiencia es **"usuario/a tipo"** (plural "usuarios/as tipo"),
entendido como marcador genérico de perfil, no como etiqueta para
ninguna persona real.

Dónde se aplica y dónde no:

- **Se aplica** a cualquier texto que cualquier persona ajena al
  proyecto pueda leer sin autenticarse: `README.es.md`, `README.md`,
  el portal en `apptonomia.uk`, charlas públicas, copy en redes,
  notas de prensa, material de marketing. En estas superficies se
  habla de la audiencia como "el/la usuario/a tipo" o "los/las
  usuarios/as tipo" de la app.
- **No se aplica** a la documentación interna de este repositorio
  (`CLAUDE.md`, `doc/es/SPEC.md`, `doc/en/SPEC.md`, `tecnico.md`,
  `roles.md`, `CONTRIBUTING.es.md`, `CONTRIBUTING.md`) — esos
  archivos los lee quien mantiene o contribuye al proyecto, y
  "discapacidad intelectual" sigue siendo allí el término canónico,
  porque el proyecto necesita explicar sin ambigüedad su objetivo real
  a quien lo mantiene.
- **No se aplica** al contenido del proyecto que nombra un concepto
  clínico por su nombre real (p. ej. una actividad que simula un
  trámite administrativo real relacionado con discapacidad): eso es
  contenido, no etiquetado de la audiencia.
- **No se aplica** a la UI de la propia app: la regla de §3.3 sigue
  prohibiendo **cualquier** mención, incluida "usuario/a tipo", en
  `index.html`, `app.js`, `strings.<locale>.js`, `js/i18n.js`,
  `about/privacidad.html` y cualquier otra superficie visible. El
  eufemismo es para el exterior, no para lo que lee quien visita la
  app.

Razón: presentar el objetivo real del proyecto en documentación
interna es útil y necesario; presentarlo en superficies de marketing
o landing no es necesario ni respetuoso con la audiencia —
"usuario/a tipo" permite describir en público para qué sirve la app
(qué perfil tiene quien la usa) sin nombrar públicamente un grupo
clínico.

### 3.5 Privacidad por defecto

- **Sin registro**: no se pide correo, nombre real ni contraseña
- **Sin cookies ni analítica**: nada de rastreo
- **Sin datos personales**: el progreso se guarda en el dispositivo (`localStorage`)
- La aplicación funciona sin conexión a internet
- **Contrato de progreso local**: el almacenamiento en `localStorage` se limita a
  `estrellas` (número entero) y a `completado` (qué niveles se han terminado),
  más los pocos datos opcionales que la actividad pida explícitamente (por
  ejemplo, el nombre escrito en Teclado o en Piano, que la persona usuaria borra
  cuando quiera). **Nunca** se guardan: fallos, tiempo tardado, número de
  intentos, comparativas con otras personas, historiales detallados de uso ni
  perfiles identificables. El progreso nunca sale del dispositivo; la copia
  local es responsabilidad de quien gestiona el dispositivo (ver `/settings/`).
  El progreso no se sincroniza en la nube ni se cruza entre dispositivos.

### 3.5 Accesibilidad universal

- Botones ≥ 64×64 px, separación ≥ 16 px
- Contraste WCAG AA mínimo
- Audio **solo cuando la gamificación o el diseño de la actividad lo requiera** (p. ej. escuchar lo escrito con el teclado, lectura de secuencias). No es una regla general.
- Navegación completa por teclado
- Respeta `prefers-reduced-motion`
- Máximo 4–6 opciones por pantalla
- Compatible con lectores de pantalla (ARIA)

### 3.6 Entrenar con simulación de la vida diaria siempre que sea posible

Las actividades son **herramientas de entrenamiento**, no ejercicios aislados
de la vida real. En la medida en que el objetivo terapéutico lo permita,
cada actividad se construye como una **simulación de la vida diaria**: una
escena reconocible (cocina, tienda, calle, un chat, una rutina matutina,
una emergencia) en la que la persona toma una **decisión** y ve su
**consecuencia inmediata** en el espacio seguro de la app. La simulación
es el **vehículo**; el principio pedagógico que la sostiene es el
**aprendizaje significativo** (en el sentido de Ausubel y Novak): la
práctica se ancla en lo que la persona ya sabe y se cierra con una
transferencia explícita a su vida diaria, de modo que lo entrenado se
retenga y se use fuera de la app.

Esto se aplica a todas las formas que ya usa el catálogo:

- **Escena + decisión** (p. ej. `situations`, `what-first`, `what-do-i-need`,
  `where-to-store`, `emergencies`, `street`).
- **Diálogo o chat seguro** (p. ej. `safe-chat`, `post-or-not`, `bullying-chat`).
- **Rutina paso a paso** (p. ej. `routines`, `house`, `task-list`, `my-agenda`).

La anatomía obligatoria de una ronda de simulación es:

1. **Contexto**: una escena reconocible (imagen + frase corta en
   `instruccion`) ancla la práctica en la vida diaria y en los
   conocimientos previos que la persona ya tiene en casa.
2. **Decisión**: 3–6 opciones grandes sobre las que la persona puede actuar.
3. **Consecuencia con feedback**: `App.feedback.success()` celebra la
   buena elección; `App.feedback.encourage()` acompaña la incorrecta
   sin puntuarla como error.
4. **Ayuda socrática**: primer fallo → `mostrarPista()`; segundo fallo →
   `mostrarExplicacion()` (regla 12 de [`tecnico.md`](tecnico.md) §5).
5. **Transferencia**: una frase final conecta lo practicado con el
   momento del día en el que será útil (la clave `transferencia`) —
   es lo que convierte una ronda simulada en aprendizaje significativo.

Además, al diseñar su contenido, cada actividad debe respetar los
cuatro **anclajes del aprendizaje significativo**:

- **Vocabulario cotidiano**: palabras y pictogramas que la persona ya
  maneja en casa (pan, camiseta, perro) — nunca vocabulario clínico
  o taxonómico en la interfaz.
- **Conectado con su vida**: estímulos tomados del entorno real de la
  persona (una tienda cercana, su rutina matutina real), no ejemplos
  abstractos.
- **Personalización ligera cuando proceda**: un avatar estable o un
  campo de nombre aumenta la propiedad sobre lo aprendido
  (ver `tools/piano-keys/`).
- **Práctica espaciada**: `localStorage` guarda el nivel alcanzado; la
  landing sugiere retomar ese nivel y no uno aleatorio.

#### 3.6.b Decisión de diseño: entrenamiento de habilidad pura

El producto reconoce **explícitamente** un segundo vehículo junto a la
simulación: el **entrenamiento de habilidad pura** (memoria secuencial,
motricidad fina, lógica, puzzles, percepción espacial). Es una
**decisión de diseño priorizada**, no una excepción a justificar caso
por caso.

La diferencia operativa entre los dos vehículos:

| | Simulación (3.6) | Habilidad pura (3.6.b) |
|---|---|---|
| Vehículo preferente | Sí — el producto prefiere simular siempre que el objetivo terapéutico lo permita | Válido, no equivalente; ocupa un segundo plano justificado |
| Estímulo que es contexto | Una escena reconocible | El propio estímulo (piano, cuadrícula, piezas, secuencia) **es** el contexto |
| Cuándo se prioriza | Cuando hay una decisión cotidiana que entrenar | Cuando el objetivo es la habilidad (memoria, motricidad, lógica) sin una decisión cotidiana plausible |
| Contrato | Completo: `contexto` + `instruccion` + `pista` + `explicacion` + `transferencia` + feedback + cableado socrático | Relajado: `contexto` y `transferencia` cuando aporten; `pista` y `explicacion` cuando aporten; **feedback** (`success` + `encourage`) **siempre**; entrada priorizada como tal en `team/index.html` |
| Justificación documental | Cobertura por defecto | Decisión de diseño priorizada (no "excepción") |

Actividades del catálogo que aplican este vehículo: `blocks`,
`builders`, `catch`, `checkers`, `chess`, `coloring`, `connect-dots`,
`connect-four`, `differences`, `domino`, `ecos`, `emotions`, `fit`,
`pairs`, `path`, `piano-keys`,
`tic-tac-toe`, `tracing`, `turns-mirrors`, `visual-sudoku`,
`where-is`.

> Forzar una escena donde el estímulo ya es contexto satura la pantalla
> y rompe la regla 10 de las 13 de accesibilidad (máximo de opciones
> visibles). El producto **rechaza** las simulaciones forzadas: añadir
> un decorado a una habilidad pura para "cumplir el contrato" es un
> antipatrón. Ver §6, fila "No diseña actividades como simulaciones
> forzadas".

### 3.7 Comunicación persuasiva al servicio del aprendizaje

Más allá del vehículo de simulación y de los anclajes del aprendizaje
significativo, cada actividad debe comunicar **al servicio de la persona,
nunca al servicio de la presión**. En concreto, cada actividad debe
aplicar las ocho disciplinas de comunicación que se listan abajo. La
guía operativa completa vive en
[`guia-crear-actividades.md` §5 y §6](guia-crear-actividades.md); aquí se
elevan a capa innegociable del producto.

1. **Muy didáctica** — el objetivo de cada pantalla se anuncia en una
   frase corta en `instruccion`; se muestra un ejemplo modelado antes
   de la primera ronda; hay un botón permanente "ver pista" disponible
   (`guia-crear-actividades.md` §5.1).
2. **Art effects con cuidado** — la animación se usa para **guiar la
   mirada**, no para decorar: intencional y lenta (≥ 300 ms), solo un
   elemento se mueve a la vez, desactivada con `prefers-reduced-motion`,
   refuerzo suave al acertar, **sin destellos, sin fuegos artificiales
   invasivos** (§5.4).
3. **Micro-relato cercano (storytelling)** — cada actividad se sitúa en
   una escena reconocible (cocina, tienda, parque); la pantalla final
   añade opcionalmente una frase que conecta lo aprendido con un
   momento del día (§5.6). El relato **no puede** añadir pantallas
   obligatorias ni retrasar la práctica.
4. **Buen copy** — frases cortas (≤ 12 palabras), voz activa, segunda
   persona, imperativos positivos, sin sarcasmo, sin dobles sentidos,
   amigable con TTS (§5.5).
5. **Llamada a la acción clara** — un único CTA visible por pantalla,
   verbo en imperativo, CTAs finales que **invitan a jugar otra vez o
   volver al menú**, nunca a "compartir puntuación" o "desbloquear el
   siguiente reto" (§5.7).
6. **Gamificación con moderación** — estrellas progresivas (1 → 2 → 3 ⭐
   por nivel, nunca restadas), logros visuales, micro-celebraciones con
   `App.feedback.success()`, **sin leaderboards** (§5.3, `SPEC §3.1`).
7. **Neuromarketing ético** — las siete claves del §6.1 de la guía
   (menos es más, capturar la mirada, tocar para creer, las metáforas
   funcionan, la novedad atrae, usar los sentidos, relajar y buen
   humor) usadas para **mantener la atención y anclar conceptos**,
   nunca para vender.
8. **Patrones de mercado explícitamente prohibidos** — los siguientes
   patrones forman parte de la "presión" que desterramos y **no pueden**
   aparecer en ningún punto de la app:
   - **Escasez**: "¡Solo te queda 1!", "Última oportunidad", "Date
     prisa", cuentas atrás, recompensas que desaparecen.
   - **Falsa urgencia**: cronómetros, carreras, "termina pronto",
     castigar la lentitud (choca con `§3.2`).
   - **Prueba social convertida en presión**: rankings, posiciones,
     comparaciones con otras personas, "otros ya lo han hecho" como
     presión social (choca con `§3.1`, `§6`).
   - **Coste irrecuperable / FOMO**: "perderás tu progreso si paras",
     "no pierdas la racha", mensajes forzados de retención
     (choca con `§3.2`).
   - **Reciprocidad manipuladora / dark patterns**: registros
     forzados, casillas premarcadas, costes ocultos, alertas falsas.
   - **Aversión a la pérdida explotadora**: "tenías 5 ⭐, has perdido
     2". Las estrellas solo se suman (`§3.1`).

El tono por defecto en Routime es el **calmo y autotélico** descrito
en `guia-crear-actividades.md` §6.7 — la persona practica porque la
actividad es atractiva, no porque la estemos empujando.

---

## 4. Principios de diseño

Estos principios **mandan sobre cualquier otra decisión**. Si una tarea entra en
conflicto con ellos, ganan los principios. Son la brújula del producto.

1. **Lectura Fácil**: frases cortas, una idea por frase, vocabulario cotidiano, sin metáforas.
2. **Una acción por pantalla**: la persona usuaria nunca debe decidir entre más de 4–6 opciones visibles a la vez.
3. **Objetos táctiles grandes**: botones mínimo **64×64 px**, separación mínima 16 px.
4. **Tipografía grande**: base 20 px, títulos 28–36 px, fuente legible (Atkinson Hyperlegible o Nunito).
5. **Tema claro por defecto** con alto contraste (WCAG AA mínimo, AAA cuando sea posible).
6. **Audio solo cuando aporta valor**: el audio (botón 🔊, Web Speech API, es-ES / en-US, velocidad 0.9) se utiliza solo para gamificación o cuando el diseño de la actividad lo requiere (p. ej. escuchar lo escrito con el teclado, lectura de secuencias). No se aplica por defecto a cada texto importante.
7. **Sin presión**: sin cronómetros visibles, sin puntuación negativa, sin "game over".
8. **Refuerzo positivo inmediato**: celebración visual + sonora al acertar (≤ 2 s).
9. **`prefers-reduced-motion`**: todas las animaciones se desactivan si el sistema lo pide.
10. **Autonomía**: funciona offline (PWA), sin login, sin coste, sin datos personales.
11. **Entrenar con simulación de la vida diaria**: toda actividad que pueda contextualizarse se construye como una escena reconocible (cocina, tienda, calle, chat, rutina, emergencia) en la que la persona toma una decisión y ve su consecuencia en el espacio seguro de la app. La práctica cierra siempre con una frase de **transferencia** que ancla lo entrenado a un momento del día. Cuando el objetivo terapéutico es entrenar una habilidad pura (memoria, motricidad fina, lógica, puzzles, percepción), el producto usa el vehículo de **habilidad pura** declarado en §3.6.b como decisión de diseño priorizada, **no** como excepción.
12. **Comunicación persuasiva al servicio del aprendizaje**: toda actividad es muy didáctica (objetivo visible, ejemplo modelado, andamiaje), aplica art effects con cuidado (lentos, de un solo elemento, respetuosos con `prefers-reduced-motion`, sin destellos), usa un micro-relato cercano, buen copy, una llamada a la acción clara y gamificación con moderación — y **nunca** usa escasez, falsa urgencia, prueba social como presión, FOMO, dark patterns ni aversión explotadora a la pérdida. La lista completa de patrones prohibidos vive en `§3.7`. La persona practica porque la actividad es atractiva, no porque la estemos empujando.

---

## 5. Criterios de éxito

Un cambio en Routime se considera exitoso cuando:

1. **Mantiene la autonomía**: la persona usuaria puede seguir usando la app sin ayuda externa para esa actividad
2. **Es accesible**: cumple WCAG AA y los 13 reglas de `tecnico.md` §5
3. **No introduce presión**: no hay contadores ni castigos nuevos
4. **Funciona offline**: la app sigue siendo usable sin conexión
5. **Respeta la privacidad**: no se recoge ningún dato personal nuevo
6. **Mantiene la paridad ES/EN**: cualquier texto nuevo aparece en ambos idiomas
7. **No rompe actividades existentes**: las actividades existentes siguen funcionando igual
8. **Entrena con simulación o con habilidad pura, según el objetivo**: las actividades nuevas (o los rediseños importantes) eligen entre el vehículo de simulación (§3.6, preferente cuando aplica) y el vehículo de habilidad pura (§3.6.b, decisión de diseño priorizada). En ambos casos el contenido debe respetar los anclajes del aprendizaje significativo (§3.6) y cerrar la ronda con una `transferencia` cuando aporte.
9. **Comunica persuasivamente al servicio del aprendizaje**: cada actividad es muy didáctica, usa art effects con cuidado, un micro-relato cercano, buen copy, una llamada a la acción clara y gamificación con moderación — y evita los patrones de mercado prohibidos del `§3.7` (escasez, falsa urgencia, prueba social como presión, FOMO, dark patterns, aversión explotadora a la pérdida).

---

## 6. Lo que Routime NO hace

Decisiones explícitas que pueden sorprender — están aquí para que no se
"sugieran" en el futuro:

| NO | Por qué |
|----|---------|
| No tiene cuenta de usuario | Privacidad y simplicidad |
| No guarda datos en la nube | Privacidad y offline-first |
| No tiene ranking ni comparativas | Sin presión, sin frustración |
| No usa notificaciones push | No introduce presión ni dependencias externas |
| No tiene compras integradas | Es y será gratis |
| No muestra publicidad | Financiación pública / sin ánimo de lucro |
| No recoge analítica | Privacidad |
| No tiene chatbot ni IA generativa | Determinismo, accesibilidad y predictibilidad |
| No usa redes sociales | Privacidad y foco |
| No trabaja motricidad gruesa ni coordinación postural | Requiere espacio físico y acompañamiento presencial |
| No ofrece trabajo en equipo en tiempo real | La aplicación es individual y no conecta a varias personas |
| No evalúa automáticamente la expresión oral | El reconocimiento de voz no ofrece fiabilidad suficiente para evaluar |
| No diseña actividades como ejercicios abstractos sin contexto de la vida real | El producto entrena con simulaciones de la vida diaria (§3.6, principio 11) o con habilidad pura declarada como decisión de diseño priorizada (§3.6.b). Ninguno de los dos vehículos es una "excepción" |
| No diseña actividades como simulaciones forzadas cuando el objetivo terapéutico es entrenar una habilidad pura | Forzar una escena donde el estímulo ya es contexto satura la pantalla y rompe la regla 10 de las 13 de accesibilidad; el producto rechaza el antipatrón (ver §3.6.b) |
| No usa mensajes de escasez, falsa urgencia ni FOMO ("solo te queda 1", "date prisa", "no pierdas tu racha") | Presión; choca con `§3.1`, `§3.2` y el principio 12 (patrones prohibidos en `§3.7`) |
| No usa prueba social como presión (rankings, posiciones, "otros ya lo han hecho") | Presión y desánimo; choca con `§3.1` y `§6` |
| No usa dark patterns (registros forzados, casillas premarcadas, costes ocultos, alertas falsas) | Confianza y accesibilidad; choca con `§3.4` y el principio 12 |
| No resta estrellas ni progreso como castigo | El producto solo suma, nunca resta (`§3.1`, principio 7) |

---

## 7. Cómo está organizado este documento

Este SPEC.md es la **definición del producto**: QUÉ, PARA QUIÉN y POR QUÉ.
El resto de la documentación cubre el CÓMO:

Para más informacion, consultar el mapa de toda la documentación | [`indice.md`](indice.md) |

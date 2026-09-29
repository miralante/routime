# Routime 🌱

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [routime.apptonomia.uk](https://routime.apptonomia.uk)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-arranque-r%C3%A1pido)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)
[![Pacto del colaborador](https://img.shields.io/badge/Pacto%20del%20colaborador-2.1-4baaaa.svg)](CODE_OF_CONDUCT.es.md)

Aplicación web multi-idioma de actividades de terapia ocupacional diseñada
para nuestras personas tipo. Pensada para usarse de forma autónoma,
en el navegador, sin coste y sin datos personales.

- 🌐 **Aplicación**: [routime.apptonomia.uk](https://routime.apptonomia.uk)
-  📦 **Repositorio**: [github.com/miralante/routime](https://github.com/miralante/routime)
- 💻 **Usar en tu propio ordenador**: consulta [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) §1 — descarga el ZIP y haz doble clic en `site/index.html`, o usa `python -m http.server 8080` para la experiencia PWA completa.

---

## 🚀 Pruébalo en vivo

Routime está desplegada en **[routime.apptonomia.uk](https://routime.apptonomia.uk)**
— ábrela en un navegador, instálala en la pantalla de inicio para usarla
sin conexión, y elige un módulo. La portada que ves al instalar
(`site/index.html`) es en sí misma el **landing de Apptonomia**, de
modo que una sola instalación cubre tanto las actividades de Routime
como el catálogo de toda la suite.

---

## ✨ Características

Routime es un **catálogo multi-actividad** construido sobre la misma
arquitectura de tres niveles que Apptonomia (núcleo compartido en
`assets/js/`, una carpeta por actividad en `tools/<slug>/`, una
portada en `site/`), más una página de ajustes para ver el progreso.

- 🎯 **6 módulos terapéuticos** — Apuntado y manos, Mi rutina diaria,
  Memoria y atención, Pensar y contar, Emociones, y Lectura (números y
  reloj).
- 🧩 **Decenas de actividades** — cortas, visuales, a tu propio ritmo.
- 🌐 **Bilingüe** — español (por defecto) e inglés.
- 🪶 **Cero dependencias en tiempo de ejecución** — HTML/CSS/JS puros,
  sin build.
- 🔒 **Privacidad por defecto** — sin cuentas, sin cookies, sin
  analítica: el progreso solo se guarda en `localStorage` en el
  dispositivo del usuario.
- 📦 **PWA instalable** — funciona sin conexión.
- 🖐️ **Accesibilidad** — áreas de pulsación grandes, alto contraste,
  lenguaje llano, navegación completa por teclado, `prefers-reduced-motion`.
- ⭐ **Estrellas progresivas** — solo se suman, nunca se restan.
- 🪞 **Página de ajustes** — vista de progreso y dos acciones de
  reinicio.

---

## � Acerca de

Routime es un **catálogo multi-actividad para practicar terapia
ocupacional**: actividades del día a día que entrenan mente y
habilidades para la vida cotidiana (rutinas, dinero, transporte
público, lectura del reloj, el calendario, etc.), cada una
autónoma, accesible desde una portada única, y pensada para
usarse **de forma autónoma entre sesiones**, sin necesidad de
que haya un profesional presente.

Routime es además la PWA que envuelve el **landing de Apptonomia**
(el producto original del que nació el grupo) dentro de `site/`,
para que una sola instalación cubra toda la suite. Es una de las
**siete apps** de la suite **Miralante** — la lista completa está
en [🌐 La suite Miralante](#-la-suite-miralante--proyectos-del-grupo)
más abajo. La especificación real del producto vive en
[`doc/es/spec.md`](doc/es/spec.md); este README rehúye
reformular decisiones de producto para que la descripción
pública y la especificación no se separen.

---

## 🎯 Objetivos

Routime se construye para:

- 🧠 **Ofrecer actividades de la vida diaria que se puedan
  hacer solo** — entre sesiones, sin profesional al lado.
- 📅 **Practicar rutinas, dinero, tiempo, calendario y vida
  pública** mediante actividades cortas y visuales que caben en
  una pantalla.
- 🌐 **Mantener la paridad bilingüe** — español por defecto y
  fuente de verdad; inglés con paridad en cada cadena y cada
  actividad.
- 🔒 **Guardar el progreso solo en el dispositivo** — las
  estrellas de cada actividad viven en `localStorage` bajo el
  prefijo `routime:`; nada se sube nunca.
- 📦 **Funcionar sin conexión como PWA** — instalar en la
  pantalla de inicio, usar en una tablet sin señal.
- 🪶 **Mantenerse sin dependencias** — HTML/CSS/JS puros, sin
  build.
- 🏠 **Llevar de serie el landing de Apptonomia** — la persona
  usuaria obtiene el portal de toda la suite con una sola
  instalación (ver `site/index.html`).

Cada objetivo referencia una sección de
[`doc/es/spec.md`](doc/es/spec.md); si un objetivo no está allí,
añádelo a la especificación o sácalo de la lista.

---

## 👥 Audiencia y roles

Routime está pensada para una **persona tipo** — quien quiera
ensayar habilidades de la vida diaria y mente en su propio
dispositivo, entre sesiones o clases, sin cuenta ni presión. La
especificación real del producto vive en [`doc/es/spec.md`](doc/es/spec.md);
este README evita a propósito cualquier etiqueta clínica para que
la descripción pública se mantenga genérica.

---

El proyecto reconoce tres roles alrededor de la app, cada uno
con su propio punto de entrada:

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (persona tipo) | Practica actividades en la app | Abre la app en un navegador; no lee ni escribe código | La aplicación |
| ❤️ **Apoyo** (familia, terapeuta, docente, cuidador/a) | Persona cercana a la persona usuaria | Acompaña, supervisa, aporta contenido (qué actividades faltan, claridad del lenguaje, dificultad) | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| 💻 **Construcción** (desarrollador/a) | Programa la aplicación | Implementa código, mantiene la arquitectura, revisa PRs, despliega | [`tecnico.md`](doc/es/tecnico.md) |

Routime es la PWA que envuelve varias experiencias de la suite.
La portada que ves al instalar (`site/index.html`) es en sí misma
el **landing de Apptonomia** — la app que actúa como portal de la
suite, presentado aquí porque Apptonomia fue el producto original
del que surgió este repositorio.

Ver [`doc/es/roles.md`](doc/es/roles.md) para la descripción completa
de los roles y los patrones trio/par/único en el conjunto de la suite.

---

## 📚 Documentación

Toda la documentación del proyecto está en la carpeta `doc/`:

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English | [`doc/en/index.md`](doc/en/index.md) |

Según tu rol y perfil, te interesa una u otra documentación:

| Soy… | Empieza por… |
|---|---|
| 👤 Persona usuaria o familiar | [`doc/es/indice.md`](doc/es/indice.md) |
| ❤️ Terapeuta, familiar o profesional de apoyo | [`doc/es/equipo.md`](doc/es/equipo.md) |
| 🤔 Quiero entender qué es Routime y por qué | [`doc/es/spec.md`](doc/es/spec.md) |
| 💻 Desarrollador/a | [`doc/es/tecnico.md`](doc/es/tecnico.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md) | Pacto del colaborador (Contributor Covenant 2.1) |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para la suite (Routime + landing Apptonomia + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/i18n.md` / `doc/en/i18n.md` | Detalles del sistema multiidioma ES/EN |

---

## 🌐 La suite Miralante — proyectos del grupo

Routime es una de las **siete apps** de la suite **Miralante**, que
comparten autor, la misma filosofía de accesibilidad sin backend, y la
misma historia de despliegue. Apptonomia, además de ser una app en sí
misma, actúa como **portal de la suite** que la presenta al mundo.
Ninguno de los siete repos es el "principal" — son iguales; este
repositorio casualmente también envía ese **landing de Apptonomia**
(el producto original del que nació el grupo) bajo la carpeta
`site/`, para que una sola instalación cubra todo el catálogo a quien
lo quiera.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(portal — landing only, no es app)* | Landing que presenta la suite Miralante (no es una app en tiempo de ejecución) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Ludia | Juegos adaptados con reglas, ejercicios y partidas | [github.com/miralante/ludia](https://github.com/miralante/ludia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Routime | Actividades para rutinas y vida cotidiana | [github.com/miralante/routime](https://github.com/miralante/routime) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

El [`CLOUDFLARE.md`](CLOUDFLARE.md) de este repo es la guía canónica
de despliegue de la suite; cada repo de la suite tiene su propio doc
específico que apunta aquí.

---

## 🛠️ Preparar / Ampliar contenido

Routime crece añadiendo **actividades** bajo `tools/<slug>/`. Cada
actividad trae los mismos seis archivos (`index.html`, `app.js`,
`data.js`, `strings.es.js`, `strings.en.js`, `styles.css`); cualquier
cambio tiene que respetar el bloqueo de paridad del catálogo (el
mismo conjunto de slugs debe aparecer en `tools/` en disco, en las
tarjetas de `site/index.html`, en las filas de progreso de
`config/index.html` y en `ARCHIVOS` de `sw.js`).

Para añadir una actividad nueva:

1. Crea `tools/<slug>/` con los seis archivos canónicos (usa una
   actividad existente como plantilla).
2. Registra la actividad: añade su tarjeta a `site/index.html` (+ las
   claves en ambos `site/strings.<locale>.js`), su fila de progreso a
    `config/index.html` (+ las claves en ambos
    `config/strings.<locale>.js`), y sus seis archivos a `ARCHIVOS` de
   `sw.js`.
3. Sube el `VERSION` en `sw.js` (p. ej. `routime-vN` → `routime-vN+1`).
4. Lee primero [`doc/es/guia-crear-elementos.md`](doc/es/guia-crear-elementos.md)
   — técnicas de didáctica, gamificación, persuasión y neuromarketing
   para nuestra audiencia; si una regla de la guía entra en conflicto
   con `tecnico.md`, gana `tecnico.md`.

Para ampliar el **contenido** de una actividad existente, edita su
`data.js` (más `data.js` dividido por idioma si lo hay) — `node scripts/check.js`
impone paridad de claves entre `strings.es.js` y `strings.en.js`.

---

## ✅ Validar los cambios

```bash
node scripts/check.js
```

No hace falta 
pm install` — el script solo usa la librería estándar de
Node. Comprueba sintaxis JS en `tools/`, `site/` y `assets/js/`, la
anatomía canónica de cada carpeta de actividad, paridad entre `sw.js`
y el contenido en disco, paridad de claves es/en, y la regla de paridad
del catálogo (el mismo conjunto de slugs debe aparecer en `tools/` en
disco, en las tarjetas de `site/index.html`, en las filas de progreso
de `config/index.html` y en `ARCHIVOS` de `sw.js`).

---

## ☁️ Despliegue

Routime es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub. Las cabeceras de seguridad
HTTP viven en [`_headers`](_headers), y la metadata del proyecto en
[`wrangler.toml`](wrangler.toml). Consulta [`CLOUDFLARE.md`](CLOUDFLARE.md)
con la guía completa (rebuild, rollback, dominio personalizado,
rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización
en `routime-<rama>.<subdominio-cuenta>.workers.dev` — sin necesidad
de un workflow extra.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Consulta [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo (o [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en
inglés). Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🔐 Seguridad

Routime es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin servicios de terceros en
tiempo de ejecución. El modelo de amenaza es esencialmente "qué podría
hacer una página maliciosa offline contra el mismo origen", algo que el
navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md) (o
[`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma
privada (canal preferido:
[`hello@apptonomia.uk`](mailto:hello@apptonomia.uk)).

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## 🧹 Mantenimiento

Este repo no tiene 
ode_modules` ni artefactos de build. Para limpiar
la caché local de la PWA durante el desarrollo, desregistra el SW
desde DevTools (`Application → Service workers → Unregister`) y borra
los datos del sitio. La suite completa es dependency-free: solo Node.js
estándar y JavaScript vanilla.

La carpeta `content/` guarda artefactos de autoría (materiales,
listas de palabras curadas, etc.) que nunca llegan a la app. Añadir
o editar ficheros allí no necesita `VERSION` bump.

---



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

## 👥 Roles en el proyecto

Routime tiene tres roles claramente diferenciados — persona usuaria, apoyo
y construcción — cada uno con su propio espacio y su propio punto de
entrada. Ver [`doc/es/roles.md`](doc/es/roles.md) para quién es cada uno,
cómo participa, y dónde debe mirar primero.

Routime es la PWA que envuelve varias experiencias de la suite. La
portada que ves al instalar (`site/index.html`) es en sí misma el
**landing de Apptonomia** — la app que actúa como portal de la
suite, presentado aquí porque Apptonomia fue el producto original
del que surgió este repositorio.

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
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para la suite (Routime + landing Apptonomia + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/i18n.md` / `doc/en/i18n.md` | Detalles del sistema multiidioma ES/EN |

---

## 🌐 La suite Miralante — proyectos del grupo

Routime es una de las **seis apps** de la suite **Miralante**, que
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
`data.js` (más `data.js` dividido por idioma si lo hay) —

ode scripts/check.js` impone paridad de claves entre
`strings.es.js` y `strings.en.js`.

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

## 🙌 Contribuir

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
[`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma privada.

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

## 🙏 Créditos

Routime es la PWA que envuelve varias experiencias de la suite (el
catálogo de Apptonomia como portal, más las apps de la suite
Calculia, Memofun, Okeymoney, Sinonimia y Teclatlon) sobre la misma
filosofía de accesibilidad sin backend. La portada que ves al
instalar (`site/index.html`) es el landing de Apptonomia, que se
mantiene aquí por motivos históricos — Apptonomia fue el producto
original del que nació el grupo.

El diseño de actividades sigue los patrones documentados en
[`doc/es/guia-crear-elementos.md`](doc/es/guia-crear-elementos.md)
(didáctica, gamificación, persuasión, neuromarketing), con
`tecnico.md` como fuente de verdad cuando ambas guías entran en
conflicto.





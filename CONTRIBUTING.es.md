# Contribuir a Routime

> 🌐 **Otros idiomas:** [English](CONTRIBUTING.md)

Routime tiene **tres roles diferenciados** en su comunidad:

1. 👤 **Personas con discapacidad intelectual** → son las **usuarias finales** de la app
2. ❤️ **Familiares y terapeutas** → son las **personas de apoyo** que las acompañan
3. 💻 **Desarrolladores** → son las **personas que construyen** el software

Esta guía es para los roles **2 y 3** (apoyo y construcción), que son quienes
participan en GitHub. Las **personas usuarias finales no leen ni escriben
código**, y ese es justamente el objetivo: que la herramienta sea para ellas.

---

## 👥 Los tres roles del proyecto

| # | Rol | Quién es | Participa en GitHub |
|---|---|---|---|
| 1 | 👤 **Persona usuaria** (con discapacidad intelectual) | Practica las actividades en la app | No. Usa la app de forma autónoma. Su experiencia es el centro del producto, pero no lee esta documentación. |
| 2 | ❤️ **Persona de apoyo** (familia, terapeuta, cuidador/a, profesor/a) | Persona cercana a la persona usuaria | **Sí**, con contenido: propone actividades, revisa PRs de contenido, reporta desde el uso real. |
| 3 | 💻 **Persona de construcción** (desarrollador/a, diseñador/a UX, traductor/a) | Programa o diseña el software | **Sí**, con código: implementa, revisa, despliega. |

> ⚠️ Las decisiones puramente técnicas (GitHub, arquitectura del código,
> infraestructura) las toman las personas de los roles 2 y 3, **no porque se
> ignore a la persona usuaria, sino porque es el ámbito propio de cada rol**.
> Las decisiones de producto, contenido, lenguaje y diseño de la interfaz **sí
> se prueban y se validan con ella** siempre que es posible, y su feedback es
> la fuente principal para mejorarlas.

Consulta [`doc/es/roles.md`](doc/es/roles.md) para saber por dónde debe
empezar cada rol (README, guía rápida, equipo.md, tecnico.md, …).

---

## 🔀 Flujo de trabajo en GitHub

Este es el flujo que usamos para integrar contribuciones de forma ordenada.

### Para cualquier perfil participante

```
1. 🔍 Buscar o crear un issue (en español o inglés)
2. 💬 Comentar y consensuar el alcance
3. 🌿 Crear una rama (fork si no tienes acceso de push)
4. ✏️  Hacer los cambios siguiendo nuestras guías
5. 📤 Abrir un Pull Request (PR) referenciando el issue
6. 👀 Esperar revisión (al menos 1 del perfil correspondiente)
7. ✅ Merge cuando hay aprobación
```

**Etiquetas de issues** (las usamos para clasificar):

| Etiqueta | Significado |
|---|---|
| `terapéutico` | Propuesta o cambio relativo a contenido clínico/actividades |
| `UX` | Mejora de usabilidad o experiencia |
| `contenido` | Textos, traducciones, Lectura Fácil |
| `bug` | Error reproducible en el comportamiento |
| `tech` | Implementación técnica, refactor, deuda técnica |
| `docs` | Cambios en la documentación |
| `good first issue` | Apto para una primera contribución |
| `necesita-terapeuta` | Espera revisión de un terapeuta antes del merge |
| `necesita-dev` | Espera revisión de un desarrollador antes del merge |

### Convenciones de ramas

- `feat/<slug>` — nuevas funcionalidades
- `fix/<slug>` — corrección de bugs
- `docs/<slug>` — cambios solo en documentación
- `terapia/<slug>` — cambios de contenido terapéutico (textos de actividades, fichas)
- `i18n/<código>` — traducción a un idioma (ej. `i18n/ca`, `i18n/gl`)

Ejemplos:
- `terapia/nueva-actividad-señales`
- `i18n/ca-catalan`
- `fix/audio-no-suena-en-movil`

### Commits

- Mensaje en **inglés** (convención del repo), resumen en imperativo
- Una cosa por commit — commits grandes se pueden pedir trocear
- Si cierran un issue, incluir `Closes #123` al final

---

## ❤️ Guía para personas de apoyo (familia, terapeuta, cuidador/a, profesor/a)

### Qué puedes aportar

- **Proponer una actividad nueva** con su ficha (objetivo, niveles, mensajes, datos)
- **Revisar el wording** de actividades existentes (estilo, Lectura Fácil, tono)
- **Corregir contenido** clínico o de autonomía del hogar
- **Identificar áreas terapéuticas** no cubiertas
- **Sugerir adaptaciones** para perfiles concretos de usuario
- **Reportar desde el uso real** (lo que funciona, lo que frustra, lo que echan en falta)

### Cómo empezar

1. Lee [`doc/es/SPEC.md`](doc/es/SPEC.md) — entenderás QUÉ es Routime y POR QUÉ existe
2. Lee [`doc/es/equipo.md`](doc/es/equipo.md) — visión clínica de las actividades
3. Examina [`doc/es/actividades.md`](doc/es/actividades.md) — qué hay y qué falta
4. Lee el apartado §3 del SPEC: las **restricciones innegociables** son las que tu contenido nunca debe romper

### Cómo proponer contenido

Abre un **issue** con la etiqueta `terapéutico` y rellena:

```markdown
## Actividad propuesta: <Nombre>

### Objetivo terapéutico
- Área: (coordinación / autonomía / memoria / razonamiento / lenguaje / emociones)
- Habilidad concreta: <qué se trabaja>
- Población objetivo: <rango de edad o nivel>

### Descripción breve
<qué hace la actividad en 2-3 frases>

### Niveles previstos
- Nivel 1 (Fácil): <cómo cambia una sola variable>
- Nivel 2 (Medio): <cómo cambia una sola variable>
- Nivel 3 (Difícil): <cómo cambia una sola variable>

### Mensajes de acierto / ánimo (ES)
- Acierto: "..."
- Ánimo: "..."

### Texto en pantalla (ES)
- Título: "..."
- Instrucción: "..."

### Texto en pantalla (EN) — opcional pero muy bienvenida
- Title: "..."
- Instruction: "..."

### Referencia o inspiración
<libro, artículo, página web, práctica habitual, etc.>
```

Después, una persona desarrolladora la implementará en `tools/<slug>/`
siguiendo la receta de [`doc/es/tecnico.md`](doc/es/tecnico.md) §9.

### Cómo revisar una actividad

Cuando un PR añade una actividad, tu revisión como persona de apoyo es lo que
valida que:

- Los textos están en Lectura Fácil
- El objetivo terapéutico coincide con la mecánica
- Las opciones y pistas son adecuadas
- No hay lenguaje clínico en la interfaz

---

## 💻 Guía para personas de construcción (desarrolladores)

### Qué puedes aportar

- Implementar actividades nuevas a partir de issues `terapéutico`
- Corregir bugs y mejorar rendimiento
- Refactorizar código compartido (`assets/`)
- Mejorar accesibilidad, PWA, responsive
- Mantener `tecnico.md` al día

### Cómo empezar

1. Lee [`doc/es/SPEC.md`](doc/es/SPEC.md) §3–§4 — restricciones y principios de producto
2. Lee [`doc/es/tecnico.md`](doc/es/tecnico.md) o [`doc/en/technical.md`](doc/en/technical.md)
   entero — entenderás la arquitectura, la API del núcleo y las recetas
3. Ejecuta `node scripts/check.js` — verifica que tu entorno está bien

### Recetas rápidas

- **Actividad nueva** → [`doc/es/tecnico.md`](doc/es/tecnico.md) §9
- **Módulo nuevo** → [`doc/es/tecnico.md`](doc/es/tecnico.md) §10
- **Idioma nuevo** → [`doc/es/I18N.md`](doc/es/I18N.md) §5

### Checklist antes de abrir PR

- `node scripts/check.js` pasa sin errores
- `node scripts/smoke.js` pasa sin errores (Chromium ES+EN, todas las actividades)
- `node scripts/cross-browser.js` pasa sin errores (Chrome + Firefox + Safari, escritorio + iPhone + Pixel 5)
- Probado en móvil (responsive 360 px)
- Sin errores en consola
- Si cambias archivos cacheados, has subido `VERSION` en `sw.js`
- Si has añadido una actividad, está en `team/index.html` y `site/index.html`

---

## 🌐 Guía para traductores

- Toda la UI vive en archivos `strings.<locale>.js` dentro de cada actividad
- Para añadir un idioma nuevo, ver [`doc/es/I18N.md`](doc/es/I18N.md) §5
- Mantén el estilo **Lectura Fácil** también en la traducción
- Cuidado con números y dinero (separadores y escala): ver nota en
  [`doc/es/tecnico.md`](doc/es/tecnico.md) §3.3

---

## 🚫 Lo que este repo NO acepta

(Están aquí para que no se sugieran y nos ahorren tiempo a todos)

- **Cambios que rompan autonomía, accesibilidad o privacidad** — son las
  restricciones innegociables del producto ([SPEC §3](doc/es/SPEC.md))
- **Dependencias nuevas** (npm, CDNs) — solo JS vanilla, ver [`doc/es/tecnico.md`](doc/es/tecnico.md) §1
- **Funcionalidades que añadan presión** al usuario final (cronómetros visibles,
  rankings, comparativas, "game over")
- **Lenguaje clínico en la UI** — solo se permite en `team/` y en la
  documentación interna
- **Datos personales** de ningún tipo — la app funciona en `localStorage`
  únicamente
- **Imponer decisiones técnicas a la persona usuaria** — su experiencia
  siempre se cuida desde el diseño, no se le consulta sobre GitHub

---

## 📞 Comunicación

- **Issues** → principal vía para propuestas, bugs, preguntas
- **Discussions** (si está habilitado) → para debate abierto, preguntas
  generales, ayuda
- **Pull Request reviews** → para revisión de cambios concretos

> 💡 **Consejo**: si tu contribución cruza límites (ej. una actividad que
> necesita una persona de apoyo + una persona desarrolladora), abre **dos
> issues relacionados** o un issue con ambas etiquetas (`necesita-terapeuta`,
> `necesita-dev`). Así ambas saben que tienen que intervenir.

---

## 📜 Código de conducta

Este proyecto sigue [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).
Participar implica aceptarlo.

---

## 🙏 Agradecimientos

Gracias por dedicar tiempo a una herramienta que ayuda a personas con
discapacidad intelectual a ser un poco más autónomas cada día.

# Routime

> 🌐 **Otros idiomas:** [English](README.md)

Aplicación web multi-idioma de actividades de terapia ocupacional para personas con
discapacidad intelectual. Pensada para usarse de forma autónoma, en el
navegador, sin coste y sin datos personales.

- 🌐 **Aplicación**: [routime.apptonomia.uk](https://routime.apptonomia.uk)
-  📦 **Repositorio**: [github.com/miralante/routime](https://github.com/miralante/routime)
- 💻 **Usar en tu propio ordenador**: consulta [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) §1 — descarga el ZIP y haz doble clic en `site/index.html`, o usa `python -m http.server 8080` para la experiencia PWA completa.

---

## 👥 Roles en el proyecto

Routime tiene tres roles claramente diferenciados — persona usuaria, apoyo
y construcción — cada uno con su propio espacio y su propio punto de
entrada. Ver [`doc/es/roles.md`](doc/es/roles.md) para quién es cada uno,
cómo participa, y dónde debe mirar primero.

Routime es la PWA que envuelve varias experiencias hermanas. La
portada que ves al instalar (`site/index.html`) es en sí misma el
**landing de Apptonomia** — un proyecto más del grupo de hermanos,
presentado aquí porque Apptonomia fue el producto original del que
surgió este repositorio.

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
| 👤 Persona usuaria o familiar | [`doc/es/README.md`](doc/es/README.md) |
| ❤️ Terapeuta, familiar o profesional de apoyo | [`doc/es/equipo.md`](doc/es/equipo.md) |
| 🤔 Quiero entender qué es Routime y por qué | [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| 💻 Desarrollador/a | [`doc/es/tecnico.md`](doc/es/tecnico.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para el grupo de hermanos (Routime + landing Apptonomia + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/I18N.md` / `doc/en/I18N.md` | Detalles del sistema multiidioma ES/EN |

---

## 🧩 Proyectos hermanos

Routime es uno más de un pequeño grupo de proyectos hermanos que
comparten autor, la misma filosofía de accesibilidad sin backend, y
la misma historia de despliegue. Ninguno es el "principal" — son
iguales; este repositorio casualmente también envía el **landing de
Apptonomia** (el producto original del que nació el grupo) bajo la
carpeta `site/`, para que una sola instalación cubra todo el
catálogo a quien lo quiera.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Routime** *(este repo — shell PWA + landing Apptonomia)* | Contenedor PWA y landing de terapia ocupacional; 7 módulos, 68 actividades | [github.com/miralante/routime](https://github.com/miralante/routime) |
| **Landing Apptonomia** *(incluido en este repo, bajo `site/`)* | La portada original de terapia ocupacional — la experiencia de entrada para la persona usuaria | [github.com/miralante/routime/tree/master/site](https://github.com/miralante/routime/tree/master/site) |
| Calculia | Cálculo y razonamiento lógico: 12 actividades | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

El [`CLOUDFLARE.md`](CLOUDFLARE.md) de este repo es la guía canónica
de despliegue del grupo; cada repo hermano tiene su propio doc
específico que apunta aquí.


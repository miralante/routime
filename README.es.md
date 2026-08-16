# Apptonomia

> 🌐 **Otros idiomas:** [English](README.md)

Aplicación web multi-idioma de actividades de terapia ocupacional para personas con
discapacidad intelectual. Pensada para usarse de forma autónoma, en el
navegador, sin coste y sin datos personales.

- 🌐 **Aplicación**: [apptonomia.web.app](https://apptonomia.web.app)
-  📦 **Repositorio**: [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia)
- 💻 **Usar en tu propio ordenador**: consulta [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) §1 — descarga el ZIP y haz doble clic en `site/index.html`, o usa `python -m http.server 8080` para la experiencia PWA completa.

---

## 👥 Roles en el proyecto

Apptonomia tiene tres roles claramente diferenciados — persona usuaria, apoyo
y construcción — cada uno con su propio espacio y su propio punto de
entrada. Ver [`doc/es/roles.md`](doc/es/roles.md) para quién es cada uno,
cómo participa, y dónde debe mirar primero.

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
| 🤔 Quiero entender qué es Apptonomia y por qué | [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| 💻 Desarrollador/a | [`doc/es/tecnico.md`](doc/es/tecnico.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para el grupo de hermanos (Apptonomia + Calculia, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/I18N.md` / `doc/en/I18N.md` | Detalles del sistema multiidioma ES/EN |

---

## 🧩 Proyectos hermanos

Apptonomia es el **proyecto principal** de un pequeño grupo de
proyectos hermanos que comparten autor, la misma filosofía de
accesibilidad y sin backend, y la misma historia de despliegue. Los
demás salieron de Apptonomia o se construyeron a su lado sobre el
mismo stack.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(principal — este repo)* | Terapia ocupacional: 7 módulos, 68 actividades | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Cálculo y razonamiento lógico: 12 actividades | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

El [`CLOUDFLARE.md`](CLOUDFLARE.md) de este repo es la guía canónica
de despliegue del grupo; cada repo hermano tiene su propio doc
específico que apunta aquí.


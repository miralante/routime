# Guía rápida de uso

> 🌐 **Otro idioma:** [English](../en/quick-guide.md)

Esta guía explica paso a paso cómo usar Routime: desde cómo abrirla
hasta cómo se gana estrellas, cambiar idioma o instalarla en tu
teléfono. Incluye también **cuatro formas de abrir la app**, ordenadas
de más fácil a más difícil.

---

## 📑 Índice rápido

1. [Cómo abrir Routime (4 métodos)](#1-cómo-abrir-Routime)
   - [A · Desde internet](#a-desde-internet-más-fácil)
   - [B · Descargando el ZIP desde GitHub](#b-descargando-el-zip-desde-github)
   - [C · Con un servidor local en Python](#c-con-un-servidor-local-en-python)
   - [D · Con un servidor local en Node.js](#d-con-un-servidor-local-en-nodejs-más-elaborado)
2. [La pantalla principal](#2-la-pantalla-principal)
3. [Elegir una actividad](#3-elegir-una-actividad)
4. [Los botones de cada actividad](#4-los-botones-de-cada-actividad)
5. [Cómo funciona el audio](#5-cómo-funciona-el-audio)
6. [Los mensajes de respuesta](#6-los-mensajes-de-respuesta)
7. [Ganar estrellas](#7-ganar-estrellas)
8. [Cambiar el idioma](#8-cambiar-el-idioma)
9. [Configuración personal](#9-configuración-personal)
10. [Instalar la aplicación en el móvil](#10-instalar-la-aplicación-en-el-móvil)
11. [Solución de problemas](#11-solución-de-problemas)
12. [Más ayuda](#12-más-ayuda)
13. [Resumen rápido](#13-resumen-rápido)

---

## 1. Cómo abrir Routime

Tienes **cuatro maneras**, ordenadas de más fácil a más difícil.
Elige la que más te convenga:

| # | Método | ¿Qué necesito? | ¿Sin internet? | PWA / instalable |
|---|---|---|---|---|
| **A** | [Desde internet](#a-desde-internet-más-fácil) | Un navegador | ❌ | ✅ |
| **B** | [Descargando el ZIP desde GitHub](#b-descargando-el-zip-desde-github) | Un navegador | ❌ | ❌ |
| **C** | [Servidor local con Python](#c-con-un-servidor-local-en-python) | Python 3 | ❌ | ✅ |
| **D** | [Servidor local con Node.js](#d-con-un-servidor-local-en-nodejs-más-elaborado) | Node.js | ✅ | ✅ |

> 💡 Si solo quieres **probar la app**, usa el método **A** o **B**.
> Si quieres la **experiencia completa** (PWA, modo offline, "Añadir
> a pantalla de inicio"), usa **C** o **D**.

---

### A · Desde internet (más fácil)

> ⏱️ Tiempo: **30 segundos**. Solo necesitas un navegador.

1. Abre tu navegador favorito (Chrome, Firefox, Safari, Edge…)
2. Escribe en la barra de direcciones:

   ```
   Routime.web.app
   ```

3. Pulsa **Enter**

¡Listo! Ya estás en la pantalla principal. ✅

> 💡 Esta opción siempre usa la **versión más reciente** de la app,
> sin que tengas que hacer nada.

---

### B · Descargando el ZIP desde GitHub

> ⏱️ Tiempo: **2 minutos**. Útil si quieres tener la app en tu
> ordenador sin instalar nada extra.

#### Paso 1 · Descarga el código desde GitHub

1. Abre en tu navegador:
   [github.com/thenkdframe/Routime](https://github.com/thenkdframe/Routime)
2. Pulsa el botón verde **`<> Code`**
3. Elige **«Download ZIP»**
4. Guarda el archivo (por ejemplo en `Descargas`)

Se descargará algo como `Routime-main.zip` (~70 MB; la mayoría son
imágenes y fuentes).

#### Paso 2 · Descomprime el ZIP

- **Windows**: clic derecho → **Extraer todo…** → elige una carpeta,
  p. ej. `C:\Routime\`
- **macOS**: doble clic sobre el ZIP (se crea una carpeta al lado)
- **Linux**: clic derecho → **Extraer aquí** o desde terminal:
  `unzip Routime-main.zip -d ~/Routime`

> ⚠️ **Importante**: la carpeta resultante debe contener directamente
> `index.html`, `site/`, `tools/`, `assets/`, etc. Si ves una carpeta
> intermedia tipo `Routime-main/Routime/...`, muévete a la
> carpeta interior.

#### Paso 3 · Abre la app

Haz **doble clic** sobre el archivo `site/index.html`.

Se abrirá en tu navegador por defecto y verás la pantalla principal. ✅

#### ¿Qué funciona y qué no en este modo?

| Característica | ¿Funciona? |
|---|---|
| Abrir y usar todas las actividades | ✅ Sí |
| Guardar progreso (estrellas, niveles) | ✅ Sí |
| Cambiar idioma (ES / EN) | ✅ Sí |
| Lectura por voz (TTS) | ✅ Sí |
| Service Worker / PWA / offline | ❌ No |
| "Instalar" como aplicación | ❌ No |

> 💡 Si con este método algo no carga, prueba el **método C**.

---

### C · Con un servidor local en Python

> ⏱️ Tiempo: **5 minutos**. Activa la PWA y el modo offline.
> Recomendado si quieres la experiencia completa.

Python viene preinstalado en **macOS** y en la mayoría de **Linux**. En
**Windows** puedes instalarlo desde
[python.org/downloads](https://www.python.org/downloads/).

#### Paso 1 · Descarga y descomprime

Igual que en el método B, pasos 1 y 2. Acabas con una carpeta, p. ej.
`C:\Routime\` o `~/Routime`.

#### Paso 2 · Abre una terminal en esa carpeta

- **Windows**: abre el **Explorador de archivos** en `C:\Routime`,
  escribe `cmd` en la barra de direcciones y pulsa **Enter**
- **macOS**: abre **Terminal**, escribe `cd ` (con espacio) y **arrastra**
  la carpeta a la ventana
- **Linux**: abre la terminal y ejecuta `cd /ruta/a/Routime`

#### Paso 3 · Arranca el servidor

```bash
python -m http.server 8080
```

Verás un mensaje como:

```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

> ℹ️ Si tu sistema tiene varias versiones, prueba
> `python3 -m http.server 8080`.
> **No cierres esta ventana** mientras uses la app.

#### Paso 4 · Abre la app en el navegador

Visita:

```
http://localhost:8080/site/index.html
```

¡Listo! Ya tienes Routime funcionando localmente, **con PWA y modo
offline** la primera vez que cargues cada pantalla. ✅

#### Para detener el servidor

Vuelve a la terminal y pulsa **`Ctrl + C`**.

---

### D · Con un servidor local en Node.js (más elaborado)

> Útil si ya tienes Node instalado o si prefieres `npx` sin instalar
> nada globalmente.

#### Paso 1 · Descarga y descomprime

Igual que antes. Terminas con la carpeta `Routime/` en tu equipo.

#### Paso 2 · Arranca un servidor en una sola línea

Abre una terminal dentro de la carpeta y ejecuta **una** de estas
opciones:

```bash
# Opción A: con npx (no instala nada global)
npx --yes http-server -p 8080 -c-1
```

```bash
# Opción B: con serve
npx --yes serve -p 8080
```

```bash
# Opción C: con Node puro (sin dependencias), Node 18+
node -e "require('http').createServer((_,res)=>{const fs=require('fs'),p=require('path'),u=require('url');let f=p.join(process.cwd(),decodeURIComponent(u.parse(_.url).pathname));if(fs.existsSync(f+'index.html')&&fs.statSync(f).isDirectory())f+='index.html';fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('404')}else{res.writeHead(200,{'Content-Type':(p.extname(f)==='.html'?'text/html':p.extname(f)==='.js'?'application/javascript':p.extname(f)==='.css'?'text/css':'application/octet-stream')});res.end(d)}})}).listen(8080,()=>console.log('http://localhost:8080'))"
```

#### Paso 3 · Abre en el navegador

```
http://localhost:8080/site/index.html
```

> 💡 Si prefieres tener un comando fijo, puedes instalar `http-server`
> globalmente:
>
> ```bash
> npm install -g http-server
> http-server -p 8080
> ```

---

### "Instalar" como aplicación (PWA)

Funciona con los métodos **A** (internet), **C** y **D** (servidor
local). **No funciona** con el método **B** (`file://`).

1. Abre la app en el navegador
2. En la barra del navegador aparecerá un icono (un cuadrado con una
   flecha en Chrome/Edge, o un icono de compartir en Safari)
3. Pulsa **«Instalar»** o **«Añadir a la pantalla de inicio»**
4. Se creará un icono en tu escritorio / menú inicio que abre
   Routime como si fuera una aplicación nativa

---

### Solución de problemas de instalación local

| Síntoma | Causa probable | Solución |
|---|---|---|
| Doble clic en `index.html` y se ve en blanco | El navegador está abriendo desde una ruta rara | Abre `site/index.html` directamente |
| "No se puede cargar `manifest.json`" o faltan iconos | Moviste archivos de sitio | Asegúrate de que `index.html`, `site/`, `tools/`, `assets/`, `manifest.json` están en la **misma carpeta raíz** |
| Las voces (TTS) no suenan en `file://` | Algunos navegadores desactivan TTS en `file://` | Usa el método C o D (servidor local) |
| Service Worker no se registra | Estás en `file://` | Es normal. Usa método C o D |
| `python: command not found` | Python no está instalado | Usa método D (Node), o instala Python |
| El puerto 8080 ya está ocupado | Otra app usa ese puerto | Cambia el puerto: `python -m http.server 9000` y abre `http://localhost:9000/site/index.html` |
| Quiero compartir la app con otros dispositivos en mi red | Estás en el mismo Wi-Fi | Averigua tu IP local (`ipconfig` en Windows, `ifconfig` en Mac/Linux) y desde otro dispositivo visita `http://TU-IP:8080/site/index.html` |

### ¿Dónde se guardan mis progresos?

En el **`localStorage`** del navegador (la memoria interna del
navegador, no en disco). Esto significa:

- ✅ **Privado**: nunca sale de tu ordenador
- ✅ **Sin cuenta**: no necesitas registrarte
- ⚠️ **Por navegador**: si cambias de navegador o de dispositivo,
  el progreso no se transfiere
- ⚠️ **Si borras datos del navegador**, perderás las estrellas y niveles

Puedes ver y borrar tu progreso desde el menú oculto
[`settings/`](../../settings/index.html).

---

## 2. La pantalla principal

Cuando entras en la aplicación, ves una pantalla con **6 cajas de colores**. Cada caja es un **módulo** con actividades diferentes.

```
┌─────────────────────────────────────────────────────────────┐
│  🇪🇸 Español    🇬🇧 English                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎯 PUNTERÍA Y MANOS                                 │   │
│  │ Coordinación y motricidad                           │   │
│  │ [Atrapa] [Trazos] [Colorear]...                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📋 MI DÍA A DÍA                                     │   │
│  │ Autonomía y hogar                                   │   │
│  │ [Rutinas] [La Casa] [Emergencias] [La Compra]...  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... más módulos ...                                        │
│                                                             │
│  ⭐ Tus estrellas: 12                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Elegir una actividad

1. **Toca el módulo** que te interese
2. **Toca la actividad** que quieras hacer
3. ¡Listo! La actividad se abre

---

## 4. Los botones de cada actividad

La mayoría de actividades tienen estos elementos:

| Botón | Para qué sirve |
|-------|----------------|
| **🔊 Escuchar** | Escuchar el texto en voz alta |
| **← Volver** | Volver al menú de módulos |
| **Jugar otra vez** | Repetir la actividad |

### En actividades con niveles

Algunas actividades tienen **niveles** (más fácil → más difícil):

```
┌─────────────────────────────┐
│      ELIGE EL NIVEL         │
│                             │
│  Nivel 1: Fácil             │
│  ─────────────────────────  │
│  Nivel 2: Medio             │
│  ─────────────────────────  │
│  Nivel 3: Difícil           │
│                             │
└─────────────────────────────┘
```

---

## 5. Cómo funciona el audio

Verás un botón **🔊** **solo** en las actividades en las que el
audio resulta útil — por ejemplo, para escuchar lo que escribes con
el teclado o para oír una secuencia.

**Para escuchar:**
1. Toca el botón 🔊
2. Escucha la voz
3. Si la voz está hablando, puedes tocarla de nuevo para que se pare

---

## 6. Los mensajes de respuesta

Cuando haces algo en la aplicación, puedes ver mensajes:

### ✅ Cuando aciertas
Aparece un mensaje verde o amarillo con frases como:
- "¡Muy bien!"
- "¡Genial!"
- "¡Perfecto!"

### 🔶 Cuando no es correcto
Aparece un mensaje azul (nunca rojo) con frases como:
- "Casi. ¡Inténtalo otra vez!"
- "Piensa un poco más"
- "Mira otra vez"

Nunca aparece un mensaje de "error" o "fracaso".

---

## 7. Ganar estrellas

Cuando completas actividades, puedes ganar **estrellas** ⭐.

Las estrellas se guardan automáticamente. Puedes ver cuántas tienes en la pantalla principal.

---

## 8. Cambiar el idioma

En la parte superior derecha hay dos botones:

```
[🇪🇸 Español]  [🇬🇧 English]
```

Toca el idioma que quieras. La página se recargará en ese idioma.

---

## 9. Configuración personal

Toca el botón de **settings** (⚙️) si quieres:

- Cambiar el tamaño del texto (más grande o más pequeño)
- Activar o desactivar los sonidos
- Ver tu progreso en cada actividad
- Borrar tu progreso guardado

> **Nota**: El botón de ajustes está oculto. Para encontrarlo, escribe
> `/ajustes` al final de la dirección web.

---

## 10. Instalar la aplicación en el móvil

Puedes tener Routime como si fuera una app en tu teléfono:

**En Android (Chrome):**
1. Abre la web
2. Toca los tres puntos (⋮)
3. Selecciona "Añadir a pantalla de inicio"

**En iPhone (Safari):**
1. Abre la web
2. Toca el botón de compartir (□↑)
3. Selecciona "Añadir a pantalla de inicio"

> 💡 Después de instalarla, **se puede usar sin internet** (los
> archivos quedan guardados en el teléfono gracias al Service Worker).

---

## 11. Solución de problemas

### La aplicación no carga
- Comprueba tu conexión a internet
- Cierra el navegador y vuélvela a abrir

### No se escucha el audio
- Comprueba que el volumen del dispositivo está activo
- Comprueba que el navegador tiene permiso para reproducir sonido

### No se guarda el progreso
- Comprueba que tienes espacio en el navegador
- Prueba a usar otro navegador (Chrome o Firefox)

### Otros problemas
- Cierra todas las pestañas de Routime
- Vuelve a abrir la aplicación

---

## 12. Más ayuda

Si necesitas más información:

- [Catálogo de actividades](actividades.md) — Lista completa de actividades
- [Información técnica](tecnico.md) — Para desarrolladores y profesionales
- [Página del equipo](../team/index.html) — Guía para familias y profesionales

---

## 13. Resumen rápido

| Qué quiero hacer | Cómo hacerlo |
|------------------|--------------|
| Elegir una actividad | Toca un módulo → toca una actividad |
| Escuchar un texto | Toca el botón 🔊 |
| Cambiar idioma | Toca 🇪🇸 o 🇬🇧 arriba |
| Ver mi progreso | Mira las estrellas ⭐ en el menú |
| Repetir una actividad | Toca "Jugar otra vez" |
| Volver al menú | Toca "← Volver" |
| Abrir la app sin instalar nada | Visita [Routime.web.app](https://Routime.web.app) |
| Usarla en mi propio ordenador | Descarga el ZIP de GitHub y abre `site/index.html` |
| Experiencia completa (PWA, offline) | `python -m http.server 8080` y abre `http://localhost:8080/site/index.html` |

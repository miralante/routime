# Quick guide

> 🌐 **Other language:** [Español](../es/guia-rapida.md)

This guide explains step by step how to use Routime: from opening it
to earning stars, switching language or installing it on your phone.
It also includes **four ways to open the app**, ordered from easiest to
hardest.

---

## 📑 Quick index

1. [How to open Routime (4 methods)](#1-how-to-open-Routime)
   - [A · From the internet](#a-from-the-internet-easiest)
   - [B · Downloading the ZIP from GitHub](#b-downloading-the-zip-from-github)
   - [C · With a local Python server](#c-with-a-local-python-server)
   - [D · With a local Node.js server](#d-with-a-local-nodejs-server-most-elaborate)
2. [The main screen](#2-the-main-screen)
3. [Choosing an activity](#3-choosing-an-activity)
4. [Buttons in each activity](#4-buttons-in-each-activity)
5. [How audio works](#5-how-audio-works)
6. [Response messages](#6-response-messages)
7. [Earning stars](#7-earning-stars)
8. [Changing language](#8-changing-language)
9. [Personal settings](#9-personal-settings)
10. [Install the app on mobile](#10-install-the-app-on-mobile)
11. [Troubleshooting](#11-troubleshooting)
12. [More help](#12-more-help)
13. [Quick summary](#13-quick-summary)

---

## 1. How to open Routime

There are **four ways**, ordered from easiest to hardest. Pick the one
that suits you best:

| # | Method | What you need | Offline? | PWA / installable |
|---|---|---|---|---|
| **A** | [From the internet](#a-from-the-internet-easiest) | A browser | ❌ | ✅ |
| **B** | [Downloading the ZIP from GitHub](#b-downloading-the-zip-from-github) | A browser | ❌ | ❌ |
| **C** | [Local server with Python](#c-with-a-local-python-server) | Python 3 | ❌ | ✅ |
| **D** | [Local server with Node.js](#d-with-a-local-nodejs-server-most-elaborate) | Node.js | ✅ | ✅ |

> 💡 If you just want to **try the app**, use method **A** or **B**.
> For the **full experience** (PWA, offline mode, "Add to home
> screen"), use **C** or **D**.

---

### A · From the internet (easiest)

> ⏱️ Time: **30 seconds**. All you need is a browser.

1. Open your favourite browser (Chrome, Firefox, Safari, Edge…)
2. Type in the address bar:

   ```
   routime.apptonomia.uk
   ```

3. Press **Enter**

Done! You're on the main screen. ✅

> 💡 This option always uses the **latest version** of the app,
> no setup needed.

---

### B · Downloading the ZIP from GitHub

> ⏱️ Time: **2 minutes**. Useful if you want the app on your
> computer without installing anything extra.

#### Step 1 · Download the code from GitHub

1. Open in your browser:
   [github.com/thenkdframe/routime](https://github.com/thenkdframe/routime)
2. Click the green **`<> Code`** button
3. Choose **«Download ZIP»**
4. Save the file (e.g. into `Downloads`)

It will download something like `Routime-main.zip` (~70 MB; most
of it is images and fonts).

#### Step 2 · Unzip the file

- **Windows**: right-click → **Extract All…** → pick a folder, e.g.
  `C:\Routime\`
- **macOS**: double-click the ZIP (a folder appears next to it)
- **Linux**: right-click → **Extract Here** or in a terminal:
  `unzip Routime-main.zip -d ~/Routime`

> ⚠️ **Important**: the resulting folder must contain `index.html`,
> `site/`, `tools/`, `assets/`, etc. **directly**. If you see an
> intermediate folder like `Routime-main/Routime/...`, move
> into the inner folder.

#### Step 3 · Open the app

**Double-click** the `site/index.html` file.

It opens in your default browser and you should see the home screen. ✅

#### What works and what doesn't in this mode?

| Feature | Works? |
|---|---|
| Open and use every activity | ✅ Yes |
| Save progress (stars, levels) | ✅ Yes |
| Switch language (ES / EN) | ✅ Yes |
| Text-to-speech (TTS) | ✅ Yes |
| Service Worker / PWA / offline | ❌ No |
| "Install" as an app | ❌ No |

> 💡 If something doesn't load with this method, try **method C**.

---

### C · With a local Python server

> ⏱️ Time: **5 minutes**. Enables PWA and offline mode.
> Recommended for the full experience.

Python is pre-installed on **macOS** and most **Linux** distributions.
On **Windows** you can install it from
[python.org/downloads](https://www.python.org/downloads/).

#### Step 1 · Download and unzip

Same as method B, steps 1 and 2. You end up with a folder, e.g.
`C:\Routime\` or `~/Routime`.

#### Step 2 · Open a terminal in that folder

- **Windows**: open **File Explorer** in `C:\Routime`, type `cmd` in
  the address bar and press **Enter**
- **macOS**: open **Terminal**, type `cd ` (with a space) and **drag**
  the folder into the window
- **Linux**: open a terminal and run `cd /path/to/Routime`

#### Step 3 · Start the server

```bash
python -m http.server 8080
```

You'll see a message like:

```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

> ℹ️ If your system has multiple versions, try
> `python3 -m http.server 8080`.
> **Don't close this window** while using the app.

#### Step 4 · Open the app in your browser

Visit:

```
http://localhost:8080/site/index.html
```

Done! Routime is now running locally, **with PWA and offline
mode** after the first load of each screen. ✅

#### To stop the server

Go back to the terminal and press **`Ctrl + C`**.

---

### D · With a local Node.js server (most elaborate)

> Useful if you already have Node, or if you prefer `npx` without
> a global install.

#### Step 1 · Download and unzip

Same as before. You end up with the `Routime/` folder on your
machine.

#### Step 2 · Start a server with one command

Open a terminal inside the folder and run **one** of these:

```bash
# Option A: with npx (no global install)
npx --yes http-server -p 8080 -c-1
```

```bash
# Option B: with serve
npx --yes serve -p 8080
```

```bash
# Option C: pure Node (no deps), Node 18+
node -e "require('http').createServer((_,res)=>{const fs=require('fs'),p=require('path'),u=require('url');let f=p.join(process.cwd(),decodeURIComponent(u.parse(_.url).pathname));if(fs.existsSync(f+'index.html')&&fs.statSync(f).isDirectory())f+='index.html';fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('404')}else{res.writeHead(200,{'Content-Type':(p.extname(f)==='.html'?'text/html':p.extname(f)==='.js'?'application/javascript':p.extname(f)==='.css'?'text/css':'application/octet-stream')});res.end(d)}})}).listen(8080,()=>console.log('http://localhost:8080'))"
```

#### Step 3 · Open in your browser

```
http://localhost:8080/site/index.html
```

> 💡 If you want a fixed command, you can install `http-server`
> globally:
>
> ```bash
> npm install -g http-server
> http-server -p 8080
> ```

---

### "Install" as an app (PWA)

Works with methods **A** (internet), **C** and **D** (local server).
**Doesn't work** with method **B** (`file://`).

1. Open the app in the browser
2. Your browser will show an install icon (a square with an arrow in
   Chrome/Edge, or a share icon in Safari)
3. Click **«Install»** or **«Add to Home Screen»**
4. A new icon appears on your desktop / start menu that opens
   Routime like a native app

---

### Troubleshooting local installation

| Symptom | Likely cause | Fix |
|---|---|---|
| Double-click on `index.html` and the page is blank | Browser is opening from a weird path | Open `site/index.html` directly |
| "Can't load `manifest.json`" or icons missing | Files were moved | Make sure `index.html`, `site/`, `tools/`, `assets/`, `manifest.json` are all in the **same root folder** |
| TTS voices don't play on `file://` | Some browsers disable TTS on `file://` for security | Use method C or D (local server) |
| Service Worker won't register | You're on `file://` | That's expected. Use method C or D |
| `python: command not found` | Python isn't installed | Use method D (Node), or install Python |
| Port 8080 is already in use | Another app is using that port | Change the port: `python -m http.server 9000` and open `http://localhost:9000/site/index.html` |
| I want to share the app with other devices on my network | Same Wi-Fi | Find your local IP (`ipconfig` on Windows, `ifconfig` on Mac/Linux) and visit `http://YOUR-IP:8080/site/index.html` from another device |

### Where is my progress saved?

In your browser's **`localStorage`** (the browser's internal storage,
not on disk). This means:

- ✅ **Private**: it never leaves your computer
- ✅ **No account**: no sign-up needed
- ⚠️ **Per browser**: switching browsers or devices doesn't transfer
  progress
- ⚠️ **If you clear browser data**, you'll lose stars and levels

You can view and delete your progress from the hidden
[`config/`](../../config/index.html) menu.

---

## 2. The main screen

When you enter the app, you see a screen with **6 colored boxes**. Each box is a **module** with different activities.

```
┌─────────────────────────────────────────────────────────────┐
│  🇪🇸 Español    🇬🇧 English                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎯 AIMING AND HANDS                                  │   │
│  │ Coordination and motor skills                        │   │
│  │ [Catch] [Tracing] [Coloring]...                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📋 MY DAILY ROUTINE                                 │   │
│  │ Autonomy and home                                    │   │
│  │ [Routines] [The House] [Emergencies] [Shopping]...  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... more modules ...                                       │
│                                                             │
│  ⭐ Your stars: 12                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Choosing an activity

1. **Tap the module** you're interested in
2. **Tap the activity** you want to do
3. Done! The activity opens

---

## 4. Buttons in each activity

Most activities have these elements:

| Button | What it's for |
|--------|---------------|
| **🔊 Listen** | Hear the text read aloud |
| **← Back** | Return to the modules menu |
| **Play again** | Repeat the activity |

### In activities with levels

Some activities have **levels** (easier → harder):

```
┌─────────────────────────────┐
│      CHOOSE THE LEVEL       │
│                             │
│  Level 1: Easy             │
│  ─────────────────────────  │
│  Level 2: Medium           │
│  ─────────────────────────  │
│  Level 3: Hard             │
│                             │
└─────────────────────────────┘
```

---

## 5. How audio works

You'll see a **🔊** button **only** in activities where audio is
useful — for example, hearing what you type on the keyboard or
listening to a sequence.

**To listen:**
1. Tap the 🔊 button
2. Listen to the voice
3. If the voice is speaking, you can tap it again to stop

---

## 6. Response messages

When you do something in the app, you may see messages:

### ✅ When you get it right
A green or yellow message appears with phrases like:
- "Well done!"
- "Great!"
- "Perfect!"

### 🔶 When it's not correct
A blue message appears (never red) with phrases like:
- "Almost. Try again!"
- "Think a bit more"
- "Look again"

An "error" or "failure" message never appears.

---

## 7. Earning stars

When you complete activities, you can earn **stars** ⭐.

Stars are saved automatically. You can see how many you have on the main screen.

---

## 8. Changing language

At the top right there are two buttons:

```
[🇪🇸 Español]  [🇬🇧 English]
```

Tap the language you want. The page will reload in that language.

---

## 9. Personal settings

Tap the **settings** button (⚙️) if you want to:

- Change text size (bigger or smaller)
- Turn sounds on or off
- See your progress in each activity
- Delete your saved progress

> **Note**: The settings button is hidden. To find it, type
> `/ajustes` at the end of the web address.

---

## 10. Install the app on mobile

You can have Routime as if it were an app on your phone:

**On Android (Chrome):**
1. Open the website
2. Tap the three dots (⋮)
3. Select "Add to Home screen"

**On iPhone (Safari):**
1. Open the website
2. Tap the share button (□↑)
3. Select "Add to Home screen"

> 💡 After installing, **it works without internet** (the files are
> stored on the phone thanks to the Service Worker).

---

## 11. Troubleshooting

### The app doesn't load
- Check your internet connection
- Close the browser and open it again

### Audio doesn't play
- Check that your device's volume is on
- Check that the browser has permission to play sound

### Progress doesn't save
- Check that you have space in the browser
- Try using another browser (Chrome or Firefox)

### Other problems
- Close all Routime tabs
- Open the app again

---

## 12. More help

If you need more information:

- [Activity catalog](activities.md) — Complete list of activities
- [Technical information](technical.md) — For developers and professionals
- [Team page](../team/index.html) — Guide for families and professionals

---

## 13. Quick summary

| What I want to do | How to do it |
|-------------------|--------------|
| Choose an activity | Tap a module → tap an activity |
| Listen to a text | Tap the 🔊 button |
| Change language | Tap 🇪🇸 or 🇬🇧 at the top |
| See my progress | Look at the stars ⭐ in the menu |
| Repeat an activity | Tap "Play again" |
| Return to menu | Tap "← Back" |
| Open the app with no setup | Visit [routime.apptonomia.uk](https://routime.apptonomia.uk) |
| Use it on my own computer | Download the ZIP from GitHub and open `site/index.html` |
| Full experience (PWA, offline) | `python -m http.server 8080` and open `http://localhost:8080/site/index.html` |

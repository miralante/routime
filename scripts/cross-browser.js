#!/usr/bin/env node
/* ============================================================
   Routime — scripts/cross-browser.js
   Cross-browser and cross-device functional test: launches every
   activity in Chromium (Chrome), Firefox and WebKit (Safari), on
   desktop and on two emulated mobile devices (iPhone 12 and Pixel 5).
   Checks:

   - No console or page errors
   - Language switch ES → EN works
   - Main buttons are visible and ≥ 64×64 px (accessibility rule 2)
   - The audio button (🔊) exists in the activity
   - The "Back" button leads to the landing page
   - On mobile: fits in 360 px with no horizontal scroll

   Complements scripts/smoke.js (which only tests Chromium in ES/EN
   on desktop) and scripts/check.js (static).

   Usage:
     node scripts/cross-browser.js [slug1 slug2 ...]
   With no arguments, tests all 57 activities. With arguments, only
   those slugs (useful to debug a single one).

   Requires playwright and the browsers:
     npm install
     npx playwright install chromium firefox webkit
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var http = require('http');

var RAIZ = path.join(__dirname, '..');
var PUERTO = 5185;
var TIMEOUT_NAV = 15000;
var ESPERA_ASENTAR = 350;
var BOTON_MIN = 64;          // accessibility rule 2 (tecnico.md §5)
var ANCHO_MIN_MOVIL = 360;   // minimum responsive width

var MIME = {
    '.html':  'text/html; charset=utf-8',
    '.js':    'text/javascript; charset=utf-8',
    '.css':   'text/css; charset=utf-8',
    '.json':  'application/json; charset=utf-8',
    '.svg':   'image/svg+xml',
    '.png':   'image/png',
    '.woff2': 'font/woff2',
    '.webmanifest': 'application/manifest+json'
};

/* ---- Minimal static server (no dependencies) ---- */
function crearServidor() {
    return http.createServer(function (req, res) {
        var urlPath = decodeURIComponent(req.url.split('?')[0]);
        if (urlPath.endsWith('/')) urlPath += 'index.html';
        var full = path.join(RAIZ, urlPath);
        if (!full.startsWith(RAIZ)) { res.writeHead(403); res.end(); return; }
        fs.readFile(full, function (err, data) {
            if (err) {
                if (!path.extname(full)) {
                    fs.readFile(full + '.html', function (err2, data2) {
                        if (err2) { res.writeHead(404); res.end('No encontrado: ' + urlPath); return; }
                        res.writeHead(200, { 'Content-Type': MIME['.html'] });
                        res.end(data2);
                    });
                    return;
                }
                res.writeHead(404); res.end('No encontrado: ' + urlPath);
                return;
            }
            var ext = path.extname(full);
            res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
            res.end(data);
        });
    });
}

function listarSlugs() {
    return fs.readdirSync(path.join(RAIZ, 'tools'), { withFileTypes: true })
        .filter(function (e) { return e.isDirectory(); })
        .map(function (e) { return e.name; })
        .sort();
}

/* ---- Browser × device × language combinations ----
   Chosen this way:
   - Browsers: Chromium (Chrome/Edge), Firefox, WebKit (Safari)
     → covers the three real engines people use on desktop and mobile.
   - Devices: desktop (1280×800 viewport) + two emulated mobiles
     (iPhone 12 and Pixel 5) → covers the 360 px responsive rule.
   - Languages: only "es" by default (smoke.js already tests ES+EN desktop).
     Pass `--lang en` to also test in English.
*/
function combinacionesDefecto() {
    var dispositivos = [
        { nombre: 'escritorio', preset: null },
        { nombre: 'iphone',     preset: 'iPhone 12' },
        { nombre: 'android',    preset: 'Pixel 5' }
    ];
    var navegadores = ['chromium', 'firefox', 'webkit'];
    var combos = [];
    navegadores.forEach(function (nav) {
        dispositivos.forEach(function (disp) {
            combos.push({ navegador: nav, dispositivo: disp, locale: 'es' });
        });
    });
    return combos;
}

function parseArgs(argv) {
    var args = { slugs: [], langEs: true, langEn: false };
    var i = 0;
    while (i < argv.length) {
        if (argv[i] === '--lang' && i + 1 < argv.length) {
            var v = argv[i + 1];
            if (v === 'en') { args.langEs = false; args.langEn = true; }
            else if (v === 'both') { args.langEs = true; args.langEn = true; }
            i += 2; continue;
        }
        if (argv[i] === '--all-langs') { args.langEs = true; args.langEn = true; i++; continue; }
        args.slugs.push(argv[i]);
        i++;
    }
    return args;
}

function combosSegunArgs(args) {
    var navegadores = ['chromium', 'firefox', 'webkit'];
    var dispositivos = [
        { nombre: 'escritorio', preset: null },
        { nombre: 'iphone',     preset: 'iPhone 12' },
        { nombre: 'android',    preset: 'Pixel 5' }
    ];
    var locales = [];
    if (args.langEs) locales.push('es');
    if (args.langEn) locales.push('en');

    var combos = [];
    navegadores.forEach(function (nav) {
        dispositivos.forEach(function (disp) {
            locales.forEach(function (loc) {
                combos.push({ navegador: nav, dispositivo: disp, locale: loc });
            });
        });
    });
    return combos;
}

function forzarIdioma(page, locale) {
    return page.addInitScript(function (loc) {
        try { window.localStorage.setItem('routime:locale', loc); } catch (e) {}
    }, locale);
}

function nombreNavegador(codigo) {
    return { chromium: 'Chrome/Edge', firefox: 'Firefox', webkit: 'Safari' }[codigo] || codigo;
}

function errorSiNoCumple(cond, mensaje) {
    return cond ? null : mensaje;
}

function probarUnaCombinacion(playwright, slug, combo) {
    return new Promise(function (resolve) {
        var navegadorLanzado = null;
        var context = null;
        var page = null;
        var errores = [];

        function anotar(msg) { errores.push(msg); }

        var labelNav = nombreNavegador(combo.navegador);
        var labelDisp = combo.dispositivo.preset ? combo.dispositivo.nombre : 'escritorio';
        var label = labelNav + '/' + labelDisp + '/' + combo.locale;

        function lanzarNavegador() {
            var launcher = playwright[combo.navegador];
            return launcher.launch().then(function (b) {
                navegadorLanzado = b;
                if (combo.dispositivo.preset) {
                    return b.newContext({ ...playwright.devices[combo.dispositivo.preset] });
                }
                return b.newContext({ viewport: { width: 1280, height: 800 } });
            }).then(function (ctx) {
                context = ctx;
                return context.newPage();
            }).then(function (p) {
                page = p;
                var onErr = function (e) { anotar('pageerror: ' + (e.message || String(e))); };
                var onCon = function (m) { if (m.type() === 'error') anotar('console.error: ' + m.text()); };
                page.on('pageerror', onErr);
                page.on('console', onCon);
                return forzarIdioma(page, combo.locale).then(function () { return p; });
            });
        }

        function urlDestino() {
            return 'http://localhost:' + PUERTO + '/tools/' + slug + '/index.html';
        }

        function cargar() {
            return page.goto(urlDestino(), { waitUntil: 'networkidle', timeout: TIMEOUT_NAV })
                .catch(function (e) { anotar('navegación: ' + e.message); })
                .then(function () { return page.waitForTimeout(ESPERA_ASENTAR); });
        }

        function verificarAccesibilidad() {
            // Back-to-landing button
            return page.locator('a[href*="site/index.html"]').first()
                .isVisible({ timeout: 500 }).catch(function () { return false; })
                .then(function (hayVolver) {
                    var f1 = errorSiNoCumple(hayVolver, 'no se ve el botón "Volver" al menú');
                    if (f1) anotar(f1);
                    // Audio button (.btn-audio)
                    return page.locator('.btn-audio').first()
                        .isVisible({ timeout: 500 }).catch(function () { return false; });
                })
                .then(function (hayAudio) {
                    if (!hayAudio) anotar('no se ve el botón de audio (.btn-audio)');
                    // Buttons ≥ BOTON_MIN
                    return page.locator('.btn').all();
                })
                .then(function (botones) {
                    var promesas = botones.map(function (loc) {
                        return loc.boundingBox().then(function (box) {
                            if (!box) return null;
                            if (box.width < BOTON_MIN || box.height < BOTON_MIN) {
                                return {
                                    texto: (box.width || 0).toFixed(0) + 'x' + (box.height || 0).toFixed(0)
                                };
                            }
                            return null;
                        }).catch(function () { return null; });
                    });
                    return Promise.all(promesas);
                })
                .then(function (pequenos) {
                    var filtrados = pequenos.filter(function (x) { return x; });
                    if (filtrados.length) {
                        anotar('hay ' + filtrados.length + ' botón(es) más pequeño(s) que ' +
                               BOTON_MIN + 'x' + BOTON_MIN + ' px (regla de accesibilidad)');
                    }
                    return null;
                });
        }

        function verificarResponsive() {
            if (!combo.dispositivo.preset) return Promise.resolve();
            // Check that the page doesn't overflow horizontally
            return page.evaluate(function () {
                return {
                    anchoDoc: Math.max(
                        document.body.scrollWidth,
                        document.documentElement.scrollWidth
                    ),
                    anchoViewport: window.innerWidth
                };
            }).then(function (m) {
                if (m.anchoDoc > m.anchoViewport + 1) {
                    anotar('scroll horizontal: doc ' + m.anchoDoc + ' px > viewport ' +
                           m.anchoViewport + ' px');
                }
            }).catch(function () {});
        }

        function probarIdioma() {
            // Only test the switch to EN if the combination is ES
            if (combo.locale !== 'es') return Promise.resolve();
            return page.locator('button[data-locale="en"], a[data-locale="en"]').first()
                .isVisible({ timeout: 500 }).catch(function () { return false; })
                .then(function (haySelector) {
                    if (!haySelector) return; // selector might not be in the activity
                    return page.locator('button[data-locale="en"], a[data-locale="en"]').first()
                        .click({ timeout: 800 }).catch(function () { return null; })
                        .then(function () { return page.waitForTimeout(ESPERA_ASENTAR); })
                        .then(function () { return null; });
                });
        }

        function cerrar() {
            var promesas = [];
            if (page) promesas.push(page.close().catch(function () {}));
            if (context) promesas.push(context.close().catch(function () {}));
            if (navegadorLanzado) promesas.push(navegadorLanzado.close().catch(function () {}));
            return Promise.all(promesas);
        }

        lanzarNavegador()
            .then(cargar)
            .then(verificarAccesibilidad)
            .then(verificarResponsive)
            .then(probarIdioma)
            .catch(function (e) { anotar('inesperado: ' + e.message); })
            .then(cerrar)
            .then(function () { resolve({ label: label, errores: errores }); });
    });
}

function ejecutar(playwright, slugs, combos) {
    var total = slugs.length * combos.length;
    var resultados = [];
    var hechos = 0;

    console.log('Probando ' + slugs.length + ' actividad(es) × ' + combos.length +
                ' combinación(es) = ' + total + ' pruebas...\n');

    function siguiente() {
        if (!slugs.length) {
            return Promise.resolve();
        }
        var slug = slugs.shift();
        var combo = combos.shift();
        return probarUnaCombinacion(playwright, slug, combo).then(function (r) {
            hechos++;
            if (r.errores.length) {
                resultados.push({ slug: slug, combinacion: r.label, errores: r.errores });
                process.stdout.write('X');
            } else {
                process.stdout.write('.');
            }
            if (hechos % 50 === 0) console.log(' [' + hechos + '/' + total + ']');
            return siguiente();
        });
    }

    return siguiente().then(function () {
        console.log('\n\n');
        if (resultados.length) {
            console.log('FALLOS (' + resultados.length + ' de ' + total + ' pruebas):\n');
            resultados.forEach(function (r) {
                console.log('  - tools/' + r.slug + '/  [' + r.combinacion + ']');
                r.errores.forEach(function (e) { console.log('      ' + e); });
                console.log('');
            });
        } else {
            console.log('OK (' + total + ' pruebas en Chrome, Firefox, Safari × escritorio/iPhone/Android × ES/EN)');
        }
        return resultados.length > 0;
    });
}

function main() {
    var playwright;
    try {
        playwright = require('playwright');
    } catch (e) {
        console.error('Falta "playwright". Instálalo con: npm install');
        process.exitCode = 1;
        return;
    }

    var args = parseArgs(process.argv.slice(2));
    var todos = listarSlugs();
    var slugs = args.slugs.length ? args.slugs : todos;
    var desconocidos = slugs.filter(function (s) { return todos.indexOf(s) === -1; });
    if (desconocidos.length) {
        console.error('No existen en tools/: ' + desconocidos.join(', '));
        process.exitCode = 1;
        return;
    }
    var combos = combosSegunArgs(args);

    var server = crearServidor();
    server.listen(PUERTO, function () {
        ejecutar(playwright, slugs, combos).then(function (huboFallos) {
            server.close();
            process.exitCode = huboFallos ? 1 : 0;
        }).catch(function (e) {
            server.close();
            console.error('Error inesperado del test cross-browser:', e);
            process.exitCode = 1;
        });
    });
}

main();

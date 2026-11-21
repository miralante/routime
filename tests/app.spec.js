/*
 * tests/app.spec.js — the flows of Routime itself.
 *
 * The shared smoke (tests/smoke.spec.js) checks the contract every app of the
 * suite promises: the chrome, the settings drawer and the 404 page. This file
 * checks what makes Routime Routime: the menu of activities, the settings page
 * of the person who manages the device (preferences, backup, resets) and two
 * representative activities — a round of "Categorías" and the Socratic pause of
 * "Chat Seguro".
 *
 * Every test starts from a clean context: Playwright gives each test its own
 * browser context, so the progress that Routime keeps in localStorage never
 * leaks from one test into the next and the order of the tests does not
 * matter. The tests that need a saved state plant it themselves.
 */
'use strict';

const { test, expect } = require('./playwright.js');

/* Routime is a Spanish-first app and several checks read the text of the
   page, so the browser language is pinned: the app detects it and loads that
   locale. Without this the suite would run in English on a machine set to
   English and in Spanish on another one. */
test.use({ locale: 'es-ES' });

const NAV_TIMEOUT = 30000;

/* Fails the test on any console error or uncaught exception of the page. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  return errors;
}

/* Reads a CSS custom property of the document element. */
function readVariable(page, name) {
  return page.evaluate(
    (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
    name
  );
}

test('the home offers the activity modules and the footer links to About and Legal',
  async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('./');

    // The menu is the heart of the app: the modules of activities must be on
    // screen, with their cards inside.
    await expect(page.locator('#mod-secuencia')).toBeVisible();
    await expect(page.locator('#mod-secuencia .tarjeta').first()).toBeVisible();
    await expect(page.locator('.modulo .tarjeta')).not.toHaveCount(0);

    /* The shared footer carries the legal pages and nothing else. The
       reader's settings — the data reset included — live in the ⚙️ drawer,
       so there is only ONE place to change them: the footer does not repeat
       the link to config/ (the settings page itself stays in place, with
       its own preferences and backup). */
    const links = page.locator('footer[data-suite-footer] a');
    await expect(links.first()).toBeVisible();
    const hrefs = await links.evaluateAll((nodes) => nodes.map((a) => a.getAttribute('href')));
    expect(hrefs[0]).toMatch(/about\/$/);
    expect(hrefs[1]).toMatch(/legal\/$/);
    expect(hrefs.some((href) => /config\/$/.test(href || ''))).toBe(false);

    expect(errors).toEqual([]);
  });

test('the settings page applies the font size and keeps it after a reload',
  async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('./config/');

    await page.locator('#selectorTamano [data-valor="muygrande"]').click();

    // The preference must be VISIBLE, not only stored: the scale of the text
    // is what the person notices.
    await expect.poll(() => readVariable(page, '--escala-texto')).toBe('1.3');
    const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('routime:prefs')));
    expect(prefs.tamanoLetra).toBe('muygrande');

    // And it must survive a reload, because the preference is read from
    // localStorage when the app boots.
    await page.reload();
    await expect.poll(() => readVariable(page, '--escala-texto')).toBe('1.3');

    expect(errors).toEqual([]);
  });

test('the settings page saves the personal data and offers a backup file',
  async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('./config/');

    await page.locator('#inputOwnAddress').fill('Calle de prueba 12');
    await page.locator('#btnSaveMyDetails').click();
    await expect(page.locator('#feedbackMyDetails')).not.toBeEmpty();

    // "Mis Datos" feeds the activity of the same name, so the address has to
    // be in the storage of the app.
    const details = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('routime:my-details') || '{}'));
    expect(details.ownAddress).toBe('Calle de prueba 12');

    // The backup is the only way to keep the progress when the browser is
    // cleaned: it must be a JSON file with the progress inside.
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#btnExportar').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Routime-progress.json');

    expect(errors).toEqual([]);
  });

test('resetting the person keeps the progress and resetting the app wipes it',
  async ({ page }) => {
    // The saved state is planted before the page boots, the way a person who
    // has used the app for a while would have it.
    await page.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('routime:pairs', JSON.stringify({ stars: 4 }));
      localStorage.setItem('routime:my-details', JSON.stringify({ ownAddress: 'Calle de prueba 12' }));
    });
    await page.goto('./config/');

    // Both resets ask twice: the first tap asks to confirm, the second one
    // does the job.
    await page.locator('#btnResetPersona').click();
    await page.locator('#btnResetPersona').click();
    await expect(page.locator('#feedbackPersona')).not.toBeEmpty();

    const afterPerson = await page.evaluate(() => ({
      pairs: localStorage.getItem('routime:pairs'),
      address: JSON.parse(localStorage.getItem('routime:my-details') || '{}').ownAddress || '',
    }));
    // The progress of the activities is NOT touched by this reset...
    expect(afterPerson.pairs).toBe(JSON.stringify({ stars: 4 }));
    // ...but the personal data is.
    expect(afterPerson.address).toBe('');

    await page.locator('#btnResetApp').click();
    await page.locator('#btnResetApp').click();
    await expect(page.locator('#feedbackApp')).not.toBeEmpty();

    // The whole app is back to its first day: no key of the app is left.
    const remaining = await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('routime:')));
    expect(remaining).toEqual([]);
  });

test('an activity plays a round and saves the star it wins', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./tools/categories/');

  // The round starts on its own: the word and its boxes are on screen.
  await expect(page.locator('#gameScreen')).toBeVisible();
  await expect(page.locator('#categoriaPrompt')).not.toBeEmpty();
  const boxes = page.locator('#options .caja');
  await expect(boxes.first()).toBeVisible();
  expect(await boxes.count()).toBeGreaterThan(1);

  // The data of the app says which box belongs to the word on screen, so the
  // test answers correctly instead of guessing.
  const categoria = await page.evaluate(() => {
    const data = DATA[App.i18n.locale()] || DATA.es;
    const prompt = (document.querySelector('#categoriaPrompt').textContent || '').trim();
    const levelName = (document.querySelector('#level').textContent || '').trim();
    const level = data.niveles.find((l) => l.name === levelName) || data.niveles[0];
    const item = level.items.find((i) => prompt.indexOf(i.palabra) !== -1);
    return item ? item.categoria : '';
  });
  expect(categoria).not.toBe('');

  await page.locator('#options').getByRole('button', { name: categoria, exact: true }).click();

  // A right answer is never punished and never silent: it is praised and the
  // round offers the next word.
  await expect(page.locator('#feedback')).not.toBeEmpty();
  await expect(page.locator('#btnNext')).toBeVisible();

  // The star won is kept in the browser, so the person finds it next time.
  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('routime:categorias') || '{}'));
  expect(progress.stars).toBeGreaterThan(0);

  expect(errors).toEqual([]);
});

test('the safe chat explains the mistake and waits for "Entendido"', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./tools/safe-chat/');

  const cards = page.locator('#listaChats .tarjeta-chat');
  await expect(cards.first()).toBeVisible();
  await cards.first().click();
  await expect(page.locator('#pantallaChat')).toBeVisible();

  // A scenario may open with a message or with an action ("block the
  // contact"): the loop presses what has to be pressed until the scenario
  // offers its replies.
  for (let round = 0; round < 8; round += 1) {
    const replies = page.locator('#chatOpciones .btn-opcion');
    if (await replies.count() > 0 && await replies.first().isVisible()) break;
    const action = page.locator('#chatOpciones button.btn-block');
    if (await action.count() > 0 && await action.first().isVisible()) {
      await action.first().click();
      // The chat moves on by itself; the button goes with the step.
      await expect(action.first()).toBeHidden({ timeout: NAV_TIMEOUT });
      continue;
    }
    // The messages of the scenario arrive one by one.
    await page.waitForTimeout(300);
  }
  const replies = page.locator('#chatOpciones .btn-opcion');
  await expect(replies.first()).toBeVisible({ timeout: NAV_TIMEOUT });

  // The data of the app says which reply of this step is the risky one.
  const risky = await page.evaluate(() => {
    if (typeof DATA === 'undefined') return '';
    const data = DATA[App.i18n.locale()] || DATA.es;
    const alias = (document.querySelector('#chatAlias').textContent || '').trim();
    const group = data.escenarios.find((item) => item.variantes.some((v) => v.contacto === alias));
    const variant = group && group.variantes.find((v) => v.contacto === alias);
    if (!variant) return '';
    const bubbles = document.querySelectorAll('#chatMensajes .burbuja.ellos');
    const last = bubbles.length ? (bubbles[bubbles.length - 1].textContent || '').trim() : '';
    let index = -1;
    variant.steps.forEach((step, i) => {
      if (step.tipo === 'msg' && (step.text || '').trim() === last) index = i;
    });
    const step = variant.steps.slice(index + 1).find((s) => s.tipo === 'eleccion');
    const wrong = step && step.options.find((option) => !option.segura);
    return wrong ? wrong.text : '';
  });
  expect(risky).not.toBe('');

  const riskyButton = page.locator('#chatOpciones').getByRole('button', { name: risky, exact: true });
  await riskyButton.click();

  // The mistake is never punished: it is explained and the round waits.
  await expect(page.locator('#consejo')).toBeVisible();
  await expect(page.locator('#consejoTexto')).not.toBeEmpty();
  // While the hint is on screen the answers are hidden: the pause is the rule.
  await expect(page.locator('#chatOpciones .btn-opcion:visible')).toHaveCount(0);

  await page.locator('#consejo .btn-entendido').click();
  await expect(page.locator('#consejo')).toBeHidden();
  expect(await page.locator('#chatOpciones .btn-opcion:visible').count()).toBeGreaterThan(0);
  // The reply that was already tried stays blocked, so the person does not
  // fall again in the same mistake.
  await expect(riskyButton).toBeDisabled();

  expect(errors).toEqual([]);
});

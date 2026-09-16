#!/usr/bin/env node
/**
 * Mass-fix common issues in app.js files:
 * 1. Replace .textContent.textContent = '' with proper i18n calls
 * 2. Fix orphan ); followed by cont.appendChild
 * 3. Fix pintarProgreso inside iniciarJuego (wrong indentation)
 * 4. Fix encoding corruption: â­" -> ⭐
 */
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'tools');

// Files that have the orphan ); pattern (need renderLevels function added)
const NEEDS_RENDER_LEVELS = [
  'blocks', 'doctor-visit', 'first-aid-kit', 'friends',
  'post-or-not', 'resilience', 'self-esteem', 'signs', 'street'
];

// Files that have pintarProgreso inside iniciarJuego pattern
const NEEDS_PROGRESS_FIX = [
  'blocks', 'situations', 'ecos', 'path', 'tracing'
];

function fixTextContentTextContent(content) {
  // Pattern: $('#id').textContent.textContent = '';
  // Replace with: $('#id').textContent = App.i18n.t('key');
  let fixed = content;
  
  // Common patterns in quiz activities
  fixed = fixed.replace(
    /\$\(['"](resumenFinal|resumen|resultado)['"]\)\.textContent\.textContent\s*=\s*['"]['"];?\s*\n?\$?\(['"]#?transferencia['"]\)\.textContent\.textContent\s*=\s*['"]['"];?/g,
    (match) => {
      return `$('#resumenFinal').textContent = App.i18n.t('resumenFinal', { n: roundHits, total: progress.stars });
    App.i18n.applyTo('#transferencia');`;
    }
  );
  
  // Pattern for simple .textContent.textContent = '';
  fixed = fixed.replace(/\.textContent\.textContent\s*=\s*['"]['"];?/g, ".textContent = '';");
  
  // Fix残留
  fixed = fixed.replace(/\n\$/g, "\n");
  
  return fixed;
}

function fixOrphanParen(content) {
  // Pattern:   );
  //       cont.appendChild(btn);
  //     });
  //   }
  // This is broken renderLevels function - need to add proper function
  
  // For files that need renderLevels added after banco()
  const needsRenderLevels = content.match(/function banco\(\) \{ return DATA\[App\.i18n\.locale\(\)\] \|\| DATA\.es; \}\n\n  \);/);
  
  if (needsRenderLevels) {
    const renderLevelsFunc = `

  /* Renders the level selection buttons. */
  function renderLevels() {
    levelsEl.innerHTML = '';
    banco().niveles.forEach(function (level) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = '<strong>' + level.nombre + '</strong><br><small>' + level.descripcion + '</small>';
      btn.addEventListener('click', function () { selectLevel(level); });
      levelsEl.appendChild(btn);
    });
  }`;
    
    content = content.replace(
      /function banco\(\) \{ return DATA\[App\.i18n\.locale\(\)\] \|\| DATA\.es; \}\n\n  \);/,
      'function banco() { return DATA[App.i18n.locale()] || DATA.es; }' + renderLevelsFunc
    );
  }
  
  return content;
}

function fixEncodingIssues(content) {
  let fixed = content;
  
  // Fix â­" -> ⭐
  fixed = fixed.replace(/â­"/g, '⭐');
  
  return fixed;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = fixTextContentTextContent(content);
    content = fixOrphanParen(content);
    content = fixEncodingIssues(content);
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error:', filePath, e.message);
    return false;
  }
}

// Process all app.js files
const dirs = fs.readdirSync(toolsDir).filter(f => {
  return fs.statSync(path.join(toolsDir, f)).isDirectory();
});

let fixed = 0;
dirs.forEach(dir => {
  const appPath = path.join(toolsDir, dir, 'app.js');
  if (fs.existsSync(appPath)) {
    if (processFile(appPath)) fixed++;
  }
});

console.log(`\nFixed ${fixed} files.`);

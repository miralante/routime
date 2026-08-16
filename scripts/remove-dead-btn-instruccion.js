const fs = require('fs');
const path = require('path');
const root = path.join('c:', 'apps', 'onedrive', 'jrodriguezgar', 'OneDrive', 'dev', 'Routime');
const reNoOp = /\$\('#btnInstruccion'\)\.addEventListener\('click', function \(\) \{\}\);/;
const dir = path.join(root, 'tools');
const tools = fs.readdirSync(dir).filter(name => fs.existsSync(path.join(dir, name, 'app.js')));
for (const tool of tools) {
  const appPath = path.join(dir, tool, 'app.js');
  const indexPath = path.join(dir, tool, 'index.html');
  const appCode = fs.readFileSync(appPath, 'utf8');
  if (!reNoOp.test(appCode)) continue;
  const newAppCode = appCode
    .split(/\r?\n/)
    .filter(line => line.trim() !== "$('#btnInstruccion').addEventListener('click', function () {});")
    .join('\n') + '\n';
  fs.writeFileSync(appPath, newAppCode, 'utf8');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    const newHtml = html
      .split(/\r?\n/)
      .filter(line => !line.includes('id="btnInstruccion"'))
      .join('\n') + '\n';
    fs.writeFileSync(indexPath, newHtml, 'utf8');
  }
  console.log('cleaned', tool);
}

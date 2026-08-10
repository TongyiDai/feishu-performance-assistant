#!/usr/bin/env bash
set -euo pipefail

node - <<'NODE'
const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('manifest_version must be 3');
for (const file of ['content.js', 'panel.js', 'service-worker.js', 'panel.html', 'logo.png', 'welcome.png']) {
  if (!fs.existsSync(file)) throw new Error(`missing referenced file: ${file}`);
}
for (const file of ['content.js', 'panel.js', 'service-worker.js']) {
  require('child_process').execFileSync(process.execPath, ['--check', file], {stdio: 'inherit'});
}
console.log(`Validated Manifest V3 extension ${manifest.version}`);
NODE

scan_file=$(mktemp)
trap 'rm -f "$scan_file"' EXIT
if rg -n -i 'gh[pousr]_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,}|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY' . --glob '!welcome.png' --glob '!logo.png' --glob '!scripts/validate.sh' >"$scan_file"; then
  echo 'Potential credential found:' >&2
  cat "$scan_file" >&2
  exit 1
fi

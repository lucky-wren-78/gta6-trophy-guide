// gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The guide itself is plain static files in app/: index.html opens in a
// browser, app.js fetches app/data/trophies.json, nothing is built and
// nothing is loaded over the network. This program is only the handover:
// it copies app/ and screenshots/ from beside this file into the output
// directory and writes dossier.json there, using the vendored make.fun
// library to build the dossier. vendor/makefun-frontend.ts must stay
// exactly as the kit shipped it — the scorer rebuilds the dossier with
// its own copy and compares the two byte for byte.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's gate: at most 4 screenshots of 256 KiB,
// at most 993 files / 48 MiB under app/, and the dossier text capped at
// 160 KiB. An entry past those limits is refused here first, not silently
// handed in broken.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

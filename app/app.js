// Leonida Trophy Guide: checklist tracker for the 55 official GTA VI trophies.
// Progress lives in localStorage, can be exported to a JSON file and imported
// back. Filters, search, spoiler-safe mode and deep links (?view=, ?filter=,
// ?open=<id>, ?spoiler=on, ?checked=<ids>) make each screenshot state shareable.
const KEY = 'gta6-trophy-guide-progress-v1';
const params = new URLSearchParams(location.search);

const listEl = document.getElementById('trophyList');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const spoilerEl = document.getElementById('spoilerToggle');
const earnedOnlyEl = document.getElementById('earnedOnly');
const countLine = document.getElementById('countLine');
const platinumLine = document.getElementById('platinumLine');
const gradeLine = document.getElementById('gradeLine');
const fillEl = document.getElementById('fill');
const barEl = document.getElementById('bar');
const resultCount = document.getElementById('resultCount');
const emptyMsg = document.getElementById('emptyMsg');
const onlineNote = document.getElementById('onlineNote');
const spoilerNote = document.getElementById('spoilerNote');
const detailPanel = document.getElementById('detailPanel');
const detailBody = document.getElementById('detailBody');

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  if (Array.isArray(saved)) earned = new Set(saved.filter((n) => typeof n === 'string'));
} catch { earned = new Set(); }

// Deep links set the initial state (used for screenshots and sharing a view).
if (params.get('checked')) {
  for (const raw of params.get('checked').split(',')) {
    const id = Number(raw.trim());
    const t = trophies.find((x) => x.id === id);
    if (t) earned.add(t.name);
  }
}
if (params.get('filter')) {
  const f = params.get('filter');
  if (['story', 'missable', 'collectibles', 'activities', 'online'].includes(f)) kindEl.value = f;
}
if (params.get('grade')) {
  const g = params.get('grade');
  if (['platinum', 'gold', 'silver', 'bronze'].includes(g)) gradeEl.value = g;
}
if (params.get('search')) searchEl.value = params.get('search');
if (params.get('spoiler') === 'on') spoilerEl.checked = true;
if (params.get('view') === 'roadmap') showView('roadmap');

function saveProgress() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function isHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = 'badge ' + cls;
  s.textContent = text;
  return s;
}

function openDetail(t) {
  detailBody.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = isHidden(t) ? 'Hidden trophy' : t.name;
  detailBody.append(h);
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(badge(t.grade, t.grade), badge(t.kind, 'kind'));
  if (t.missable) meta.append(badge('Missable', 'missable'));
  if (t.count) meta.append(badge('Count: ' + t.count, ''));
  detailBody.append(meta);
  const d = document.createElement('p');
  d.className = 'desc';
  d.textContent = isHidden(t) ? 'Hidden trophy — earn it to reveal.' : 'Official description: “' + t.description + '”';
  detailBody.append(d);
  const gh = document.createElement('h4');
  gh.textContent = 'Guide';
  detailBody.append(gh);
  const g = document.createElement('p');
  g.textContent = isHidden(t) ? 'Hidden until this trophy is earned — tick it off to reveal the guide.' : t.guide;
  detailBody.append(g);
  const sh = document.createElement('h4');
  sh.textContent = 'Sources';
  detailBody.append(sh);
  const ul = document.createElement('ul');
  for (const s of t.sources || []) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.append(li);
  }
  detailBody.append(ul);
  const eh = document.createElement('h4');
  eh.textContent = 'Status';
  detailBody.append(eh);
  const st = document.createElement('p');
  st.textContent = earned.has(t.name) ? 'Earned — ticked off in your tracker.' : 'Not earned yet.';
  detailBody.append(st);
  detailPanel.hidden = false;
}

document.getElementById('closeDetail').addEventListener('click', () => { detailPanel.hidden = true; });

function renderList() {
  const q = searchEl.value.trim().toLowerCase();
  const kind = kindEl.value;
  const grade = gradeEl.value;
  const shown = trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (q && !t.name.toLowerCase().includes(q)) return false;
    return true;
  });
  onlineNote.hidden = kind !== 'online';
  spoilerNote.hidden = !spoilerEl.checked;
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'card' + (earned.has(t.name) ? ' earned' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveProgress();
      renderAll();
      if (!detailPanel.hidden) openDetail(t);
    });
    const mid = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = isHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = isHidden(t) ? 'Story trophy hidden by spoiler-safe mode.' : t.description;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(badge(t.grade, t.grade), badge(t.kind, 'kind'));
    if (t.missable) meta.append(badge('Missable', 'missable'));
    if (t.count) meta.append(badge('Count: ' + t.count, ''));
    mid.append(h, desc, meta);
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'openBtn';
    open.textContent = 'Guide + sources';
    open.addEventListener('click', () => openDetail(t));
    li.append(box, mid, open);
    listEl.append(li);
  }
  emptyMsg.hidden = shown.length !== 0;
  resultCount.textContent = shown.length + ' of ' + trophies.length + ' shown';
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  countLine.textContent = n + ' / ' + total + ' earned';
  platinumLine.textContent = n === total
    ? 'Platinum earned — Vice Got a Price!'
    : 'Platinum: ' + pct + '% — ' + (total - n) + ' to go';
  const byGrade = {};
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    byGrade[g] = trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
  }
  const totals = {};
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    totals[g] = trophies.filter((t) => t.grade === g).length;
  }
  gradeLine.textContent = 'Platinum ' + byGrade.platinum + '/' + totals.platinum +
    ' · Gold ' + byGrade.gold + '/' + totals.gold +
    ' · Silver ' + byGrade.silver + '/' + totals.silver +
    ' · Bronze ' + byGrade.bronze + '/' + totals.bronze;
  fillEl.style.width = pct + '%';
  barEl.setAttribute('aria-valuenow', String(n));
}

function renderAll() {
  renderList();
  renderProgress();
}

function showView(view) {
  const guide = document.getElementById('guideView');
  const roadmap = document.getElementById('roadmapView');
  const isRoadmap = view === 'roadmap';
  guide.hidden = isRoadmap;
  roadmap.hidden = !isRoadmap;
  document.getElementById('viewGuideBtn').classList.toggle('active', !isRoadmap);
  document.getElementById('viewRoadmapBtn').classList.toggle('active', isRoadmap);
}

document.querySelectorAll('[data-view]').forEach((btn) => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});
for (const el of [searchEl, kindEl, gradeEl, spoilerEl, earnedOnlyEl]) {
  el.addEventListener('input', renderAll);
  el.addEventListener('change', renderAll);
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', earned: [...earned].sort(), exported: new Date().toISOString() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveProgress();
    renderAll();
  } catch {
    resultCount.textContent = 'Import failed: that file is not a progress export from this guide.';
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  earned = new Set();
  saveProgress();
  renderAll();
});

renderAll();
if (params.get('open')) {
  const t = trophies.find((x) => String(x.id) === params.get('open'));
  if (t) openDetail(t);
}

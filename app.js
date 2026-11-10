const VERSION = 'v2.4';
const STORAGE_KEY = 'cash-counter-v2_2';
const DENOMS = [
  { id:'0.5', ore:50, kind:'coin', label:'50 øre', badge:'coin05' },
  { id:'1', ore:100, kind:'coin', label:'1', badge:'coin1' },
  { id:'2', ore:200, kind:'coin', label:'2', badge:'coin2' },
  { id:'5', ore:500, kind:'coin', label:'5', badge:'coin5' },
  { id:'10', ore:1000, kind:'coin', label:'10', badge:'coin10' },
  { id:'20', ore:2000, kind:'coin', label:'20', badge:'coin20' },
  { id:'50', ore:5000, kind:'note', label:'50', badge:'note50' },
  { id:'100', ore:10000, kind:'note', label:'100', badge:'note100' },
  { id:'200', ore:20000, kind:'note', label:'200', badge:'note200' },
  { id:'500', ore:50000, kind:'note', label:'500', badge:'note500' }
];

const state = {
  counts: {},
  selected: DENOMS[0].id,
  mobileView: 'coin'
};

const $ = id => document.getElementById(id);
const byId = new Map(DENOMS.map(d => [d.id, d]));
let toastTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.counts) {
      state.counts = parsed.counts;
      if (parsed.selected && byId.has(parsed.selected)) state.selected = parsed.selected;
      if (parsed.mobileView === 'coin' || parsed.mobileView === 'note') state.mobileView = parsed.mobileView;
    }
  } catch {}
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      counts: state.counts,
      selected: state.selected,
      mobileView: state.mobileView
    }));
  } catch {}
}

function money(ore) {
  return new Intl.NumberFormat('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((ore || 0)/100) + ' kr.';
}

function countFor(id) { return Math.max(0, parseInt(state.counts[id] || 0, 10) || 0); }
function setCount(id, value) { state.counts[id] = Math.max(0, parseInt(value || 0, 10) || 0); }

function subtotal(denom) { return countFor(denom.id) * denom.ore; }
function sum(kind) { return DENOMS.filter(d => !kind || d.kind === kind).reduce((acc,d) => acc + subtotal(d), 0); }

function buildRow(denom) {
  const row = document.createElement('div');
  row.className = 'row';
  row.dataset.id = denom.id;

  const label = document.createElement('div');
  label.className = 'denom-label';
  const badge = document.createElement('span');
  badge.className = `badge ${denom.badge}`;
  badge.textContent = denom.label;
  const suffix = document.createElement('span');
  suffix.textContent = denom.kind === 'coin' ? '' : '';
  label.appendChild(badge);

  const controls = document.createElement('div');
  controls.className = 'controls';
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.className = 'mini';
  minus.textContent = '−';
  minus.addEventListener('click', () => {
    state.selected = denom.id;
    setCount(denom.id, countFor(denom.id) - 1);
    afterChange();
  });
  const input = document.createElement('input');
  input.className = 'qty';
  input.inputMode = 'numeric';
  input.pattern = '[0-9]*';
  input.value = String(countFor(denom.id));
  input.setAttribute('aria-label', `Antal ${denom.label}`);
  input.addEventListener('focus', () => { state.selected = denom.id; refreshSelection(); save(); });
  input.addEventListener('input', e => {
    state.selected = denom.id;
    const digits = String(e.target.value || '').replace(/\D/g,'');
    setCount(denom.id, digits === '' ? 0 : parseInt(digits, 10));
    afterChange(false);
  });
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.className = 'mini';
  plus.textContent = '+';
  plus.addEventListener('click', () => {
    state.selected = denom.id;
    setCount(denom.id, countFor(denom.id) + 1);
    afterChange();
  });
  controls.append(minus, input, plus);

  const sub = document.createElement('div');
  sub.className = 'subtotal';
  sub.textContent = money(subtotal(denom));

  row.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    state.selected = denom.id;
    refreshSelection();
    input.focus();
    save();
  });

  row.append(label, controls, sub);
  return row;
}

function renderRows() {
  const coins = $('coins');
  const notes = $('notes');
  coins.replaceChildren(...DENOMS.filter(d => d.kind === 'coin').map(buildRow));
  notes.replaceChildren(...DENOMS.filter(d => d.kind === 'note').map(buildRow));
}

function refreshSelection() {
  document.querySelectorAll('.row').forEach(row => {
    row.classList.toggle('active', row.dataset.id === state.selected);
  });
}

function renderTotals() {
  $('countTotal').textContent = money(sum());
  $('coinsTotal').textContent = money(sum('coin'));
  $('notesTotal').textContent = money(sum('note'));
  $('coinsSwitchTotal').textContent = money(sum('coin'));
  $('notesSwitchTotal').textContent = money(sum('note'));
}

function refreshRows() {
  document.querySelectorAll('.row').forEach(row => {
    const denom = byId.get(row.dataset.id);
    row.querySelector('.qty').value = String(countFor(denom.id));
    row.querySelector('.subtotal').textContent = money(subtotal(denom));
  });
  refreshSelection();
  renderTotals();
}

function afterChange(showSaved = false) {
  refreshRows();
  save();
  if (showSaved) notify('Opdateret');
}

function cycleNext() {
  const visible = DENOMS.filter(d => window.innerWidth > 700 || d.kind === state.mobileView);
  const idx = visible.findIndex(d => d.id === state.selected);
  const next = visible[(idx + 1 + visible.length) % visible.length];
  state.selected = next.id;
  save();
  refreshSelection();
  const row = document.querySelector(`.row[data-id="${next.id}"] .qty`);
  if (row) row.focus();
}

function keypadPress(key) {
  const current = String(countFor(state.selected));
  if (key === 'clear') {
    setCount(state.selected, 0);
  } else if (key === 'back') {
    const next = current.length > 1 ? current.slice(0, -1) : '0';
    setCount(state.selected, parseInt(next,10) || 0);
  } else {
    const next = current === '0' ? key : `${current}${key}`;
    setCount(state.selected, parseInt(next,10) || 0);
  }
  afterChange();
  const input = document.querySelector(`.row[data-id="${state.selected}"] .qty`);
  if (input) input.focus();
}

function setMobileView(kind) {
  state.mobileView = kind;
  document.querySelectorAll('.category').forEach(btn => {
    const on = btn.dataset.cash === kind;
    btn.classList.toggle('selected', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  $('coinsGroup').classList.toggle('visible', kind === 'coin');
  $('notesGroup').classList.toggle('visible', kind === 'note');
  if (window.innerWidth <= 700) {
    const valid = DENOMS.filter(d => d.kind === kind).map(d => d.id);
    if (!valid.includes(state.selected)) state.selected = valid[0];
  }
  refreshSelection();
  save();
}

function notify(message) {
  const t = $('toast');
  clearTimeout(toastTimer);
  t.textContent = message;
  t.hidden = false;
  t.classList.add('show');
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
    t.hidden = true;
  }, 1800);
}

function resetAll() {
  if (!confirm('Vil du starte forfra?')) return;
  state.counts = {};
  state.selected = DENOMS[0].id;
  save();
  refreshRows();
  notify('Optællingen er nulstillet.');
}

function init() {
  $('appVersion').textContent = VERSION;
  load();
  renderRows();
  setMobileView(state.mobileView);
  refreshRows();

  document.querySelectorAll('.category').forEach(btn => {
    btn.addEventListener('click', () => setMobileView(btn.dataset.cash));
  });
  document.querySelectorAll('.keypad button').forEach(btn => {
    btn.addEventListener('click', () => keypadPress(btn.dataset.key));
  });
  $('nextDenom').addEventListener('click', cycleNext);
  $('resetCount').addEventListener('click', resetAll);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      $('coinsGroup').classList.add('visible');
      $('notesGroup').classList.add('visible');
    } else {
      setMobileView(state.mobileView);
    }
    refreshSelection();
  });

  if (window.innerWidth > 700) {
    $('coinsGroup').classList.add('visible');
    $('notesGroup').classList.add('visible');
  }

  initUpdates();
}

// New-version flow: continue using the installed code until the user accepts.
let updateRegistration = null;
let updateRequested = false;
let updateDeferred = false;

function showUpdateNotice(registration) {
  if (!navigator.serviceWorker.controller || !registration.waiting) return;
  updateRegistration = registration;
  if (!updateDeferred) $('updateBanner').hidden = false;
}

function checkForUpdates() {
  if (navigator.onLine === false || !updateRegistration) return;
  updateRegistration.update().catch(() => {});
}

function initUpdates() {
  $('updateLater').addEventListener('click', () => {
    updateDeferred = true;
    $('updateBanner').hidden = true;
  });
  $('updateNow').addEventListener('click', () => {
    const waiting = updateRegistration && updateRegistration.waiting;
    if (!waiting) return;
    // Ensure current quantities are saved before the service worker changes.
    save();
    updateRequested = true;
    $('updateNow').disabled = true;
    $('updateNow').textContent = 'Opdaterer…';
    waiting.postMessage({ type: 'SKIP_WAITING' });
  });

  window.addEventListener('online', () => {
    if (updateRegistration) $('status').textContent = 'Offline-klar';
    checkForUpdates();
  });
  window.addEventListener('offline', () => $('status').textContent = 'Offline');

  if (!('serviceWorker' in navigator)) {
    $('status').textContent = navigator.onLine ? 'Online' : 'Offline';
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Only reload if the user has explicitly accepted the update.
    if (updateRequested) window.location.reload();
  });

  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(registration => {
    updateRegistration = registration;
    $('status').textContent = navigator.onLine ? 'Offline-klar' : 'Offline';
    if (registration.waiting) showUpdateNotice(registration);
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed') showUpdateNotice(registration);
      });
    });
    // A check on each launch, when the user returns, and periodically while online.
    checkForUpdates();
    window.addEventListener('focus', checkForUpdates);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkForUpdates();
    });
    setInterval(checkForUpdates, 30 * 60 * 1000);
  }).catch(() => {
    $('status').textContent = navigator.onLine ? 'Online' : 'Offline';
  });
}

document.addEventListener('DOMContentLoaded', init);

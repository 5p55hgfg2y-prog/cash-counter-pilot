'use strict';
// Cash values are integer øre. No external requests, tracking, or third-party scripts.
const DENOMS = [
  {ore:50000,name:'500 kr.',kind:'note'},
  {ore:20000,name:'200 kr.',kind:'note'},
  {ore:10000,name:'100 kr.',kind:'note'},
  {ore:5000,name:'50 kr.',kind:'note'},
  {ore:2000,name:'20 kr.',kind:'coin'},
  {ore:1000,name:'10 kr.',kind:'coin'},
  {ore:500,name:'5 kr.',kind:'coin'},
  {ore:200,name:'2 kr.',kind:'coin'},
  {ore:100,name:'1 kr.',kind:'coin'},
  {ore:50,name:'50 øre',kind:'coin'}
];
const KEY = 'dk-cash-count-v1'; // Preserve existing v1-v5 device data.
const el = id => document.getElementById(id);
const today = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
};
const blank = () => ({counts:{},opening:0,movements:[],closings:[],closingNote:''});
function readStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.version === 1 && saved.days && typeof saved.days === 'object' && !Array.isArray(saved.days)) return saved;
  } catch (_) { /* no storage yet */ }
  return {version:1,store:'',days:{}};
}
let data = readStorage();
let store = data.store || ''; // Legacy per-store storage key retained for migration safety.
let date = today();
let noticeTimer;
const dayKey = () => store.trim()+'|'+date;
const current = () => data.days[dayKey()] || blank();
function mutable() {
  const key = dayKey();
  if (!data.days[key]) data.days[key] = blank();
  return data.days[key];
}
function notify(message) {
  const n=el('toast'); n.textContent=message; n.classList.add('visible');
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>n.classList.remove('visible'),3400);
}
function save() {
  data.store=store;
  try { localStorage.setItem(KEY,JSON.stringify(data)); }
  catch (_) { notify('Lagring mislykkedes. Kontrollér ledig plads på enheden.'); }
}
function money(ore) {
  return (ore/100).toLocaleString('da-DK',{minimumFractionDigits:2,maximumFractionDigits:2})+' kr.';
}
function parseMoney(value) {
  const s=String(value).trim().replace(/\s/g,'');
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(s)) return null;
  const parts=s.replace(',','.').split('.');
  const n=Number(parts[0])*100 + Number((parts[1] || '').padEnd(2,'0'));
  return Number.isSafeInteger(n) ? n : null;
}
const counted = d => DENOMS.reduce((sum,dn)=>sum+dn.ore*(d.counts[dn.ore]||0),0);
const movementSum = d => d.movements.reduce((sum,m)=>sum+m.ore,0);
function makeNode(tag,cls,text) {
  const e=document.createElement(tag);
  if(cls)e.className=cls;
  if(text!==undefined)e.textContent=text;
  return e;
}
function elements() {
  for(const dn of DENOMS) {
    const row=makeNode('div','denom');
    const name=makeNode('span','name',dn.name);
    const stepper=makeNode('div','stepper');
    const minus=makeNode('button','minus','−'); minus.type='button'; minus.setAttribute('aria-label','Færre '+dn.name);
    const input=document.createElement('input'); input.type='number';input.min='0';input.max='999999';input.inputMode='numeric';input.value='0';input.setAttribute('aria-label','Antal '+dn.name);
    const plus=makeNode('button','plus','+'); plus.type='button';plus.setAttribute('aria-label','Flere '+dn.name);
    const subtotal=makeNode('span','subtotal',money(0));
    const set=value=>{
      const parsed=Number(value);
      const num=Math.max(0,Math.min(999999,Number.isFinite(parsed)?Math.floor(parsed):0));
      input.value=String(num);
      mutable().counts[dn.ore]=num;
      save();renderTotals();subtotal.textContent=money(dn.ore*num);
    };
    minus.addEventListener('click',()=>set((Number(input.value)||0)-1));
    plus.addEventListener('click',()=>set((Number(input.value)||0)+1));
    input.addEventListener('change',()=>set(input.value));
    input.addEventListener('blur',()=>set(input.value));
    stepper.append(minus,input,plus);row.append(name,stepper,subtotal);
    row.dataset.ore=String(dn.ore);
    el(dn.kind==='note'?'notes':'coins').append(row);
  }
}
function renderTotals() {
  const d=current();
  el('countTotal').textContent=money(counted(d));
  el('notesTotal').textContent=money(DENOMS.filter(x=>x.kind==='note').reduce((s,x)=>s+x.ore*(d.counts[x.ore]||0),0));
  el('coinsTotal').textContent=money(DENOMS.filter(x=>x.kind==='coin').reduce((s,x)=>s+x.ore*(d.counts[x.ore]||0),0));
  el('movementNet').textContent=money(movementSum(d));
}
function render() {
  const d=current();
  for(const row of document.querySelectorAll('.denom')) {
    const ore=Number(row.dataset.ore),qty=d.counts[ore]||0;
    row.querySelector('input').value=qty;
    row.querySelector('.subtotal').textContent=money(ore*qty);
  }
  renderTotals();
  const list=el('movementList');list.replaceChildren();
  if(!d.movements.length)list.append(makeNode('div','empty','Ingen bevægelser registreret endnu.'));
  for(const movement of [...d.movements].reverse()) {
    const entry=makeNode('div','log-entry');
    const header=makeNode('div','log-title');
    const title=makeNode('span','',movement.reason);
    const amount=makeNode('strong','',(movement.ore>=0?'+':'')+money(movement.ore));
    header.append(title,amount);
    const meta=makeNode('div','log-meta',new Date(movement.at).toLocaleString('da-DK')+(movement.note?' · '+movement.note:''));
    const remove=makeNode('button','','Slet registrering');remove.type='button';
    remove.addEventListener('click',()=>{
      if(confirm('Vil du slette denne registrering?')) {
        mutable().movements=mutable().movements.filter(x=>x.id!==movement.id);
        save();render();
      }
    });
    entry.append(header,meta,remove);list.append(entry);
  }
}
function init() {
  el('date').value=date;
  elements();render();
  document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('selected',b===button));
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('hidden',p.id!==button.dataset.tab));
  }));
  el('date').addEventListener('change',event=>{date=event.target.value||today();render();});
  el('resetCount').addEventListener('click',()=>{
    if(confirm('Vil du nulstille alt?')) {
      data.days[dayKey()]=blank();save();render();notify('Alt for denne dato er nulstillet.');
    }
  });
  el('addMovement').addEventListener('click',()=>{
    const amount=parseMoney(el('movementAmount').value);
    if(amount===null||amount<=0) {notify('Angiv et positivt beløb, f.eks. 125,50.');return;}
    const ore=el('movementType').value==='out'?-amount:amount;
    mutable().movements.push({
      id:(typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now()+'-'+Math.random()),
      at:new Date().toISOString(),ore,
      reason:el('movementReason').value,
      note:el('movementNote').value.trim().slice(0,160)
    });
    save();el('movementAmount').value='';el('movementNote').value='';render();
    notify('Kontantbevægelse gemt lokalt.');
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
      navigator.serviceWorker.ready.then(()=>{el('status').textContent='Offline-klar';}).catch(()=>{});
      // On returning to an online app, look for a new SW without unnecessary polling.
      document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine)reg.update().catch(()=>{});});
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        // Once new SW controls the page, reload to ensure the full same-version UI.
        if(!sessionStorage.getItem('dk-reload-v6')) {
          sessionStorage.setItem('dk-reload-v6','1');window.location.reload();
        }
      });
    }).catch(()=>{el('status').textContent='Online';});
  } else {el('status').textContent='Online';}
}
init();

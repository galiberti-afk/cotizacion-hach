// ════════════════════════════════════════════════════════
//  CONFIGURACIÓN — MODIFICÁ ESTOS VALORES
// ════════════════════════════════════════════════════════
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';        // https://dashboard.emailjs.com/admin
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
const EMAIL_DESTINO       = 'galiberti@meditecna.com.ar';

emailjs.init(EMAILJS_PUBLIC_KEY);

// ════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ════════════════════════════════════════════════════════
let state = { catId: '', subId: '', modelIdx: -1, checks: [] };
let cart = [];
let stepHistory = [];
let currentStep = 'cat';

// ════════════════════════════════════════════════════════
//  UTILIDADES
// ════════════════════════════════════════════════════════
function findCat(id){ return CATALOG.find(c => c.id === id); }
function findSub(catId, subId){ const c = findCat(catId); return c && c.subcats ? c.subcats.find(s => s.id === subId) : null; }

function imgTag(src, icon, cls){
  return `<img src="${src}" alt="" onerror="this.replaceWith(makeIcon('${icon}','${cls}'))">`;
}
function makeIcon(emoji, cls){
  const s = document.createElement('span');
  s.className = cls || 'card-icon';
  s.textContent = emoji;
  return s;
}

// ════════════════════════════════════════════════════════
//  RENDER DE STEPS DINÁMICOS
// ════════════════════════════════════════════════════════
function renderCatStep(){
  const html = `
    <div class="step" id="step-cat">
      <div class="option-grid">
        ${CATALOG.map(c => `
          <div class="option-card" data-val="${c.id}" onclick="selectCat(this,'${c.id}')">
            <div class="opt-photo">${imgTag(c.img, c.icon, 'card-icon')}</div>
            <div class="card-label">${c.label}</div>
          </div>
        `).join('')}
      </div>
      <div class="error-msg" id="err-cat">Por favor, seleccioná una categoría.</div>
    </div>`;
  document.getElementById('dynamicSteps').insertAdjacentHTML('beforeend', html);
}

function renderSubStep(cat){
  const id = 'sub-' + cat.id;
  const html = `
    <div class="step" id="step-${id}">
      <div class="option-grid">
        ${cat.subcats.map(s => `
          <div class="option-card" data-val="${s.id}" onclick="selectSub(this,'${cat.id}','${s.id}')">
            <div class="opt-photo">${imgTag(s.img, s.icon, 'card-icon')}</div>
            <div class="card-label">${s.label}</div>
          </div>
        `).join('')}
      </div>
      <div class="error-msg" id="err-${id}">Por favor, seleccioná una opción.</div>
    </div>`;
  document.getElementById('dynamicSteps').insertAdjacentHTML('beforeend', html);
  return id;
}

function renderModelStep(catId, sub){
  const id = 'model-' + sub.id;
  const html = `
    <div class="step" id="step-${id}">
      <div class="product-grid">
        ${sub.models.map((m, i) => `
          <div class="product-card" data-idx="${i}" onclick="selectModel(this,'${catId}','${sub.id}',${i})">
            <div class="prod-photo">${imgTag(m.img, m.icon, 'card-icon')}</div>
            <div class="p-model">${m.label}</div>
            <ul class="p-features">
              ${m.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="error-msg" id="err-${id}">Por favor, seleccioná un modelo.</div>
    </div>`;
  document.getElementById('dynamicSteps').insertAdjacentHTML('beforeend', html);
  return id;
}

function renderChecklistStep(cat){
  const id = 'check-' + cat.id;
  const gridId = 'grid-' + id;
  const html = `
    <div class="step" id="step-${id}">
      <div class="check-grid" id="${gridId}">
        ${cat.options.map(o => `
          <label class="check-item">
            <input type="checkbox" value="${o}" onchange="syncCheckItem(this)">
            <div class="chk-box"></div><span class="chk-label">${o}</span>
          </label>
        `).join('')}
      </div>
      <div class="error-msg" id="err-${id}">Por favor, seleccioná al menos una opción.</div>
    </div>`;
  document.getElementById('dynamicSteps').insertAdjacentHTML('beforeend', html);
  return id;
}

// Pre-renderizamos todos los steps posibles del catálogo
function buildAllSteps(){
  renderCatStep();
  CATALOG.forEach(cat => {
    if (cat.type === 'nested') {
      renderSubStep(cat);
      cat.subcats.forEach(sub => renderModelStep(cat.id, sub));
    } else if (cat.type === 'checklist') {
      renderChecklistStep(cat);
    }
  });
}

// ════════════════════════════════════════════════════════
//  META (título / descripción por step)
// ════════════════════════════════════════════════════════
function getMeta(step){
  if (step === 'cat') return { title: '¿Qué tipo de producto buscás?', desc: 'Elegí una categoría para continuar.' };
  if (step === 'addmore') return { title: '¿Querés agregar otro producto?', desc: 'Podés sumar más equipos o reactivos a tu consulta.' };
  if (step === 'contact') return { title: 'Tus datos de contacto', desc: 'Completá tus datos para que podamos responderte.' };
  if (step.startsWith('sub-')){
    const cat = findCat(step.replace('sub-',''));
    return { title: cat.label, desc: 'Seleccioná la familia de productos.' };
  }
  if (step.startsWith('model-')){
    const subId = step.replace('model-','');
    for (const c of CATALOG){ const s = findSub(c.id, subId); if (s) return { title: s.label, desc: 'Seleccioná el modelo de tu interés.' }; }
  }
  if (step.startsWith('check-')){
    const cat = findCat(step.replace('check-',''));
    return { title: cat.label, desc: 'Seleccioná todo lo que necesites.' };
  }
  return { title: '', desc: '' };
}

// ════════════════════════════════════════════════════════
//  NAVEGACIÓN / UI
// ════════════════════════════════════════════════════════
function showStep(id){
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('step-' + id);
  if (el) el.classList.add('active');
  currentStep = id;
  updateHeader();
  updateButtons();
  updateProgress();
  updateCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateHeader(){
  const meta = getMeta(currentStep);
  document.getElementById('stepTitle').textContent = meta.title;
  document.getElementById('stepDesc').textContent = meta.desc;
}

function updateButtons(){
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  btnBack.style.display = stepHistory.length > 0 ? 'inline-block' : 'none';
  btnNext.style.display = (currentStep === 'addmore' || currentStep === 'contact') ? 'none' : 'inline-block';
  btnSubmit.style.display = currentStep === 'contact' ? 'inline-block' : 'none';
}

function updateProgress(){
  const approxDepth = { cat:1 }[currentStep] ||
    (currentStep.startsWith('sub-') ? 2 :
     currentStep.startsWith('model-') || currentStep.startsWith('check-') ? 3 :
     currentStep === 'addmore' ? 4 :
     currentStep === 'contact' ? 5 : 1);
  const pct = Math.min(100, Math.round((approxDepth / 5) * 100));
  document.getElementById('progressBar').style.width = pct + '%';
}

function updateCart(){
  const banner = document.getElementById('cartBanner');
  const cartList = document.getElementById('cartList');
  if (cart.length === 0){ banner.classList.remove('visible'); return; }
  banner.classList.add('visible');
  cartList.innerHTML = cart.map((p,i) => `<br>${i+1}. <strong>${p.summary}</strong>`).join('');
}

// ════════════════════════════════════════════════════════
//  SELECCIÓN
// ════════════════════════════════════════════════════════
function selectCat(card, catId){
  card.closest('.option-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.catId = catId; state.subId = ''; state.modelIdx = -1; state.checks = [];
  clearErrors();
  setTimeout(() => goNext(), 250);
}

function selectSub(card, catId, subId){
  card.closest('.option-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.subId = subId; state.modelIdx = -1;
  clearErrors();
  setTimeout(() => goNext(), 250);
}

function selectModel(card, catId, subId, idx){
  card.closest('.product-grid').querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.modelIdx = idx;
  clearErrors();
  setTimeout(() => goNext(), 250);
}

// Se dispara con el evento "change" del checkbox (no con el click del label),
// así evitamos el doble-toggle que hacía que no funcionara.
function syncCheckItem(checkbox){
  const item = checkbox.closest('.check-item');
  item.classList.toggle('checked', checkbox.checked);
  clearErrors();
}

function getChecked(gridId){
  const vals = [];
  document.querySelectorAll(`#${gridId} .check-item.checked input`).forEach(cb => vals.push(cb.value));
  return vals;
}

function clearChecksIn(gridId){
  document.querySelectorAll(`#${gridId} .check-item`).forEach(item => {
    item.classList.remove('checked');
    item.querySelector('input').checked = false;
  });
}

// ════════════════════════════════════════════════════════
//  FLUJO goNext / goBack
// ════════════════════════════════════════════════════════
function goNext(){
  clearErrors();

  if (currentStep === 'cat'){
    if (!state.catId){ showError('err-cat'); return; }
    stepHistory.push('cat');
    const cat = findCat(state.catId);
    if (cat.type === 'nested') showStep('sub-' + cat.id);
    else if (cat.type === 'checklist') showStep('check-' + cat.id);

  } else if (currentStep.startsWith('sub-')){
    if (!state.subId){ showError('err-' + currentStep); return; }
    stepHistory.push(currentStep);
    showStep('model-' + state.subId);

  } else if (currentStep.startsWith('model-')){
    if (state.modelIdx < 0){ showError('err-' + currentStep); return; }
    stepHistory.push(currentStep);
    addModelToCart();
    showStep('addmore');

  } else if (currentStep.startsWith('check-')){
    const catId = currentStep.replace('check-','');
    const gridId = 'grid-' + currentStep;
    state.checks = getChecked(gridId);
    if (state.checks.length === 0){ showError('err-' + currentStep); return; }
    stepHistory.push(currentStep);
    addChecklistToCart(catId);
    showStep('addmore');
  }
}

function goBack(){
  clearErrors();
  if (stepHistory.length === 0) return;
  const prev = stepHistory.pop();
  showStep(prev);
}

// ════════════════════════════════════════════════════════
//  CARRITO
// ════════════════════════════════════════════════════════
function addModelToCart(){
  const cat = findCat(state.catId);
  const sub = findSub(state.catId, state.subId);
  const model = sub.models[state.modelIdx];
  cart.push({
    summary: `${cat.label} › ${sub.label} › ${model.label}`,
    detail: { categoria: cat.label, subcategoria: sub.label, modelo: model.label }
  });
}

function addChecklistToCart(catId){
  const cat = findCat(catId);
  cart.push({
    summary: `${cat.label}: ${state.checks.join(', ')}`,
    detail: { categoria: cat.label, seleccion: state.checks.join(', ') }
  });
}

function handleAddMore(yes){
  if (yes){
    state = { catId: '', subId: '', modelIdx: -1, checks: [] };
    document.querySelectorAll('.option-card.selected, .product-card.selected').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.check-grid').forEach(g => clearChecksIn(g.id));
    stepHistory = [];
    showStep('cat');
  } else {
    stepHistory.push('addmore');
    showStep('contact');
  }
}

// ════════════════════════════════════════════════════════
//  ERRORES
// ════════════════════════════════════════════════════════
function showError(id){ const el = document.getElementById(id); if (el) el.classList.add('show'); }
function clearErrors(){ document.querySelectorAll('.error-msg.show').forEach(e => e.classList.remove('show')); }

// ════════════════════════════════════════════════════════
//  ENVÍO
// ════════════════════════════════════════════════════════
function submitForm(){
  clearErrors();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const company   = document.getElementById('company').value.trim();

  if (!firstName || !lastName || !email || !phone || !company){ showError('err-contact'); return; }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)){
    document.getElementById('err-contact').textContent = 'Ingresá un email válido.';
    showError('err-contact');
    return;
  }

  const productLines = cart.map((p, i) => {
    let line = `\nProducto ${i+1}: ${p.summary}\n`;
    Object.entries(p.detail).forEach(([k,v]) => line += `  ${k}: ${v}\n`);
    return line;
  }).join('\n---');

  const templateParams = {
    to_email: EMAIL_DESTINO,
    from_name: `${firstName} ${lastName}`,
    from_email: email,
    phone: phone,
    company: company,
    products: productLines,
    reply_to: email,
  };

  const btnSubmit = document.getElementById('btnSubmit');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Enviando...';

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      document.getElementById('heroCard').style.display = 'none';
      document.getElementById('successEmail').textContent = email;
      document.getElementById('thanksCard').classList.add('active');
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Enviar consulta ✉';
      alert('Hubo un error al enviar. Por favor intentá de nuevo.');
    });
}

// ════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════
buildAllSteps();
showStep('cat');

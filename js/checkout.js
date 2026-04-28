/* ============================================================
   EXQUISITE RUGS — Checkout Page
   ============================================================ */

const cartStore = window.ExquisiteCartStore;
const fmt = cartStore.formatMoney;

let appliedPromo = null;

const DEMO_CODES = {
  TRADE10: { type: 'percent', value: 0.1, label: '10% trade discount' },
  '20OFF': { type: 'percent', value: 0.2, label: '20% promotional discount' },
  WELCOME: { type: 'flat', value: 250, label: '$250 welcome credit' },
  HPMARKET: { type: 'percent', value: 0.05, label: '5% High Point event discount' },
};

function discountAmount(subtotal) {
  if (!appliedPromo) return 0;
  if (appliedPromo.type === 'percent') return subtotal * appliedPromo.value;
  if (appliedPromo.type === 'flat') return Math.min(appliedPromo.value, subtotal);
  return 0;
}

function renderSummary() {
  const items = cartStore.getActiveItems();
  const totalQty = cartStore.getItemCount();
  const sub = cartStore.getSubtotal();
  const discount = discountAmount(sub);
  const placeOrderBtn = document.getElementById('place-order-btn');

  document.getElementById('co-item-count').textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    document.getElementById('co-items-list').innerHTML = `
      <div class="summary-item">
        <span class="summary-item-name" style="white-space:normal;color:var(--muted)">Your cart is empty.</span>
      </div>
    `;
    document.getElementById('co-subtotal').textContent = fmt(0);
    document.getElementById('co-discount-row').style.display = 'none';
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  if (placeOrderBtn) placeOrderBtn.disabled = false;

  document.getElementById('co-items-list').innerHTML = items.map((item) => {
    const addons = [];
    if (item.rugPadAdded) addons.push({ label: 'Rug pad', price: item.rugPadPrice });
    if (item.microsealAdded) addons.push({ label: 'Microseal', price: cartStore.microsealCost(item) });

    return `
      <div class="summary-item">
        <span class="summary-item-name">${item.name} <span class="summary-item-qty">× ${item.quantity}</span></span>
        <span class="summary-item-price">${fmt(item.unitPrice * item.quantity)}</span>
      </div>
      ${addons.map((addon) => `
        <div class="summary-item" style="padding-left:10px">
          <span class="summary-item-name" style="color:var(--muted-soft);font-size:11.5px">${addon.label}</span>
          <span class="summary-item-price" style="font-size:11.5px">${fmt(addon.price)}</span>
        </div>
      `).join('')}
    `;
  }).join('');

  document.getElementById('co-subtotal').textContent = fmt(sub - discount);

  const discountRow = document.getElementById('co-discount-row');
  if (discount > 0) {
    discountRow.style.display = '';
    document.getElementById('co-discount-label').textContent = `Promo (${appliedPromo.code})`;
    document.getElementById('co-discount-val').textContent = `−${fmt(discount)}`;
  } else {
    discountRow.style.display = 'none';
  }
}

const pmNet30 = document.getElementById('pm-net30');
const pmCC = document.getElementById('pm-cc');
const net30Detail = document.getElementById('net30-detail');
const ccForm = document.getElementById('cc-form');

function selectPayment(method) {
  if (method === 'net30') {
    pmNet30.classList.add('selected');
    pmCC.classList.remove('selected');
    pmNet30.setAttribute('aria-checked', 'true');
    pmCC.setAttribute('aria-checked', 'false');
    net30Detail.classList.add('visible');
    ccForm.classList.remove('visible');
  } else {
    pmCC.classList.add('selected');
    pmNet30.classList.remove('selected');
    pmCC.setAttribute('aria-checked', 'true');
    pmNet30.setAttribute('aria-checked', 'false');
    ccForm.classList.add('visible');
    net30Detail.classList.remove('visible');
  }
}

pmNet30.addEventListener('click', () => selectPayment('net30'));
pmCC.addEventListener('click', () => selectPayment('cc'));
[pmNet30, pmCC].forEach((el) => {
  el.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      selectPayment(el.dataset.method);
    }
  });
});

const ccNum = document.getElementById('cc-number');
if (ccNum) {
  ccNum.addEventListener('input', (event) => {
    let value = event.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    event.target.value = value;
  });
}

const ccExp = document.getElementById('cc-expiry');
if (ccExp) {
  ccExp.addEventListener('input', (event) => {
    let value = event.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) value = value.slice(0, 2) + ' / ' + value.slice(2);
    event.target.value = value;
  });
}

document.getElementById('checkout-promo-btn').addEventListener('click', applyCheckoutPromo);
document.getElementById('checkout-promo').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') applyCheckoutPromo();
});

function applyCheckoutPromo() {
  const input = document.getElementById('checkout-promo');
  const feedback = document.getElementById('checkout-promo-feedback');
  const btn = document.getElementById('checkout-promo-btn');
  const code = input.value.trim().toUpperCase();

  if (!code) return;

  if (DEMO_CODES[code]) {
    appliedPromo = { code, ...DEMO_CODES[code] };
    feedback.textContent = `Applied: ${DEMO_CODES[code].label}`;
    feedback.className = 'promo-feedback success';
    input.value = '';
    input.disabled = true;
    btn.textContent = 'Remove';
    btn.replaceWith(btn.cloneNode(true));
    document.getElementById('checkout-promo-btn').addEventListener('click', removeCheckoutPromo);
  } else {
    feedback.textContent = 'Code not recognised. Please check and try again.';
    feedback.className = 'promo-feedback error';
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 1800);
  }

  renderSummary();
}

function removeCheckoutPromo() {
  const input = document.getElementById('checkout-promo');
  const feedback = document.getElementById('checkout-promo-feedback');
  const btn = document.getElementById('checkout-promo-btn');
  appliedPromo = null;
  input.disabled = false;
  input.value = '';
  btn.textContent = 'Apply';
  btn.replaceWith(btn.cloneNode(true));
  document.getElementById('checkout-promo-btn').addEventListener('click', applyCheckoutPromo);
  feedback.textContent = '';
  feedback.className = 'promo-feedback';
  renderSummary();
}

const requiredFields = [
  { id: 'ship-company', errId: 'err-company' },
  { id: 'ship-phone', errId: 'err-phone' },
  { id: 'ship-address1', errId: 'err-address1' },
  { id: 'ship-city', errId: 'err-city' },
  { id: 'ship-state', errId: 'err-state' },
  { id: 'ship-zip', errId: 'err-zip' },
];

function validateForm() {
  let valid = true;
  requiredFields.forEach(({ id, errId }) => {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el || !err) return;
    if (!el.value.trim()) {
      el.classList.add('error');
      err.classList.add('visible');
      valid = false;
    } else {
      el.classList.remove('error');
      err.classList.remove('visible');
    }
  });
  return valid;
}

requiredFields.forEach(({ id, errId }) => {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el || !err) return;
  el.addEventListener('input', () => {
    if (el.value.trim()) {
      el.classList.remove('error');
      err.classList.remove('visible');
    }
  });
});

document.getElementById('place-order-btn').addEventListener('click', () => {
  if (cartStore.getActiveItems().length === 0) return;

  if (!validateForm()) {
    const firstErr = document.querySelector('.form-input.error, .form-select.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('place-order-btn');
  btn.textContent = 'Placing Order…';
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = 'confirmation.html';
  }, 1200);
});

const announcementBar = document.getElementById('announcement-bar');
const announcementClose = document.getElementById('announcement-close');
if (announcementClose && announcementBar) {
  announcementClose.addEventListener('click', () => {
    announcementBar.style.transition = 'opacity 0.2s, max-height 0.3s, padding 0.3s';
    announcementBar.style.opacity = '0';
    announcementBar.style.maxHeight = '0';
    announcementBar.style.padding = '0';
    announcementBar.style.overflow = 'hidden';
  });
}

cartStore.subscribe(renderSummary);
renderSummary();

/* ============================================================
   EXQUISITE RUGS — Cart Page
   ============================================================ */

const cartStore = window.ExquisiteCartStore;
const fmt = cartStore.formatMoney;

let appliedPromo = null;

function discountAmount(subtotal) {
  if (!appliedPromo) return 0;
  if (appliedPromo.type === 'percent') return subtotal * appliedPromo.value;
  if (appliedPromo.type === 'flat') return Math.min(appliedPromo.value, subtotal);
  return 0;
}

function renderCart() {
  renderItems();
  renderSummary();
}

function renderItems() {
  const list = document.getElementById('cart-items-list');
  const active = cartStore.getActiveItems();
  const checkoutBtn = document.getElementById('checkout-btn');

  if (active.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Browse our collections to find your next piece.</p>
        <a href="#">Explore Collections</a>
      </div>
    `;
    if (checkoutBtn) {
      checkoutBtn.style.pointerEvents = 'none';
      checkoutBtn.style.opacity = '0.5';
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.style.pointerEvents = '';
    checkoutBtn.style.opacity = '';
  }

  list.innerHTML = active.map((item) => itemHTML(item)).join('');

  active.forEach((item) => {
    const el = document.getElementById(`item-${item.id}`);
    if (!el) return;

    el.querySelector('.qty-decrement')?.addEventListener('click', () => cartStore.changeQty(item.id, -1));
    el.querySelector('.qty-increment')?.addEventListener('click', () => cartStore.changeQty(item.id, 1));
    el.querySelector('.btn-save')?.addEventListener('click', () => saveForLater(item.id));
    el.querySelector('.btn-remove')?.addEventListener('click', () => removeItem(item.id));
    el.querySelector('.btn-add-pad')?.addEventListener('click', () => cartStore.addRugPad(item.id));
    el.querySelector('.btn-remove-pad')?.addEventListener('click', () => cartStore.removeRugPad(item.id));
    el.querySelector('.btn-add-microseal')?.addEventListener('click', () => cartStore.addMicroseal(item.id));
    el.querySelector('.btn-remove-microseal')?.addEventListener('click', () => cartStore.removeMicroseal(item.id));
  });
}

function itemHTML(item) {
  const lineTotal = item.unitPrice * item.quantity;
  const svgThumb = cartStore.rugSVGs[item.svgKey] || cartStore.rugSVGs[1];

  let padBlock = '';
  if (!item.rugPadAdded) {
    padBlock = `
      <div class="upsell-block" id="upsell-pad-${item.id}">
        <div class="upsell-left">
          <div class="upsell-label">Suggested Add-on — Rug Pad</div>
          <div class="upsell-desc">Matched: <strong>${item.rugPadSize}</strong> · Prevents slipping, extends rug life</div>
        </div>
        <div class="upsell-right">
          <span class="upsell-price">${fmt(item.rugPadPrice)}</span>
          <button class="upsell-add-btn btn-add-pad">Add</button>
        </div>
      </div>`;
  } else if (item.rugPadSource === 'cart') {
    padBlock = `
      <div class="upsell-block upsell-active" id="upsell-pad-${item.id}">
        <div class="upsell-left">
          <div class="upsell-label">Rug Pad · Added</div>
          <div class="upsell-desc">
            <span class="upsell-check">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><path d="M3.5 6l1.8 1.8 3.2-3.2"/></svg>
              ${item.rugPadSize}
            </span>
          </div>
        </div>
        <div class="upsell-right">
          <span class="upsell-price">${fmt(item.rugPadPrice)}</span>
          <button class="upsell-remove-btn btn-remove-pad">Remove</button>
        </div>
      </div>`;
  }

  let sealBlock = '';
  if (item.microsealEligible) {
    if (!item.microsealAdded) {
      const fiber = item.fiberContent.find((value) => {
        const normalized = value.toLowerCase();
        return normalized.includes('bamboo') || normalized.includes('viscose');
      }) || item.fiberContent[0];

      sealBlock = `
        <div class="upsell-block" id="upsell-seal-${item.id}">
          <div class="upsell-left">
            <div class="upsell-label">Recommended — Microseal Treatment</div>
            <div class="upsell-desc"><strong>${fiber}</strong> fibers · ${item.sqft} sq ft · ${fmt(cartStore.MICROSEAL_PER_SQFT)}/sq ft</div>
          </div>
          <div class="upsell-right">
            <span class="upsell-price">${fmt(cartStore.microsealCost(item))}</span>
            <button class="upsell-add-btn btn-add-microseal">Add</button>
          </div>
        </div>`;
    } else {
      sealBlock = `
        <div class="upsell-block upsell-active" id="upsell-seal-${item.id}">
          <div class="upsell-left">
            <div class="upsell-label">Microseal Treatment · Added</div>
            <div class="upsell-desc">
              <span class="upsell-check">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><path d="M3.5 6l1.8 1.8 3.2-3.2"/></svg>
                ${item.sqft} sq ft · ${fmt(cartStore.microsealCost(item))}
              </span>
            </div>
          </div>
          <div class="upsell-right">
            <span class="upsell-price">${fmt(cartStore.microsealCost(item))}</span>
            <button class="upsell-remove-btn btn-remove-microseal">Remove</button>
          </div>
        </div>`;
    }
  }

  const pdpPadNotice = item.rugPadAdded && item.rugPadSource === 'pdp' ? `
    <div style="margin-top:5px;font-size:11px;color:var(--success);display:flex;align-items:center;gap:5px">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><path d="M3.5 6l1.8 1.8 3.2-3.2"/></svg>
      Rug pad included · ${item.rugPadSize}
    </div>` : '';

  return `
    <div class="cart-item" id="item-${item.id}">
      <div class="cart-item-main">
        <div class="cart-item-thumb">${svgThumb}</div>
        <div class="cart-item-body">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <div class="cart-item-meta">
              <span class="cart-item-name">${item.name}<span class="item-color">, <em>in ${item.colorName}</em></span></span>
              <div class="cart-item-sku-line">
                <span class="item-sku-code">${item.sku}</span>
                <span class="item-sku-sep" aria-hidden="true"></span>
                <span class="item-collection">${item.collection}</span>
              </div>
              <div class="cart-item-attrs">
                <span>${item.size}</span>
                <span>${item.construction}</span>
              </div>
              ${pdpPadNotice}
            </div>
            <div class="cart-item-pricing">
              <span class="cart-item-unit-price">${fmt(item.unitPrice)} / unit</span>
              <span class="cart-item-line-total">${fmt(lineTotal)}</span>
            </div>
          </div>

          <div class="cart-item-controls">
            <div class="qty-stepper" role="group" aria-label="Quantity">
              <button class="qty-btn qty-decrement" aria-label="Decrease" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
              <span class="qty-val" aria-live="polite">${item.quantity}</span>
              <button class="qty-btn qty-increment" aria-label="Increase">+</button>
            </div>
            <div class="cart-item-actions">
              <button class="item-action-btn btn-save">Save for later</button>
              <div class="item-action-divider" aria-hidden="true"></div>
              <button class="item-action-btn remove btn-remove">Remove</button>
            </div>
          </div>
        </div>
      </div>
      ${padBlock}
      ${sealBlock}
    </div>`;
}

function renderSummary() {
  const active = cartStore.getActiveItems();
  const itemCount = cartStore.getItemCount();
  const sub = cartStore.getSubtotal();
  const discount = discountAmount(sub);

  document.getElementById('summary-item-count').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  document.getElementById('cart-subhead').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} · Login required · All prices in USD`;

  document.getElementById('summary-items-list').innerHTML = active.map((item) => {
    const addons = [];
    if (item.rugPadAdded) addons.push(`<div class="summary-item" style="padding-left:10px"><span class="summary-item-name" style="color:var(--muted-soft);font-size:11px">+ Rug pad</span><span class="summary-item-price" style="font-size:11px">${fmt(item.rugPadPrice)}</span></div>`);
    if (item.microsealAdded) addons.push(`<div class="summary-item" style="padding-left:10px"><span class="summary-item-name" style="color:var(--muted-soft);font-size:11px">+ Microseal</span><span class="summary-item-price" style="font-size:11px">${fmt(cartStore.microsealCost(item))}</span></div>`);
    return `<div class="summary-item"><span class="summary-item-name">${item.name}, <em style="font-family:var(--serif);font-style:italic">in ${item.colorName}</em> <span class="summary-item-qty">× ${item.quantity}</span></span><span class="summary-item-price">${fmt(item.unitPrice * item.quantity)}</span></div>${addons.join('')}`;
  }).join('');

  document.getElementById('summary-subtotal').textContent = fmt(sub - discount);

  const discountRow = document.getElementById('summary-discount-row');
  if (discount > 0) {
    discountRow.classList.remove('hidden');
    document.getElementById('summary-discount-label').textContent = `Promo (${appliedPromo.code})`;
    document.getElementById('summary-discount-value').textContent = `−${fmt(discount)}`;
  } else {
    discountRow.classList.add('hidden');
  }
}

function removeItem(id) {
  const removed = cartStore.removeItem(id);
  if (!removed) return;

  showUndoToast(`${removed.item.name} removed from cart`, () => {
    cartStore.restoreItem(removed.index, removed.item);
  });
}

function saveForLater(id) {
  const item = cartStore.getItems().find((entry) => entry.id === id);
  if (!item) return;

  cartStore.saveForLater(id);
  showUndoToast(`${item.name} saved for later`, () => {
    cartStore.restoreSavedItem(id);
  });
}

const optPartial = document.getElementById('opt-partial');
const optHold = document.getElementById('opt-hold');

function selectShipment(selected, other) {
  selected.classList.add('selected');
  other.classList.remove('selected');
  selected.querySelector('input').checked = true;
}

optPartial.addEventListener('click', () => selectShipment(optPartial, optHold));
optHold.addEventListener('click', () => selectShipment(optHold, optPartial));
[optPartial, optHold].forEach((el) => {
  el.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      el.click();
    }
  });
});

const DEMO_CODES = {
  TRADE10: { type: 'percent', value: 0.1, label: '10% trade discount' },
  '20OFF': { type: 'percent', value: 0.2, label: '20% promotional discount' },
  WELCOME: { type: 'flat', value: 250, label: '$250 welcome credit' },
  HPMARKET: { type: 'percent', value: 0.05, label: '5% High Point event discount' },
};

document.getElementById('promo-apply-btn').addEventListener('click', applyPromo);
document.getElementById('promo-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') applyPromo();
});

function applyPromo() {
  const input = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  if (DEMO_CODES[code]) {
    appliedPromo = { code, ...DEMO_CODES[code] };
    feedback.textContent = `Applied: ${DEMO_CODES[code].label}`;
    feedback.className = 'promo-feedback success';
    input.value = '';
    input.disabled = true;
    const btn = document.getElementById('promo-apply-btn');
    btn.textContent = 'Remove';
    btn.replaceWith(btn.cloneNode(true));
    document.getElementById('promo-apply-btn').addEventListener('click', removePromo);
  } else {
    feedback.textContent = 'Code not recognised. Please check and try again.';
    feedback.className = 'promo-feedback error';
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 1800);
  }

  renderSummary();
}

function removePromo() {
  appliedPromo = null;
  const input = document.getElementById('promo-input');
  const btn = document.getElementById('promo-apply-btn');
  const feedback = document.getElementById('promo-feedback');
  input.disabled = false;
  input.value = '';
  btn.textContent = 'Apply';
  btn.replaceWith(btn.cloneNode(true));
  document.getElementById('promo-apply-btn').addEventListener('click', applyPromo);
  feedback.textContent = '';
  feedback.className = 'promo-feedback';
  renderSummary();
}

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

let activeToast = null;
const TOAST_DURATION = 5000;

function showUndoToast(message, undoFn) {
  if (activeToast) {
    clearTimeout(activeToast.timeout);
    activeToast.el.remove();
    activeToast = null;
  }

  const el = document.createElement('div');
  el.className = 'er-toast';
  el.style.setProperty('--toast-duration', TOAST_DURATION + 'ms');
  el.innerHTML = `
    <span>${message}</span>
    <button class="toast-undo">Undo</button>
    <div class="toast-progress"></div>
  `;

  el.querySelector('.toast-undo').addEventListener('click', () => {
    clearTimeout(activeToast.timeout);
    el.classList.remove('visible');
    setTimeout(() => {
      el.remove();
      activeToast = null;
    }, 250);
    undoFn();
  });

  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));

  const timeout = setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => {
      el.remove();
      activeToast = null;
    }, 250);
  }, TOAST_DURATION);

  activeToast = { el, timeout };
}

cartStore.subscribe(renderCart);
renderCart();

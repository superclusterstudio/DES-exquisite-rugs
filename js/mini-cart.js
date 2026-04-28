/* ============================================================
   EXQUISITE RUGS — Header Mini Cart
   ============================================================ */

(function () {
  const store = window.ExquisiteCartStore;
  const trigger = document.getElementById('cart-icon-btn');

  if (!store || !trigger) return;

  const panel = document.createElement('div');
  panel.className = 'mini-cart-panel';
  panel.id = 'mini-cart-panel';
  panel.setAttribute('aria-hidden', 'true');

  panel.innerHTML = `
    <div class="mini-cart-head">
      <div>
        <div class="mini-cart-kicker">Quick Cart</div>
        <div class="mini-cart-meta">
          <span id="mini-cart-count">0 items</span>
          <span class="mini-cart-meta-divider"></span>
          <span>Subtotal: <strong id="mini-cart-subtotal">$0.00</strong></span>
        </div>
      </div>
      <button class="mini-cart-close" id="mini-cart-close" aria-label="Close mini cart">×</button>
    </div>
    <div class="mini-cart-scroll">
      <div class="mini-cart-items" id="mini-cart-items"></div>
      <div class="mini-cart-upsells" id="mini-cart-upsells"></div>
    </div>
    <div class="mini-cart-footer">
      <a class="btn-primary-full mini-cart-checkout" href="checkout.html">Proceed to Checkout</a>
      <a class="mini-cart-view-cart" href="cart.html">View Cart</a>
    </div>
  `;

  document.body.appendChild(panel);

  const closeBtn = document.getElementById('mini-cart-close');
  const list = document.getElementById('mini-cart-items');
  const upsells = document.getElementById('mini-cart-upsells');
  const countEl = document.getElementById('mini-cart-count');
  const subtotalEl = document.getElementById('mini-cart-subtotal');
  const badge = document.getElementById('header-cart-count');

  let open = false;

  function getUpsellSuggestions(items) {
    const suggestions = [];

    items.forEach((item) => {
      if (!item.rugPadAdded) {
        suggestions.push({
          key: `pad-${item.id}`,
          itemId: item.id,
          title: 'Rug Pad',
          subtitle: `${item.name} · ${item.rugPadSize}`,
          detail: 'Matched non-slip foundation for added comfort and rug protection.',
          price: store.formatMoney(item.rugPadPrice),
          action: 'pad',
        });
      }

      if (item.microsealEligible && !item.microsealAdded) {
        suggestions.push({
          key: `seal-${item.id}`,
          itemId: item.id,
          title: 'Microseal Treatment',
          subtitle: `${item.name} · ${item.sqft} sq ft coverage`,
          detail: 'Recommended for delicate fibers to help guard against spills and soil.',
          price: store.formatMoney(store.microsealCost(item)),
          action: 'microseal',
        });
      }
    });

    return suggestions.slice(0, 4);
  }

  function render() {
    const items = store.getActiveItems();
    const count = store.getItemCount();
    const subtotal = store.getSubtotal();
    const suggestions = getUpsellSuggestions(items);

    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    countEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    subtotalEl.textContent = store.formatMoney(subtotal);

    if (items.length === 0) {
      list.innerHTML = `
        <div class="mini-cart-empty">
          <p>Your cart is currently empty.</p>
          <a href="cart.html">Browse your cart</a>
        </div>
      `;
      upsells.innerHTML = '';
      return;
    }

    list.innerHTML = items.map((item) => {
      const extras = [];
      if (item.rugPadAdded) extras.push('Rug pad');
      if (item.microsealAdded) extras.push('Microseal');
      return `
        <article class="mini-cart-item">
          <div class="mini-cart-thumb">${store.rugSVGs[item.svgKey] || store.rugSVGs[1]}</div>
          <div class="mini-cart-item-body">
            <div class="mini-cart-item-top">
              <div>
                <h3 class="mini-cart-item-name">${item.name}, <em>in ${item.colorName}</em></h3>
                <div class="mini-cart-item-sku">${item.sku}</div>
              </div>
              <button class="mini-cart-remove" data-remove-id="${item.id}" aria-label="Remove ${item.name}">×</button>
            </div>
            <div class="mini-cart-item-price">Item price: ${store.formatMoney(item.unitPrice)}</div>
            <div class="mini-cart-item-qty">Qty: ${item.quantity}</div>
            ${extras.length ? `<div class="mini-cart-item-extra">${extras.join(' · ')}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');

    list.querySelectorAll('[data-remove-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.removeId);
        store.removeItem(id);
      });
    });

    if (!suggestions.length) {
      upsells.innerHTML = '';
      return;
    }

    upsells.innerHTML = `
      <section class="mini-cart-upsell-section" aria-label="Customers also bought">
        <div class="mini-cart-upsell-head">Customers Also Bought</div>
        <div class="mini-cart-upsell-list">
          ${suggestions.map((suggestion) => `
            <article class="mini-cart-upsell-item">
              <div class="mini-cart-upsell-copy">
                <div class="mini-cart-upsell-title">${suggestion.title}</div>
                <div class="mini-cart-upsell-subtitle">${suggestion.subtitle}</div>
                <div class="mini-cart-upsell-detail">${suggestion.detail}</div>
              </div>
              <div class="mini-cart-upsell-meta">
                <div class="mini-cart-upsell-price">${suggestion.price}</div>
                <button
                  class="mini-cart-upsell-add"
                  type="button"
                  data-upsell-action="${suggestion.action}"
                  data-upsell-item-id="${suggestion.itemId}"
                >
                  Add
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    upsells.querySelectorAll('[data-upsell-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const itemId = Number(button.dataset.upsellItemId);
        const action = button.dataset.upsellAction;

        if (action === 'pad') {
          store.addRugPad(itemId);
          return;
        }

        if (action === 'microseal') {
          store.addMicroseal(itemId);
        }
      });
    });
  }

  function openPanel() {
    open = true;
    panel.classList.add('visible');
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    open = false;
    panel.classList.remove('visible');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  function togglePanel() {
    if (open) {
      closePanel();
      return;
    }
    openPanel();
  }

  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  document.addEventListener('click', (event) => {
    if (!open) return;
    if (panel.contains(event.target) || trigger.contains(event.target)) return;
    closePanel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) closePanel();
  });

  store.subscribe(render);
  render();
})();

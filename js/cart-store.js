/* ============================================================
   EXQUISITE RUGS — Shared Cart Store
   ============================================================ */

(function () {
  const STORAGE_KEY = 'er-cart-state-v1';
  const MICROSEAL_PER_SQFT = 2.25;

  const rugSVGs = {
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="108" viewBox="0 0 96 108"><rect width="96" height="108" fill="#C8A87A"/><rect x="5" y="5" width="86" height="98" fill="#EFE0C2"/><rect x="9" y="9" width="78" height="90" fill="#C8A87A" opacity="0.35"/><rect x="13" y="13" width="70" height="82" fill="#F2E8D0"/><rect x="5" y="5" width="86" height="98" fill="none" stroke="#9B6B3A" stroke-width="0.8"/><rect x="13" y="13" width="70" height="82" fill="none" stroke="#9B6B3A" stroke-width="0.5"/><ellipse cx="48" cy="54" rx="19" ry="22" fill="none" stroke="#9B6B3A" stroke-width="1.2"/><ellipse cx="48" cy="54" rx="11" ry="13" fill="#D4A878" stroke="#9B6B3A" stroke-width="0.8"/><ellipse cx="48" cy="54" rx="5" ry="6" fill="#9B6B3A"/><path d="M28 54 L38 48 L48 54 L38 60 Z" fill="none" stroke="#9B6B3A" stroke-width="0.7"/><path d="M68 54 L58 48 L48 54 L58 60 Z" fill="none" stroke="#9B6B3A" stroke-width="0.7"/><path d="M48 32 L54 42 L48 52 L42 42 Z" fill="none" stroke="#9B6B3A" stroke-width="0.7"/><path d="M48 76 L54 66 L48 56 L42 66 Z" fill="none" stroke="#9B6B3A" stroke-width="0.7"/><path d="M13 13 Q20 21 27 13" stroke="#9B6B3A" stroke-width="0.7" fill="none"/><path d="M69 13 Q76 21 83 13" stroke="#9B6B3A" stroke-width="0.7" fill="none"/><path d="M13 95 Q20 87 27 95" stroke="#9B6B3A" stroke-width="0.7" fill="none"/><path d="M69 95 Q76 87 83 95" stroke="#9B6B3A" stroke-width="0.7" fill="none"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="108" viewBox="0 0 96 108"><rect width="96" height="108" fill="#1C2035"/><rect x="4" y="4" width="88" height="100" fill="#242840"/><rect x="8" y="8" width="80" height="92" fill="#1C2035"/><rect x="4" y="4" width="88" height="100" fill="none" stroke="#B08856" stroke-width="0.8"/><rect x="8" y="8" width="80" height="92" fill="none" stroke="#B08856" stroke-width="0.5"/><path d="M8 8 L48 32 L88 8" stroke="#B08856" stroke-width="0.8" fill="none"/><path d="M8 100 L48 76 L88 100" stroke="#B08856" stroke-width="0.8" fill="none"/><line x1="48" y1="32" x2="48" y2="76" stroke="#B08856" stroke-width="0.8"/><path d="M8 54 L30 42 L48 54 L66 42 L88 54" stroke="#B08856" stroke-width="0.6" fill="none"/><path d="M8 54 L30 66 L48 54 L66 66 L88 54" stroke="#B08856" stroke-width="0.6" fill="none"/><rect x="36" y="42" width="24" height="24" fill="none" stroke="#B08856" stroke-width="0.8"/><path d="M48 42 L60 54 L48 66 L36 54 Z" fill="none" stroke="#B08856" stroke-width="0.8"/><path d="M48 46 L56 54 L48 62 L40 54 Z" fill="#B08856" fill-opacity="0.4"/><rect x="44" y="50" width="8" height="8" fill="#B08856" fill-opacity="0.6"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="108" viewBox="0 0 96 108"><rect width="96" height="108" fill="#D4B896"/><rect x="0" y="0" width="96" height="7" fill="#C09060"/><rect x="0" y="101" width="96" height="7" fill="#C09060"/><rect x="0" y="7" width="6" height="94" fill="#C09060"/><rect x="90" y="7" width="6" height="94" fill="#C09060"/><rect x="6" y="7" width="84" height="94" fill="#E8D5B0"/><rect x="6" y="7"  width="84" height="9" fill="#D4B896"/><rect x="6" y="25" width="84" height="9" fill="#D4B896"/><rect x="6" y="43" width="84" height="9" fill="#D4B896"/><rect x="6" y="61" width="84" height="9" fill="#D4B896"/><rect x="6" y="79" width="84" height="9" fill="#D4B896"/><rect x="6" y="16" width="84" height="9" fill="#EAD9B8"/><rect x="6" y="34" width="84" height="9" fill="#EAD9B8"/><rect x="6" y="52" width="84" height="9" fill="#EAD9B8"/><rect x="6" y="70" width="84" height="9" fill="#EAD9B8"/><rect x="6" y="88" width="84" height="9" fill="#EAD9B8"/><rect x="0" y="0" width="96" height="108" fill="none" stroke="#C09060" stroke-width="1"/></svg>`,
  };

  const defaultItems = [
    {
      id: 1,
      sku: 'LOT-6970-SND',
      name: 'Lotus',
      colorName: 'Sand',
      collection: 'Antique Loom Collection',
      size: "8' × 10'",
      construction: 'Hand-knotted',
      fiberContent: ['Wool', 'Cotton'],
      unitPrice: 2850.0,
      quantity: 1,
      sqft: 80,
      rugPadAdded: false,
      rugPadSource: null,
      rugPadSize: `7'6" × 9'6"`,
      rugPadPrice: 145.0,
      microsealAdded: false,
      savedForLater: false,
      svgKey: 1,
    },
    {
      id: 2,
      sku: 'SHM-4521-MID',
      name: 'Shimara',
      colorName: 'Midnight',
      collection: 'Artisan Reserve',
      size: "6' × 9'",
      construction: 'Hand-woven',
      fiberContent: ['Bamboo Silk', 'Cotton'],
      unitPrice: 3200.0,
      quantity: 1,
      sqft: 54,
      rugPadAdded: true,
      rugPadSource: 'pdp',
      rugPadSize: `5'6" × 8'6"`,
      rugPadPrice: 125.0,
      microsealAdded: false,
      savedForLater: false,
      svgKey: 2,
    },
    {
      id: 3,
      sku: 'ZAR-8830-CML',
      name: 'Zara',
      colorName: 'Camel',
      collection: 'Modern Classics',
      size: `2'6" × 8'`,
      construction: 'Power-loomed',
      fiberContent: ['Polyester'],
      unitPrice: 485.0,
      quantity: 2,
      sqft: 20,
      rugPadAdded: false,
      rugPadSource: null,
      rugPadSize: `2'3" × 7'6"`,
      rugPadPrice: 65.0,
      microsealAdded: false,
      savedForLater: false,
      svgKey: 3,
    },
  ];

  const listeners = new Set();

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isMicrosealEligible(item) {
    return item.fiberContent.some((fiber) => {
      const normalized = fiber.toLowerCase();
      return normalized.includes('viscose') || normalized.includes('bamboo silk');
    });
  }

  function normalizeItems(items) {
    return items.map((item) => ({
      ...item,
      microsealEligible: isMicrosealEligible(item),
    }));
  }

  function loadItems() {
    return normalizeItems(clone(defaultItems));
  }

  const state = {
    items: loadItems(),
  };

  function persist() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }

  function notify() {
    persist();
    listeners.forEach((listener) => listener(getSnapshot()));
  }

  function getSnapshot() {
    return clone(state.items);
  }

  function getItems() {
    return state.items;
  }

  function getActiveItems() {
    return state.items.filter((item) => !item.savedForLater);
  }

  function formatMoney(amount) {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function microsealCost(item) {
    return item.sqft * MICROSEAL_PER_SQFT;
  }

  function itemLineTotal(item) {
    let total = item.unitPrice * item.quantity;
    if (item.rugPadAdded) total += item.rugPadPrice;
    if (item.microsealAdded) total += microsealCost(item);
    return total;
  }

  function subtotal() {
    return getActiveItems().reduce((sum, item) => sum + itemLineTotal(item), 0);
  }

  function itemCount() {
    return getActiveItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function findItem(id) {
    return state.items.find((item) => item.id === id);
  }

  function changeQty(id, delta) {
    const item = findItem(id);
    if (!item) return false;
    const next = item.quantity + delta;
    if (next < 1) return false;
    item.quantity = next;
    notify();
    return true;
  }

  function removeItem(id) {
    const index = state.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const [removed] = state.items.splice(index, 1);
    notify();
    return { index, item: clone(removed) };
  }

  function restoreItem(index, item) {
    state.items.splice(index, 0, normalizeItems([clone(item)])[0]);
    notify();
  }

  function saveForLater(id) {
    const item = findItem(id);
    if (!item) return false;
    item.savedForLater = true;
    notify();
    return true;
  }

  function restoreSavedItem(id) {
    const item = findItem(id);
    if (!item) return false;
    item.savedForLater = false;
    notify();
    return true;
  }

  function addRugPad(id) {
    const item = findItem(id);
    if (!item) return false;
    item.rugPadAdded = true;
    item.rugPadSource = 'cart';
    notify();
    return true;
  }

  function removeRugPad(id) {
    const item = findItem(id);
    if (!item) return false;
    item.rugPadAdded = false;
    item.rugPadSource = null;
    notify();
    return true;
  }

  function addMicroseal(id) {
    const item = findItem(id);
    if (!item) return false;
    item.microsealAdded = true;
    notify();
    return true;
  }

  function removeMicroseal(id) {
    const item = findItem(id);
    if (!item) return false;
    item.microsealAdded = false;
    notify();
    return true;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.ExquisiteCartStore = {
    MICROSEAL_PER_SQFT,
    rugSVGs,
    getSnapshot,
    getItems,
    getActiveItems,
    getItemCount: itemCount,
    getSubtotal: subtotal,
    getItemLineTotal: itemLineTotal,
    formatMoney,
    microsealCost,
    changeQty,
    removeItem,
    restoreItem,
    saveForLater,
    restoreSavedItem,
    addRugPad,
    removeRugPad,
    addMicroseal,
    removeMicroseal,
    subscribe,
    notify,
  };

  persist();
})();

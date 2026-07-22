// Cart, Wishlist, Theme state — persisted to localStorage
(function () {
  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const writeJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  // ---------- Toast ----------
  function ensureToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
    return c;
  }
  window.toast = function (msg) {
    const c = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 2200);
  };

  // ---------- Theme ----------
  const Theme = {
    init() {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') document.documentElement.classList.add('dark');
    },
    toggle() {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      document.dispatchEvent(new CustomEvent('themechange', { detail: { dark: isDark } }));
    },
    isDark() { return document.documentElement.classList.contains('dark'); }
  };
  window.Theme = Theme;

  // ---------- Cart ----------
  const Cart = {
    items: readJSON('cart', []),
    save() { writeJSON('cart', this.items); document.dispatchEvent(new Event('cartchange')); },
    add(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) { existing.quantity += 1; toast('Cart Updated'); }
      else { this.items.push({ ...product, quantity: 1 }); toast('Added to Cart'); }
      this.save();
    },
    remove(id) { this.items = this.items.filter(i => i.id !== id); toast('Removed from Cart'); this.save(); },
    increase(id) { const it = this.items.find(i => i.id === id); if (it) { it.quantity++; this.save(); } },
    decrease(id) {
      const it = this.items.find(i => i.id === id);
      if (!it) return;
      it.quantity--;
      if (it.quantity <= 0) this.items = this.items.filter(x => x.id !== id);
      this.save();
    },
    clear() { this.items = []; toast('Cart cleared'); this.save(); },
    totalItems() { return this.items.reduce((s, i) => s + i.quantity, 0); },
    subtotal() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); }
  };
  window.Cart = Cart;

  // ---------- Wishlist ----------
  const Wishlist = {
    items: readJSON('wishlist', []),
    save() { writeJSON('wishlist', this.items); document.dispatchEvent(new Event('wishlistchange')); },
    add(product) {
      if (this.items.some(i => i.id === product.id)) return;
      this.items.push(product); toast('Added to Wishlist'); this.save();
    },
    remove(id) { this.items = this.items.filter(i => i.id !== id); toast('Removed from Wishlist'); this.save(); },
    has(id) { return this.items.some(i => i.id === id); },
    toggle(product) { this.has(product.id) ? this.remove(product.id) : this.add(product); },
    clear() { this.items = []; toast('Wishlist cleared'); this.save(); }
  };
  window.Wishlist = Wishlist;

  Theme.init();
})();

// Shared UI helpers: product cards, fade-in observer
window.renderProductCard = function (p) {
  const inWl = Wishlist.has(p.id);
  return `
  <div class="product-card fade-in bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden">
    <a href="product.html?id=${p.id}" class="block">
      <div class="relative overflow-hidden">
        <img src="${p.image}" alt="${p.name}" class="w-full h-72 object-cover" />
        <button data-wishlist-toggle="${p.id}" class="absolute top-3 right-3 bg-white dark:bg-gray-700 p-2 rounded-full shadow ${inWl ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition" aria-label="Wishlist">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400">${p.category}</p>
        <h3 class="text-lg font-semibold mt-2 text-black dark:text-white">${p.name}</h3>
      </div>
    </a>
    <div class="px-5 pb-5">
      <div class="flex items-center justify-between mt-2">
        <span class="text-xl font-bold text-black dark:text-white">$${p.price}</span>
        <div class="flex items-center gap-1 text-black dark:text-white">
          <i class="fas fa-star text-yellow-500"></i><span>${p.rating}</span>
        </div>
      </div>
      <button data-add-to-cart="${p.id}" class="w-full mt-5 bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition">Add to Cart</button>
    </div>
  </div>`;
};

window.wireProductCards = function (root = document) {
  root.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    if (btn._wired) return; btn._wired = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.addToCart);
      const p = PRODUCTS.find(x => x.id === id);
      if (p) Cart.add({ id: p.id, name: p.name, price: p.price, image: p.image });
    });
  });
  root.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
    if (btn._wired) return; btn._wired = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = Number(btn.dataset.wishlistToggle);
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      Wishlist.toggle({ id: p.id, name: p.name, price: p.price, image: p.image });
      btn.classList.toggle('text-red-500', Wishlist.has(p.id));
      btn.classList.toggle('text-gray-500', !Wishlist.has(p.id));
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  root.querySelectorAll('.fade-in:not(.visible)').forEach(el => io.observe(el));
};

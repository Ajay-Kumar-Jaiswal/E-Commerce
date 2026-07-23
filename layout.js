// Injects shared Navbar and Footer + wires interactions
(function () {
  function navHTML() {
    return `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800">
      <nav class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <a href="index.html" class="text-4xl font-bold tracking-wide text-black dark:text-white" style="font-family:'Playfair Display',serif;">Velora</a>

        <div class="hidden md:flex gap-8 font-medium text-black dark:text-white">
          <a href="index.html" class="hover:text-yellow-600 transition">Home</a>
          <a href="shop.html" class="hover:text-yellow-600 transition">Shop</a>
          <a href="about.html" class="hover:text-yellow-600 transition">About</a>
          <a href="contact.html" class="hover:text-yellow-600 transition">Contact</a>
        </div>

        <div class="hidden md:flex items-center gap-5 text-2xl text-black dark:text-white">
          <a href="shop.html" class="hover:text-blue-600 transition" aria-label="Search"><i class="fi fi-rr-search"></i><i class="fas fa-search"></i></a>
          <div class="relative">
            <a href="wishlist.html" class="hover:text-red-500 transition" aria-label="Wishlist"><i class="fas fa-heart"></i></a>
            <span data-wishlist-count class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hidden">0</span>
          </div>
          <div class="relative">
            <a href="cart.html" class="hover:text-blue-600 transition" aria-label="Cart"><i class="fas fa-shopping-cart"></i></a>
            <span data-cart-count class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hidden">0</span>
          </div>
          <a href="login.html" class="hover:text-blue-600 transition" aria-label="Account"><i class="fas fa-user"></i></a>
          <button data-theme-toggle class="hover:text-yellow-500 transition" aria-label="Toggle Theme"><i class="fas fa-moon"></i></button>
        </div>

        <button data-mobile-toggle class="md:hidden text-3xl text-black dark:text-white" aria-label="Menu">
          <i class="fas fa-bars"></i>
        </button>
      </nav>

      <div data-mobile-menu class="mobile-menu md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex flex-col p-6 gap-5 text-lg text-black dark:text-white">
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="wishlist.html">Wishlist (<span data-wishlist-count-m>0</span>)</a>
          <a href="cart.html">Cart (<span data-cart-count-m>0</span>)</a>
          <a href="login.html">Login</a>
          <button data-theme-toggle class="flex items-center gap-2 text-left"><i class="fas fa-moon"></i> Toggle Theme</button>
        </div>
      </div>
    </header>`;
  }

  function footerHTML() {
    return `
    <footer class="bg-black text-white mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 class="text-3xl font-bold mb-4">Velora</h2>
          <p class="text-gray-400 leading-7">Premium fashion for modern lifestyles. Discover timeless style with quality and elegance.</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-5">Quick Links</h3>
          <ul class="space-y-3 text-gray-400">
            <li><a href="index.html" class="hover:text-white">Home</a></li>
            <li><a href="shop.html" class="hover:text-white">Shop</a></li>
            <li><a href="cart.html" class="hover:text-white">Cart</a></li>
            <li><a href="wishlist.html" class="hover:text-white">Wishlist</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-5">Support</h3>
          <ul class="space-y-3 text-gray-400">
            <li>Email: support@velora.com</li>
            <li>Phone: 0000000000</li>
            <li>Mon - Sat: 9AM - 6PM</li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-5">Newsletter</h3>
          <p class="text-gray-400 mb-4">Subscribe to receive updates and offers.</p>
          <input type="email" placeholder="Enter your email" class="w-full p-3 rounded-lg text-black mb-4" style="background:#fff;color:#000;" />
          <button onclick="toast('Subscribed!')" class="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Subscribe</button>
          <div class="flex gap-4 mt-6 text-xl">
            <a href="#" class="hover:text-blue-400 transition"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="hover:text-pink-400 transition"><i class="fab fa-instagram"></i></a>
            <a href="#" class="hover:text-sky-400 transition"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-blue-500 transition"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © ${new Date().getFullYear()} Velora. All rights reserved.
      </div>
    </footer>`;
  }

  function updateBadges() {
    const cartCount = Cart.totalItems();
    const wlCount = Wishlist.items.length;
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cartCount;
      el.classList.toggle('hidden', cartCount === 0);
    });
    document.querySelectorAll('[data-wishlist-count]').forEach(el => {
      el.textContent = wlCount;
      el.classList.toggle('hidden', wlCount === 0);
    });
    document.querySelectorAll('[data-cart-count-m]').forEach(el => el.textContent = cartCount);
    document.querySelectorAll('[data-wishlist-count-m]').forEach(el => el.textContent = wlCount);
  }

  function updateThemeIcons() {
    const isDark = Theme.isDark();
    document.querySelectorAll('[data-theme-toggle] i').forEach(i => {
      i.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
  }

  function wire() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => Theme.toggle());
    });
    const mobileToggle = document.querySelector('[data-mobile-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const i = mobileToggle.querySelector('i');
        if (i) i.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      });
    }
    updateBadges();
    updateThemeIcons();
  }

  function mount() {
    const navMount = document.getElementById('navbar');
    const footMount = document.getElementById('footer');
    if (navMount) navMount.innerHTML = navHTML();
    if (footMount) footMount.innerHTML = footerHTML();
    wire();
  }

  document.addEventListener('DOMContentLoaded', mount);
  document.addEventListener('cartchange', updateBadges);
  document.addEventListener('wishlistchange', updateBadges);
  document.addEventListener('themechange', updateThemeIcons);
})();

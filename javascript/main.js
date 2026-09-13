/* SaffCoz — shared UI logic: nav, cart, wishlist, toast, modal */
(function () {
    'use strict';

    /* ---------- helpers ---------- */

    var LS_CART = 'saffcoz_cart_v1';
    var LS_WISH = 'saffcoz_wishlist_v1';

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function storeGet(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }

    function storeSet(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
    }

    function rupiah(n) {
        return 'Rp ' + Number(n).toLocaleString('id-ID');
    }

    /* ---------- toast ---------- */

    function ensureToastRegion() {
        var r = $('.toast-region');
        if (!r) {
            r = document.createElement('div');
            r.className = 'toast-region';
            r.setAttribute('role', 'status');
            r.setAttribute('aria-live', 'polite');
            document.body.appendChild(r);
        }
        return r;
    }

    var toastTimers = {};

    function toast(msg, opts) {
        opts = opts || {};
        var region = ensureToastRegion();
        var t = document.createElement('div');
        t.className = 'toast' + (opts.error ? ' error' : '');
        var span = document.createElement('span');
        span.textContent = msg;
        t.appendChild(span);

        if (opts.actionLabel && opts.actionFn) {
            var btn = document.createElement('button');
            btn.className = 'toast-btn';
            btn.type = 'button';
            btn.textContent = opts.actionLabel;
            btn.addEventListener('click', function () {
                opts.actionFn();
                dismiss();
            });
            t.appendChild(btn);
        }

        region.appendChild(t);
        requestAnimationFrame(function () { t.classList.add('show'); });

        var timeout = opts.timeout || (opts.actionLabel ? 6000 : 2600);
        function dismiss() {
            clearTimeout(toastTimers[tid]);
            t.classList.remove('show');
            setTimeout(function () { t.remove(); }, 350);
        }
        var tid = setTimeout(dismiss, timeout);
        toastTimers[tid] = t;
        return dismiss;
    }

    /* ---------- cart ---------- */

    var cart = storeGet(LS_CART, []);

    function saveCart() { storeSet(LS_CART, cart); }

    function cartCount() {
        return cart.reduce(function (s, i) { return s + i.qty; }, 0);
    }

    function cartTotal() {
        return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    }

    function addToCart(item) {
        // item: {id, variant, name, price, img}
        var key = item.id + '::' + item.variant;
        var found = cart.filter(function (i) { return i.id === item.id && i.variant === item.variant; })[0];
        if (found) {
            found.qty += 1;
        } else {
            cart.push({
                id: item.id,
                variant: item.variant,
                name: item.name,
                price: item.price,
                img: item.img,
                qty: 1
            });
        }
        saveCart();
        renderCartBadge();
        renderCartDrawer();
        toast('Added to cart — ' + item.name, {
            actionLabel: 'View cart',
            actionFn: openCart
        });
    }

    function setQty(idx, qty) {
        if (qty <= 0) {
            removeItem(idx);
            return;
        }
        cart[idx].qty = qty;
        saveCart();
        renderCartBadge();
        renderCartDrawer();
    }

    function removeItem(idx) {
        var removed = cart[idx];
        cart.splice(idx, 1);
        saveCart();
        renderCartBadge();
        renderCartDrawer();
        if (removed) {
            toast('Removed — ' + removed.name, {
                actionLabel: 'Undo',
                actionFn: function () {
                    cart.push(removed);
                    saveCart();
                    renderCartBadge();
                    renderCartDrawer();
                }
            });
        }
    }

    function renderCartBadge() {
        $all('.nav-cart-count').forEach(function (el) {
            var n = cartCount();
            el.textContent = n;
            el.classList.toggle('show', n > 0);
        });
        var drawerCount = $('#cart-item-count');
        if (drawerCount) drawerCount.textContent = cartCount();
    }

    /* ---------- cart drawer ---------- */

    var drawer, drawerOverlay;

    function buildCartDrawer() {
        if ($('#cart-drawer')) return;
        drawer = document.createElement('aside');
        drawer.id = 'cart-drawer';
        drawer.className = 'cart-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-label', 'Shopping cart');
        drawer.innerHTML =
            '<div class="cart-head">' +
            '  <h3>Cart <span id="cart-item-count" style="font-family:var(--font-body);font-size:13px;color:var(--ink-faint)"></span></h3>' +
            '  <button class="cart-close" type="button" aria-label="Close cart">&times;</button>' +
            '</div>' +
            '<div class="cart-items" id="cart-items"></div>' +
            '<div class="cart-foot" id="cart-foot"></div>';
        document.body.appendChild(drawer);

        drawerOverlay = document.createElement('div');
        drawerOverlay.className = 'drawer-overlay';
        document.body.appendChild(drawerOverlay);

        drawer.querySelector('.cart-close').addEventListener('click', closeCart);
        drawerOverlay.addEventListener('click', closeCart);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeCart();
        });
    }

    function renderCartDrawer() {
        buildCartDrawer();
        var list = $('#cart-items', drawer);
        var foot = $('#cart-foot', drawer);
        list.innerHTML = '';

        if (cart.length === 0) {
            list.innerHTML =
                '<div class="cart-empty">' +
                '  <p class="big">Your cart is empty</p>' +
                '  <p>Explore the collection to find your scent.</p>' +
                '  <p style="margin-top:18px"><a class="btn btn-primary" href="productpage.html">Browse products</a></p>' +
                '</div>';
            foot.innerHTML = '';
            return;
        }

        cart.forEach(function (item, idx) {
            var row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML =
                '<img src="' + item.img + '" alt="">' +
                '<div>' +
                '  <div class="ci-name">' + item.name + '</div>' +
                '  <div class="ci-variant">' + item.variant + '</div>' +
                '  <div class="qty-row">' +
                '    <button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button>' +
                '    <span class="qty-val">' + item.qty + '</span>' +
                '    <button type="button" data-act="inc" aria-label="Increase quantity">+</button>' +
                '  </div>' +
                '</div>' +
                '<div class="ci-right">' +
                '  <span class="ci-price">' + rupiah(item.price * item.qty) + '</span>' +
                '  <button type="button" class="ci-remove" data-act="rm">Remove</button>' +
                '</div>';

            row.querySelector('[data-act="inc"]').addEventListener('click', function () { setQty(idx, item.qty + 1); });
            row.querySelector('[data-act="dec"]').addEventListener('click', function () { setQty(idx, item.qty - 1); });
            row.querySelector('[data-act="rm"]').addEventListener('click', function () { removeItem(idx); });
            list.appendChild(row);
        });

        foot.innerHTML =
            '<div class="cart-total-row">' +
            '  <span class="label">Subtotal</span>' +
            '  <span class="amount">' + rupiah(cartTotal()) + '</span>' +
            '</div>' +
            '<button class="btn btn-primary btn-block" id="checkout-btn" type="button">Order via WhatsApp</button>' +
            '<p class="cart-note">Checkout is handled through WhatsApp — no account needed.</p>';

        $('#checkout-btn').addEventListener('click', checkoutWhatsApp);
    }

    function openCart() {
        renderCartDrawer();
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        var closeBtn = drawer.querySelector('.cart-close');
        if (closeBtn) closeBtn.focus();
    }

    function closeCart() {
        if (!drawer) return;
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function checkoutWhatsApp() {
        if (cart.length === 0) return;
        var lines = ['Hello SaffCoz! I would like to order:', ''];
        cart.forEach(function (i) {
            lines.push('- ' + i.name + ' (' + i.variant + ') x' + i.qty + ' — ' + rupiah(i.price * i.qty));
        });
        lines.push('');
        lines.push('Total: ' + rupiah(cartTotal()));
        var url = 'https://wa.me/6281234567890?text=' + encodeURIComponent(lines.join('\n'));
        window.open(url, '_blank', 'noopener');
        toast('Opening WhatsApp with your order…');
    }

    /* ---------- wishlist ---------- */

    var wishlist = storeGet(LS_WISH, []);

    function saveWish() { storeSet(LS_WISH, wishlist); }

    function inWishlist(id) { return wishlist.indexOf(id) !== -1; }

    function toggleWishlist(id, name) {
        var idx = wishlist.indexOf(id);
        if (idx === -1) {
            wishlist.push(id);
            toast('Saved to wishlist — ' + name);
        } else {
            wishlist.splice(idx, 1);
            toast('Removed from wishlist' + (name ? ' — ' + name : ''));
        }
        saveWish();
        syncWishButtons();
    }

    function syncWishButtons() {
        $all('.wish-btn').forEach(function (b) {
            var id = b.getAttribute('data-id');
            b.classList.toggle('active', inWishlist(id));
            b.setAttribute('aria-label', inWishlist(id) ? 'Remove from wishlist' : 'Add to wishlist');
            b.setAttribute('aria-pressed', inWishlist(id) ? 'true' : 'false');
        });
        $all('.nav-wish-count').forEach(function (el) {
            el.textContent = wishlist.length;
            el.classList.toggle('show', wishlist.length > 0);
        });
    }

    /* ---------- product modal ---------- */

    var modalTpl =
        '<div class="modal-overlay" id="product-modal" role="dialog" aria-modal="true" aria-label="Product details">' +
        '  <div class="modal">' +
        '    <button class="modal-close" type="button" aria-label="Close">&times;</button>' +
        '    <div class="modal-body">' +
        '      <div class="modal-media"><img id="pm-img" src="" alt=""></div>' +
        '      <div class="modal-content">' +
        '        <p class="product-brand" id="pm-brand"></p>' +
        '        <h2 id="pm-name"></h2>' +
        '        <div class="product-price" id="pm-price"></div>' +
        '        <p class="desc" id="pm-desc"></p>' +
        '        <div class="notes-block" id="pm-notes"></div>' +
        '        <span class="variant-label">Size</span>' +
        '        <div class="variant-row" id="pm-variants"></div>' +
        '        <div class="modal-cta">' +
        '          <button class="btn btn-primary" id="pm-add" type="button">Add to Cart</button>' +
        '          <button class="btn btn-outline" id="pm-wish" type="button">Wishlist</button>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    var currentProduct = null;
    var currentVariant = null;

    function openProductModal(p) {
        currentProduct = p;
        var overlay = $('#product-modal');
        if (!overlay) {
            var wrap = document.createElement('div');
            wrap.innerHTML = modalTpl;
            overlay = wrap.firstElementChild;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeModal();
            });
            overlay.querySelector('.modal-close').addEventListener('click', closeModal);
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeModal();
            });
        }

        $('#pm-img').src = p.img;
        $('#pm-img').alt = p.name;
        $('#pm-brand').textContent = p.brand;
        $('#pm-name').textContent = p.name;
        $('#pm-desc').textContent = p.description;

        var priceEl = $('#pm-price');
        priceEl.innerHTML = '';
        var now = document.createElement('span');
        now.className = p.oldPrice ? 'price-sale' : 'price-now';
        now.textContent = rupiah(p.price);
        priceEl.appendChild(now);
        if (p.oldPrice) {
            var old = document.createElement('span');
            old.className = 'price-old';
            old.textContent = rupiah(p.oldPrice);
            priceEl.appendChild(old);
        }

        var notes = $('#pm-notes');
        notes.innerHTML = '<h4>Fragrance Notes</h4>';
        ['top', 'middle', 'base'].forEach(function (k) {
            if (p.notes && p.notes[k]) {
                var line = document.createElement('p');
                line.textContent = k.charAt(0).toUpperCase() + k.slice(1) + ': ' + p.notes[k];
                notes.appendChild(line);
            }
        });

        var vRow = $('#pm-variants');
        vRow.innerHTML = '';
        p.variants.forEach(function (v, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'variant-btn';
            b.textContent = v;
            b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
            b.addEventListener('click', function () {
                $all('.variant-btn', vRow).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
                b.setAttribute('aria-pressed', 'true');
                currentVariant = v;
            });
            vRow.appendChild(b);
        });
        currentVariant = p.variants[0];

        var addBtn = $('#pm-add');
        addBtn.onclick = function () {
            addToCart({
                id: p.id,
                variant: currentVariant,
                name: p.name,
                price: p.price,
                img: p.img
            });
            closeModal();
        };

        var wishBtn = $('#pm-wish');
        wishBtn.onclick = function () {
            toggleWishlist(p.id, p.name);
            wishBtn.textContent = inWishlist(p.id) ? 'In Wishlist ✓' : 'Wishlist';
        };
        wishBtn.textContent = inWishlist(p.id) ? 'In Wishlist ✓' : 'Wishlist';

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.modal-close').focus();
    }

    function closeModal() {
        var overlay = $('#product-modal');
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* ---------- navbar ---------- */

    function initNav() {
        var toggle = $('.nav-toggle');
        var links = $('.nav-links');
        if (toggle && links) {
            toggle.addEventListener('click', function () {
                var open = links.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            // close menu when a link is clicked (mobile)
            links.addEventListener('click', function (e) {
                if (e.target.closest('a')) {
                    links.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // current page marker
        var page = location.pathname.split('/').pop() || 'homepage.html';
        $all('.nav-links a').forEach(function (a) {
            var href = a.getAttribute('href').split('/').pop();
            if (href === page) a.setAttribute('aria-current', 'page');
        });

        // cart buttons
        var cartBtn = $('.nav-cart-btn');
        if (cartBtn) cartBtn.addEventListener('click', openCart);

        // wishlist hearts — event delegation so dynamically rendered cards work too
        document.addEventListener('click', function (e) {
            var b = e.target.closest('.wish-btn[data-id]');
            if (!b) return;
            e.preventDefault();
            toggleWishlist(b.getAttribute('data-id'), b.getAttribute('data-name'));
        });
    }

    /* ---------- public API ---------- */

    window.SaffCoz = {
        toast: toast,
        rupiah: rupiah,
        addToCart: addToCart,
        openCart: openCart,
        openProductModal: openProductModal,
        inWishlist: inWishlist,
        toggleWishlist: toggleWishlist,
        syncWishButtons: syncWishButtons
    };

    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        renderCartBadge();
        syncWishButtons();
    });
})();

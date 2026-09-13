/* SaffCoz — about page: wishlist section + signature scent modals */
(function () {
    'use strict';

    // Signature scents shown on this page map to modal data; extras live only here.
    var LOCAL_PRODUCTS = {
        sotb: {
            id: 'sotb',
            brand: 'SaffCoz',
            name: 'SaffCoz. — S.O.T.B',
            price: 380000,
            img: 'asset/aboutus/9e3284917896ff9c4d1ba4db57ffdd83.jpg',
            variants: ['50 ml'],
            gender: 'unisex',
            description: 'Sophisticated and refined, with notes of luxurious spices and subtle floral undertones — elegance and warmth that lingers without overwhelming.',
            notes: { top: 'Saffron, Pink Pepper', middle: 'Rose, Jasmine', base: 'Amber, Sandalwood' }
        },
        minouet: {
            id: 'minouet',
            brand: 'SaffCoz',
            name: 'SaffCoz. — MINOUET',
            price: 240000,
            img: 'asset/aboutus/minouet.jpeg',
            variants: ['50 ml'],
            gender: 'unisex',
            description: 'A delicate, fresh fragrance combining soft florals with a hint of citrus — grace and lightness for understated, captivating moments.',
            notes: { top: 'Bergamot, Lemon', middle: 'White Florals', base: 'White Musk' }
        },
        maleali: {
            id: 'maleali',
            brand: 'SaffCoz',
            name: 'SaffCoz. — MALEALI',
            price: 225000,
            oldPrice: 450000,
            img: 'asset/aboutus/id-11134207-7r98x-lpf0ard41d3nf9.jpg',
            variants: ['50 ml'],
            gender: 'unisex',
            description: 'A bold, modern scent blending woody and musky notes with a touch of sweetness — contemporary and memorable.',
            notes: { top: 'Bergamot', middle: 'Cedarwood, Jasmine', base: 'Musk, Vanilla' }
        }
    };

    function allProducts() {
        return window.SAFFCOZ_PRODUCTS.concat(Object.keys(LOCAL_PRODUCTS).map(function (k) { return LOCAL_PRODUCTS[k]; }));
    }

    function byId(id) {
        return allProducts().filter(function (p) { return p.id === id; })[0];
    }

    function wishCard(p) {
        var priceHtml = p.oldPrice
            ? '<span class="price-sale">' + SaffCoz.rupiah(p.price) + '</span><span class="price-old">' + SaffCoz.rupiah(p.oldPrice) + '</span>'
            : '<span class="price-now">' + SaffCoz.rupiah(p.price) + '</span>';
        return (
            '<article class="product-card">' +
            '  <div class="product-media" data-open="' + p.id + '" role="button" tabindex="0" aria-label="View details for ' + p.name + '">' +
            '    <button class="wish-btn active" type="button" data-id="' + p.id + '" data-name="' + p.name + '" aria-label="Remove ' + p.name + ' from wishlist" aria-pressed="true">' +
            '      <svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.7-9C.8 9 2.4 5.5 5.7 5.1c2-.3 3.9.8 4.8 2.5h3c.9-1.7 2.8-2.8 4.8-2.5 3.3.4 4.9 3.9 3.4 6.9-2.2 4.3-9.7 9-9.7 9z" stroke-linejoin="round"/></svg>' +
            '      <svg class="heart-fill" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.7-9C.8 9 2.4 5.5 5.7 5.1c2-.3 3.9.8 4.8 2.5h3c.9-1.7 2.8-2.8 4.8-2.5 3.3.4 4.9 3.9 3.4 6.9-2.2 4.3-9.7 9-9.7 9z"/></svg>' +
            '    </button>' +
            '    <img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
            '  </div>' +
            '  <div class="product-info">' +
            '    <p class="product-brand">' + p.brand + '</p>' +
            '    <h3 class="product-name">' + p.name + '</h3>' +
            '    <div class="product-price">' + priceHtml + '</div>' +
            '  </div>' +
            '  <div class="card-actions">' +
            '    <button class="btn btn-primary" type="button" data-open="' + p.id + '">View</button>' +
            '  </div>' +
            '</article>'
        );
    }

    function renderWishlist() {
        var grid = document.getElementById('wishlist-grid');
        var empty = document.getElementById('wishlist-empty');
        if (!grid) return;

        var ids = [];
        try { ids = JSON.parse(localStorage.getItem('saffcoz_wishlist_v1') || '[]'); } catch (e) {}

        var items = ids.map(byId).filter(Boolean);
        grid.innerHTML = items.map(wishCard).join('');
        grid.hidden = items.length === 0;
        empty.hidden = items.length !== 0;

        document.querySelectorAll('#wishlist [data-open]').forEach(function (el) {
            var pid = el.getAttribute('data-open');
            function open() {
                var p = byId(pid);
                if (p) SaffCoz.openProductModal(p);
            }
            el.addEventListener('click', function (e) {
                if (e.target.closest('.wish-btn')) return;
                open();
            });
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });

        SaffCoz.syncWishButtons();
    }

    document.addEventListener('DOMContentLoaded', function () {
        // wire signature scent cards (static HTML) to modals
        document.querySelectorAll('[data-open]').forEach(function (el) {
            var pid = el.getAttribute('data-open');
            function open() {
                var p = byId(pid);
                if (p) SaffCoz.openProductModal(p);
            }
            el.addEventListener('click', function (e) {
                if (e.target.closest('.wish-btn')) return;
                open();
            });
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });

        renderWishlist();

        // re-render wishlist when a heart is toggled anywhere on the page
        document.addEventListener('click', function (e) {
            if (e.target.closest('.wish-btn')) {
                setTimeout(renderWishlist, 50);
            }
        });
    });
})();

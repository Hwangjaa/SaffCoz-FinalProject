/* SaffCoz — homepage rendering */
(function () {
    'use strict';

    function productCard(p) {
        var tags = '';
        if (p.badge === 'new') tags = '<span class="tag new">New</span>';
        if (p.badge === 'sale') tags = '<span class="tag sale">Sale</span>';
        if (p.badge === 'best') tags = '<span class="tag">Best Seller</span>';

        var priceHtml = '';
        if (p.oldPrice) {
            priceHtml = '<span class="price-sale">' + SaffCoz.rupiah(p.price) + '</span>' +
                        '<span class="price-old">' + SaffCoz.rupiah(p.oldPrice) + '</span>';
        } else {
            priceHtml = '<span class="price-now">' + SaffCoz.rupiah(p.price) + '</span>';
        }

        return (
            '<article class="product-card">' +
            '  <div class="product-media" data-open="' + p.id + '" role="button" tabindex="0" aria-label="View details for ' + p.name + '">' +
            '    <div class="product-tags">' + tags + '</div>' +
            '    <button class="wish-btn" type="button" data-id="' + p.id + '" data-name="' + p.name + '" aria-label="Add ' + p.name + ' to wishlist" aria-pressed="false">' +
            '      <svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.7-9C.8 9 2.4 5.5 5.7 5.1c2-.3 3.9.8 4.8 2.5h3c.9-1.7 2.8-2.8 4.8-2.5 3.3.4 4.9 3.9 3.4 6.9-2.2 4.3-9.7 9-9.7 9z" stroke-linejoin="round"/></svg>' +
            '      <svg class="heart-fill" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.7-9.7-9C.8 9 2.4 5.5 5.7 5.1c2-.3 3.9.8 4.8 2.5h3c.9-1.7 2.8-2.8 4.8-2.5 3.3.4 4.9 3.9 3.4 6.9-2.2 4.3-9.7 9-9.7 9z"/></svg>' +
            '    </button>' +
            '    <img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
            '  </div>' +
            '  <div class="product-info">' +
            '    <p class="product-brand">' + p.brand + '</p>' +
            '    <h3 class="product-name"><a href="productpage.html?p=' + p.id + '">' + p.name + '</a></h3>' +
            '    <div class="product-price">' + priceHtml + '</div>' +
            '  </div>' +
            '  <div class="card-actions">' +
            '    <button class="btn btn-primary" type="button" data-open="' + p.id + '">View</button>' +
            '  </div>' +
            '</article>'
        );
    }

    function byId(id) {
        return window.SAFFCOZ_PRODUCTS.filter(function (p) { return p.id === id; })[0];
    }

    document.addEventListener('DOMContentLoaded', function () {
        var newGrid = document.getElementById('new-arrivals-grid');
        var allGrid = document.getElementById('all-products-grid');
        if (!newGrid || !allGrid) return;

        var products = window.SAFFCOZ_PRODUCTS;
        var arrivals = ['saffcozsaff', 'laspozaz', 'troupe'].map(function (id) { return byId(id); })
            .filter(Boolean);

        // New arrivals use dedicated imagery not present in the catalogue —
        // build display-only cards for them.
        if (arrivals.length === 0) {
            arrivals = [
                { id: 'x-saff', brand: 'SaffCoz', name: 'SaffCoz. — SAFF', price: 215500, img: 'asset/homepage/saffcozsaff.jpeg', badge: 'new' },
                { id: 'x-lasp', brand: 'SaffCoz', name: 'SaffCoz. — Laspozaz', price: 320000, img: 'asset/homepage/laspozaz.jpeg', badge: 'new' },
                { id: 'x-trp', brand: 'SaffCoz', name: 'SaffCoz. — Troupe', price: 410000, img: 'asset/homepage/troupe.jpeg', badge: 'new' }
            ];
        }

        newGrid.innerHTML = arrivals.map(function (p) { return productCard(p); }).join('');
        allGrid.innerHTML = products.map(function (p) { return productCard(p); }).join('');

        // wire open buttons
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

        SaffCoz.syncWishButtons();
    });
})();

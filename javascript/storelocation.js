/* SaffCoz — store page: map switcher */
(function () {
    'use strict';

    var STORES = {
        kemanggisan: {
            img: 'asset/location/BINUS Kemanggisan.jpg',
            alt: 'Map showing the SaffCoz BINUS Kemanggisan boutique location',
            maps: 'https://www.google.com/maps/search/?api=1&query=BINUS+University+Kemanggisan'
        },
        bandung: {
            img: 'asset/location/BINUS Bandung.jpg',
            alt: 'Map showing the SaffCoz BINUS Bandung boutique location',
            maps: 'https://www.google.com/maps/search/?api=1&query=BINUS+University+Bandung'
        },
        malang: {
            img: 'asset/location/BINUS Malang.jpg',
            alt: 'Map showing the SaffCoz BINUS Malang boutique location',
            maps: 'https://www.google.com/maps/search/?api=1&query=BINUS+University+Malang'
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        var map = document.getElementById('store-map');
        var link = document.getElementById('map-link');
        if (!map) return;

        document.querySelectorAll('.store-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var key = btn.getAttribute('data-store');
                var s = STORES[key];
                if (!s) return;

                document.querySelectorAll('.store-item').forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                map.style.opacity = '0.35';
                map.src = s.img;
                map.alt = s.alt;
                link.href = s.maps;

                setTimeout(function () { map.style.opacity = '1'; }, 180);
            });
        });

        map.style.transition = 'opacity 0.25s ease';
    });
})();

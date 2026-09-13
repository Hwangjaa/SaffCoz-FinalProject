/* SaffCoz — product catalogue (single source of truth) */
(function () {
    'use strict';

    window.SAFFCOZ_PRODUCTS = [
        {
            id: 'saff',
            brand: 'SaffCoz',
            name: 'SaffCoz Extrait de Parfum — SAFF',
            price: 215500,
            img: 'asset/productpage/saff-co-1850-9815093-3.jpeg',
            badge: 'new',
            gender: 'unisex',
            variants: ['50 ml'],
            description: 'SaffCoz Extrait de Parfum — SAFF is a luxurious and refined fragrance that embodies elegance and sophistication. Rich, warm notes with a touch of sweetness create a captivating, long-lasting scent.',
            notes: {
                top: 'Bergamot, Saffron',
                middle: 'Jasmine, Rose',
                base: 'Amber, Musk, Oud'
            }
        },
        {
            id: 'sauvage',
            brand: 'Dion',
            name: 'Dion Sauvage Elixir',
            price: 1340000,
            oldPrice: 2990000,
            img: 'asset/productpage/christian-dior-5709-7809932-1.jpeg',
            badge: 'sale',
            gender: 'men',
            variants: ['100 ml', '50 ml', '10 ml'],
            description: 'Dion Sauvage is a bold and luxurious fragrance that exudes intensity and sophistication. Perfect for the confident man, this fragrance leaves a powerful and refined impression.',
            notes: {
                top: 'Grapefruit, Cinnamon',
                middle: 'Lavender, Nutmeg',
                base: 'Amberwood, Sandalwood, Patchouli, Tonka Bean'
            }
        },
        {
            id: 'coolwater',
            brand: 'Davidon',
            name: 'Davidon Cool Water Man',
            price: 780000,
            img: 'asset/productpage/davidoff-0846-7354993-1.jpeg',
            gender: 'men',
            variants: ['100 ml', '50 ml'],
            description: 'Davidon Cool Water Man is a fresh and invigorating fragrance that captures the essence of the ocean breeze — a balance of freshness and strength, ideal for everyday wear.',
            notes: {
                top: 'Mint, Coriander, Lavender',
                middle: 'Geranium, Neroli, Jasmine',
                base: 'Amber, Musk, Tobacco'
            }
        },
        {
            id: 'vipblack',
            brand: 'Motorolina Hisrera',
            name: '212 VIP Black Man EDP',
            price: 1374000,
            badge: 'best',
            gender: 'men',
            variants: ['100 ml'],
            description: '212 VIP Black Man by Motorolina Hisrera is a bold and captivating fragrance for the modern man who thrives in the spotlight — perfect for nightlife and special occasions.',
            notes: {
                top: 'Anise, Absinthe',
                middle: 'Fennel, Lavender',
                base: 'Musk, Black Vanilla, Amber'
            }
        },
        {
            id: 'bvlgari',
            brand: 'Bullgarry',
            name: 'Bullgarry Pour Homme Man',
            price: 1648000,
            badge: 'new',
            gender: 'men',
            variants: ['100 ml'],
            description: 'A timeless and sophisticated fragrance with a refined woody composition — classic luxury for the modern man, ideal for day and evening wear.',
            notes: {
                top: 'Mint, Coriander, Lavender',
                middle: 'Geranium, Neroli, Jasmine',
                base: 'Amber, Musk, Tobacco'
            }
        },
        {
            id: 'jasmine',
            brand: 'Bullgarry',
            name: 'Jasmine Noir Pour Femme',
            price: 285000,
            oldPrice: 899000,
            img: 'asset/productpage/fragrance-world-5870-8530844-1.jpeg',
            badge: 'sale',
            gender: 'women',
            variants: ['100 ml', '50 ml'],
            description: 'Jasmin Noir Pour Femme by Bullgarry is an elegant and mysterious fragrance — deep floral and woody notes for a woman who exudes confidence. Ideal for evening wear.',
            notes: {
                top: 'Gardenia, Green Notes',
                middle: 'Jasmine, Almond',
                base: 'Licorice, Tonka Bean, Woods'
            }
        }
    ];

    // images that live in asset/productpage only — map for homepage reuse
    window.SAFFCOZ_IMG = {
        saff: 'asset/productpage/saff-co-1850-9815093-3.jpeg',
        sauvage: 'asset/productpage/christian-dior-5709-7809932-1.jpeg',
        coolwater: 'asset/productpage/davidoff-0846-7354993-1.jpeg',
        vipblack: 'asset/productpage/carolina-herrera-7538-2375174-2.jpeg',
        bvlgari: 'asset/productpage/bvlgari-2276-9256244-1.jpeg',
        jasmine: 'asset/productpage/fragrance-world-5870-8530844-1.jpeg'
    };

    window.SAFFCOZ_PRODUCTS.forEach(function (p) {
        if (!p.img) p.img = (window.SAFFCOZ_IMG[p.id] || '');
    });
})();

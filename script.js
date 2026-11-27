document.addEventListener('DOMContentLoaded', () => {
    // MOBILNI MENU (HAMBURGER)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    function resetHamburgerIcon() {
        if (!hamburgerBtn) return;
        const icon = hamburgerBtn.querySelector('i');
        if (!icon) return;
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            const icon = hamburgerBtn.querySelector('i');
            if (!icon) return;
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // DROPDOWN KATEGORIJE
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdown = categoriesBtn ? categoriesBtn.parentElement : null;

    if (categoriesBtn && dropdown) {
        categoriesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // MODALI (KORPA, PRIJAVA I REGISTRACIJA)
    const cartBtn = document.getElementById('cartBtn');
    const loginBtn = document.getElementById('loginBtn');

    const cartModal = document.getElementById('cartModal');
    const loginModal = document.getElementById('loginModal');
    const authModalContent = document.getElementById('authModalContent');

    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');

    const closeCart = document.getElementById('closeCart');
    const closeLogin = document.getElementById('closeLogin');
    const continueShopping = document.getElementById('continueShopping');

    function showLoginView() {
        if (registerView) registerView.classList.add('hidden');
        if (loginView) loginView.classList.remove('hidden');
        if (authModalContent) authModalContent.classList.remove('register-wide');
        if (registerError) registerError.textContent = '';
    }

    function showRegisterView() {
        if (loginView) loginView.classList.add('hidden');
        if (registerView) registerView.classList.remove('hidden');
        if (authModalContent) authModalContent.classList.add('register-wide');
        if (registerError) registerError.textContent = '';
    }

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
            if (navMenu) navMenu.classList.remove('active');
            resetHamburgerIcon();
        });
    }

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginView();
            loginModal.classList.add('active');
            if (navMenu) navMenu.classList.remove('active');
            resetHamburgerIcon();
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterView();
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginView();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('regPassword')?.value ?? '';
            const confirmPassword = document.getElementById('regConfirmPassword')?.value ?? '';

            if (password !== confirmPassword) {
                if (registerError) registerError.textContent = 'Šifre se ne podudaraju.';
                return;
            }

            if (registerError) registerError.textContent = '';
            registerForm.reset();
            showLoginView();
            alert('Nalog je uspešno kreiran! Sada se možete prijaviti.');
        });
    }

    if (loginForm && loginModal) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginForm.reset();
            loginModal.classList.remove('active');
        });
    }

    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    }

    if (closeLogin && loginModal) {
        closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));
    }

    if (continueShopping && cartModal) {
        continueShopping.addEventListener('click', () => cartModal.classList.remove('active'));
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('modal-overlay')) {
            if (cartModal) cartModal.classList.remove('active');
            if (loginModal) loginModal.classList.remove('active');
        }
    });
});


/* ==================================================
   KONTAKT STRANICA - INTERAKTIVNA MAPA
   ================================================== */

const contactLocations = [
    {
        city: 'Beograd',
        address: 'Bulevar kralja Aleksandra 100, Beograd',
        lat: 44.8055,
        lng: 20.4751
    },
    {
        city: 'Novi Sad',
        address: 'Bulevar oslobođenja 30, Novi Sad',
        lat: 45.2517,
        lng: 19.8335
    },
    {
        city: 'Niš',
        address: 'Obrenovićeva 12, Niš',
        lat: 43.3192,
        lng: 21.8958
    }
];

let contactMap = null;
const contactMarkers = [];

function selectContactLocation(index, moveMap = true) {
    const location = contactLocations[index];
    if (!location) return;

    const items = document.querySelectorAll('.contact-location-item');
    items.forEach((item) => item.classList.remove('active'));
    if (items[index]) items[index].classList.add('active');

    const addressEl = document.getElementById('contactAddress');
    if (addressEl) addressEl.textContent = location.address;

    const directionsEl = document.getElementById('contactDirections');
    if (directionsEl) {
        directionsEl.href =
            'https://www.google.com/maps/search/?api=1&query=' +
            encodeURIComponent(location.address + ', Srbija');
    }

    if (!contactMap) return;

    if (moveMap) {
        contactMap.flyTo([location.lat, location.lng], 15, { duration: 1.2 });
    }

    if (contactMarkers[index]) {
        contactMarkers[index].openPopup();
    }
}

function initializeContactMap() {
    const mapElement = document.getElementById('contactMap');
    if (!mapElement || typeof L === 'undefined' || contactMap) return;

    contactMap = L.map('contactMap').setView(
        [contactLocations[0].lat, contactLocations[0].lng],
        15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(contactMap);

    contactLocations.forEach((location, index) => {
        const marker = L.marker([location.lat, location.lng]).addTo(contactMap);
        marker.bindPopup(`<b>${location.city}</b><br>${location.address}`);
        marker.on('click', () => {
            selectContactLocation(index, false);
        });
        contactMarkers.push(marker);
    });

    if (contactMarkers[0]) {
        contactMarkers[0].openPopup();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactMap);
} else {
    initializeContactMap();
}

const contactForm = document.getElementById('contactMessageForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Hvala na poruci! Uspešno ste popunili kontakt formu.');
        contactForm.reset();
    });
}


/* ==================================================
   BELATEHNIKA - SISTEM NOVIH PROIZVODA I KORPE
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btCategories = [
        {
            name: 'Šporeti',
            description: 'Najnoviji modeli za jednostavnije svakodnevno kuvanje.',
            color: '#fff9e9',
            products: [
                ['Beko FSE62110DW', 42990, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500'],
                ['Gorenje GKS5C70WF', 58990, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
                ['Bosch HKS59D250', 84990, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500'],
                ['Electrolux LKK660220W', 71990, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500']
            ]
        },
        {
            name: 'Veš mašine',
            description: 'Tiho i efikasno pranje uz pametne programe.',
            color: '#e5f8fc',
            products: [
                ['Bosch WAN28266BY', 64990, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500'],
                ['Samsung WW80T554DAW', 67990, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500'],
                ['LG F4WV309S3E', 72990, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500'],
                ['Gorenje WNEI84AS', 49990, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500']
            ]
        },
        {
            name: 'Mašine za pranje sudova',
            description: 'Besprekorno čisto posuđe uz manju potrošnju vode.',
            color: '#e8efff',
            products: [
                ['Bosch SMS4HVI45E', 78990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Beko BDFN26430X', 54990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Gorenje GV663C60', 62990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Electrolux ESA47210SX', 69990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500']
            ]
        },
        {
            name: 'Frižideri',
            description: 'Više prostora i duža svežina vaših namirnica.',
            color: '#dff9f2',
            products: [
                ['Gorenje NRK6192AXL4', 71990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Bosch KGN36VLED', 89990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Samsung RB34C600ESA', 79990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Beko RCNA366K40WN', 57990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500']
            ]
        },
        {
            name: 'Zamrzivači',
            description: 'Pouzdano čuvanje namirnica tokom cele godine.',
            color: '#f4eaff',
            products: [
                ['Beko RFSA240M43WN', 48990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Gorenje FN619EAW6', 64990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Liebherr Fe 1404', 55990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
                ['Bosch GSN33VWEP', 82990, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500']
            ]
        }
    ];

    const catalog = document.getElementById('btProductCatalog');
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartBtn');

    if (!catalog || !cartModal || !cartButton) return;

    function readCart() {
        try {
            const raw = localStorage.getItem('btCart');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveCart(cartItems) {
        localStorage.setItem('btCart', JSON.stringify(cartItems));
    }

    let btCart = readCart();

    function btFormatPrice(price) {
        return Number(price).toLocaleString('sr-RS');
    }

    function btRenderProducts() {
        catalog.innerHTML = btCategories.map((category, categoryIndex) => `
            <section class="bt-product-category">
                <div class="bt-category-heading">
                    <div>
                        <h2>${category.name}</h2>
                        <p>${category.description}</p>
                    </div>
                    <span class="bt-category-new">NOVO</span>
                </div>
                <div class="bt-product-grid">
                    ${category.products.map((product, productIndex) => `
                        <article class="bt-product-card">
                            <div class="bt-product-image" style="background:${category.color}">
                                <span class="bt-product-badge">Novo #${productIndex + 1}</span>
                                <img src="${product[2]}" alt="${product[0]}" loading="lazy">
                            </div>
                            <div class="bt-product-info">
                                <span class="bt-product-type">${category.name.toUpperCase()}</span>
                                <h3 class="bt-product-name">${product[0]}</h3>
                                <div class="bt-product-bottom">
                                    <span class="bt-product-price">
                                        ${btFormatPrice(product[1])}
                                        <small>RSD</small>
                                    </span>
                                    <button
                                        class="bt-add-cart"
                                        data-category="${categoryIndex}"
                                        data-product="${productIndex}"
                                        aria-label="Dodaj u korpu">
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </button>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join('');
    }

    function btNotification(productName) {
        let notification = document.getElementById('btCartNotification');

        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'btCartNotification';
            notification.className = 'bt-cart-notification';
            document.body.appendChild(notification);
        }

        notification.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            ${productName} je dodat u korpu!
        `;

        notification.classList.add('bt-show');

        clearTimeout(window.btNotificationTimer);
        window.btNotificationTimer = setTimeout(() => {
            notification.classList.remove('bt-show');
        }, 2500);
    }

    function btUpdateCart() {
        const cartBody = cartModal.querySelector('.modal-body');
        const cartFooter = cartModal.querySelector('.modal-footer');

        const total = btCart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const count = btCart.reduce((sum, item) => sum + Number(item.quantity), 0);

        cartButton.textContent = `Korpa (${count})`;

        if (cartBody) {
            if (btCart.length === 0) {
                cartBody.className = 'modal-body empty-cart';
                cartBody.innerHTML = `
                    <p class="empty-title">Korpa je prazna</p>
                    <p class="empty-text">
                        Dodajte proizvode u korpu i oni će se pojaviti ovde.
                    </p>
                `;
            } else {
                cartBody.className = 'modal-body';
                cartBody.innerHTML = `
                    <div class="bt-existing-cart">
                        ${btCart.map((item, index) => `
                            <div class="bt-existing-cart-item">
                                <div>
                                    <h3>${item.name}</h3>
                                    <p>${btFormatPrice(item.price)} RSD</p>
                                    <span>Količina: ${item.quantity}</span>
                                </div>
                                <button
                                    class="bt-remove-cart-item"
                                    data-index="${index}"
                                    aria-label="Ukloni proizvod">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }

        if (cartFooter) {
            let totalElement = document.getElementById('btCartTotal');
            if (!totalElement) {
                totalElement = document.createElement('div');
                totalElement.id = 'btCartTotal';
                cartFooter.insertBefore(totalElement, cartFooter.firstChild);
            }

            totalElement.innerHTML = `
                <strong>Ukupno:</strong>
                <span>${btFormatPrice(total)} RSD</span>
            `;
            totalElement.style.display = btCart.length > 0 ? 'flex' : 'none';
        }
    }

    function btAddToCart(categoryIndex, productIndex) {
        const product = btCategories[categoryIndex]?.products[productIndex];
        if (!product) return;

        const existing = btCart.find((item) => item.name === product[0]);
        if (existing) {
            existing.quantity += 1;
        } else {
            btCart.push({
                name: product[0],
                price: product[1],
                quantity: 1
            });
        }

        saveCart(btCart);
        btUpdateCart();
        btNotification(product[0]);
    }

    function btRemoveFromCart(index) {
        if (index < 0 || index >= btCart.length) return;
        btCart.splice(index, 1);
        saveCart(btCart);
        btUpdateCart();
    }

    catalog.addEventListener('click', (event) => {
        const button = event.target.closest('.bt-add-cart');
        if (!button) return;

        const categoryIndex = Number(button.dataset.category);
        const productIndex = Number(button.dataset.product);
        btAddToCart(categoryIndex, productIndex);
    });

    cartModal.addEventListener('click', (event) => {
        const button = event.target.closest('.bt-remove-cart-item');
        if (!button) return;

        const index = Number(button.dataset.index);
        btRemoveFromCart(index);
    });

    btRenderProducts();
    btUpdateCart();
});
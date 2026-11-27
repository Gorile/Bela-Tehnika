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
            updateSharedCart();
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

    if (continueShopping && cartModal) {
        continueShopping.addEventListener('click', () => cartModal.classList.remove('active'));
    }

    if (closeLogin && loginModal) {
        closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('modal-overlay')) {
            if (cartModal) cartModal.classList.remove('active');
            if (loginModal) loginModal.classList.remove('active');
        }
    });

    // SINHRONIZACIJA KORPE IZMEĐU STRANICA
    function readCartFromStorage() {
        try {
            const raw = localStorage.getItem('btCart');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeCartToStorage(cartItems) {
        localStorage.setItem('btCart', JSON.stringify(cartItems));
    }

    function updateSharedCart() {
        if (!cartBtn || !cartModal) return;

        const btCart = readCartFromStorage();
        const count = btCart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const total = btCart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

        cartBtn.textContent = `Korpa (${count})`;

        const cartBody = cartModal.querySelector('.modal-body');
        const cartFooter = cartModal.querySelector('.modal-footer');

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
                cartBody.innerHTML = btCart.map((item, index) => `
                    <div class="bt-existing-cart-item">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${Number(item.price).toLocaleString('sr-RS')} RSD</p>
                            <span>Količina: ${item.quantity}</span>
                        </div>
                        <button class="bt-remove-cart-item" data-index="${index}" aria-label="Ukloni proizvod">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `).join('');
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
                <span>${total.toLocaleString('sr-RS')} RSD</span>
            `;
            totalElement.style.display = btCart.length > 0 ? 'flex' : 'none';
        }
    }

    if (cartModal) {
        cartModal.addEventListener('click', (event) => {
            const removeButton = event.target.closest('.bt-remove-cart-item');
            if (!removeButton) return;

            const index = Number(removeButton.dataset.index);
            const btCart = readCartFromStorage();
            if (index >= 0 && index < btCart.length) {
                btCart.splice(index, 1);
                writeCartToStorage(btCart);
                updateSharedCart();
            }
        });
    }

    // Osveži korpu ako se promeni u drugom tabu ili na drugoj stranici
    window.addEventListener('storage', (event) => {
        if (event.key === 'btCart') {
            updateSharedCart();
        }
    });

    updateSharedCart();

    // KONTAKT STRANICA - INTERAKTIVNA MAPA
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

    initializeContactMap();

    // KONTAKT FORMA
    const contactForm = document.getElementById('contactMessageForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Hvala na poruci! Uspešno ste popunili kontakt formu.');
            contactForm.reset();
        });
    }
});
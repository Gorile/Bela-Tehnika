document.addEventListener('DOMContentLoaded', () => {
    // MOBILNI MENU (HAMBURGER)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Promeni ikonicu iz bars u X kad je meni otvoren
        const icon = hamburgerBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // DROPDOWN KATEGORIJE
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdown = categoriesBtn.parentElement;

    categoriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Zatvori dropdown ako se klikne van njega
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

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
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
        authModalContent.classList.remove('register-wide');
        registerError.textContent = '';
    }

    function showRegisterView() {
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
        authModalContent.classList.add('register-wide');
        registerError.textContent = '';
    }

    // Otvaranje modala
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        navMenu.classList.remove('active');
        resetHamburgerIcon();
    });

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView(); // Uvek otvara prvo ekran za prijavu[cite: 1]
        loginModal.classList.add('active');
        navMenu.classList.remove('active');
        resetHamburgerIcon();
    });

    // Prebacivanje između Prijave i Registracije
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterView();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });

    // Provera i slanje forme za registraciju
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            registerError.textContent = 'Šifre se ne podudaraju.';
            return;
        }

        registerError.textContent = '';
        registerForm.reset();
        showLoginView();
        alert('Nalog je uspešno kreiran! Sada se možete prijaviti.');
    });

    // Slanje forme za prijavu
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginForm.reset();
        loginModal.classList.remove('active');
    });

    // Zatvaranje modala
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));
    continueShopping.addEventListener('click', () => cartModal.classList.remove('active'));

    // Zatvaranje modala klikom na overlay
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            cartModal.classList.remove('active');
            loginModal.classList.remove('active');
        }
    });

    // Pomoćna funkcija za vraćanje ikone hamburgera na početnu
    function resetHamburgerIcon() {
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});
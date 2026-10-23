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

    // MODALI (KORPA I PRIJAVA)
    const cartBtn = document.getElementById('cartBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    const cartModal = document.getElementById('cartModal');
    const loginModal = document.getElementById('loginModal');

    const closeCart = document.getElementById('closeCart');
    const closeLogin = document.getElementById('closeLogin');
    const continueShopping = document.getElementById('continueShopping');

    // Otvaranje modala
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        navMenu.classList.remove('active'); // Zatvori mobilni meni ako je otvoren
        resetHamburgerIcon();
    });

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
        navMenu.classList.remove('active'); // Zatvori mobilni meni ako je otvoren
        resetHamburgerIcon();
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
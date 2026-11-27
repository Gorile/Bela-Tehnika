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


/* ==================================================
   KONTAKT STRANICA - INTERAKTIVNA MAPA
   ================================================== */

   const contactLocations = [
    {
        city: "Beograd",
        address: "Bulevar kralja Aleksandra 100, Beograd",
        lat: 44.8055,
        lng: 20.4751
    },
    {
        city: "Novi Sad",
        address: "Bulevar oslobođenja 30, Novi Sad",
        lat: 45.2517,
        lng: 19.8335
    },
    {
        city: "Niš",
        address: "Obrenovićeva 12, Niš",
        lat: 43.3192,
        lng: 21.8958
    }
];

let contactMap = null;
let contactMarkers = [];

function initializeContactMap() {

    const mapElement = document.getElementById("contactMap");

    if (!mapElement || typeof L === "undefined" || contactMap) {
        return;
    }

    contactMap = L.map("contactMap").setView(
        [contactLocations[0].lat, contactLocations[0].lng],
        15
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }
    ).addTo(contactMap);

    contactLocations.forEach((location, index) => {

        const marker = L.marker([
            location.lat,
            location.lng
        ]).addTo(contactMap);

        marker.bindPopup(
            `<b>${location.city}</b><br>${location.address}`
        );

        marker.on("click", function() {
            selectContactLocation(index, false);
        });

        contactMarkers.push(marker);

    });

    contactMarkers[0].openPopup();
}


// IZBOR POSLOVNICE

function selectContactLocation(index, moveMap = true) {

    const location = contactLocations[index];

    if (!location) return;

    document.querySelectorAll(".contact-location-item")
        .forEach(item => item.classList.remove("active"));

    document.querySelectorAll(".contact-location-item")[index]
        .classList.add("active");

    document.getElementById("contactAddress").textContent =
        location.address;

    document.getElementById("contactDirections").href =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(location.address + ", Srbija");

    if (!contactMap) return;

    if (moveMap) {
        contactMap.flyTo(
            [location.lat, location.lng],
            15,
            { duration: 1.2 }
        );
    }

    contactMarkers[index].openPopup();
}


// POKRETANJE MAPE

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeContactMap
    );

} else {

    initializeContactMap();

}


// KONTAKT FORMA

const contactForm = document.getElementById("contactMessageForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Hvala na poruci! Uspešno ste popunili kontakt formu.");

        contactForm.reset();

    });

}



/* ==================================================
   BELATEHNIKA - SISTEM NOVIH PROIZVODA I KORPE
   DODATAK NA POSTOJECI JAVASCRIPT
================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // PROIZVODI PO KATEGORIJAMA

    const btCategories = [
        {
            name: "Šporeti",
            description: "Najnoviji modeli za jednostavnije svakodnevno kuvanje.",
            color: "#fff9e9",
            products: [
                ["Beko FSE62110DW", 42990, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500"],
                ["Gorenje GKS5C70WF", 58990, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"],
                ["Bosch HKS59D250", 84990, "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500"],
                ["Electrolux LKK660220W", 71990, "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500"]
            ]
        },
        {
            name: "Veš mašine",
            description: "Tiho i efikasno pranje uz pametne programe.",
            color: "#e5f8fc",
            products: [
                ["Bosch WAN28266BY", 64990, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500"],
                ["Samsung WW80T554DAW", 67990, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500"],
                ["LG F4WV309S3E", 72990, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500"],
                ["Gorenje WNEI84AS", 49990, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500"]
            ]
        },
        {
            name: "Mašine za pranje sudova",
            description: "Besprekorno čisto posuđe uz manju potrošnju vode.",
            color: "#e8efff",
            products: [
                ["Bosch SMS4HVI45E", 78990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Beko BDFN26430X", 54990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Gorenje GV663C60", 62990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Electrolux ESA47210SX", 69990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"]
            ]
        },
        {
            name: "Frižideri",
            description: "Više prostora i duža svežina vaših namirnica.",
            color: "#dff9f2",
            products: [
                ["Gorenje NRK6192AXL4", 71990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Bosch KGN36VLED", 89990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Samsung RB34C600ESA", 79990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Beko RCNA366K40WN", 57990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"]
            ]
        },
        {
            name: "Zamrzivači",
            description: "Pouzdano čuvanje namirnica tokom cele godine.",
            color: "#f4eaff",
            products: [
                ["Beko RFSA240M43WN", 48990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Gorenje FN619EAW6", 64990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Liebherr Fe 1404", 55990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"],
                ["Bosch GSN33VWEP", 82990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"]
            ]
        }
    ];


    // ELEMENTI

    const catalog = document.getElementById("btProductCatalog");

    const cartModal = document.getElementById("cartModal");

    const cartButton = document.getElementById("cartBtn");

    if (!catalog || !cartModal || !cartButton) return;


    // KORPA

    let btCart = [];


    // FORMATIRANJE CENA

    function btFormatPrice(price) {
        return price.toLocaleString("sr-RS");
    }


    // PRIKAZ PROIZVODA

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

                            <div class="bt-product-image"
                                 style="background:${category.color}">

                                <span class="bt-product-badge">
                                    Novo #${productIndex + 1}
                                </span>

                                <img
                                    src="${product[2]}"
                                    alt="${product[0]}"
                                    loading="lazy"
                                >

                            </div>

                            <div class="bt-product-info">

                                <span class="bt-product-type">
                                    ${category.name.toUpperCase()}
                                </span>

                                <h3 class="bt-product-name">
                                    ${product[0]}
                                </h3>

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

                    `).join("")}

                </div>

            </section>

        `).join("");

    }


    // DODAVANJE U KORPU

    function btAddToCart(categoryIndex, productIndex) {

        const product = btCategories[categoryIndex].products[productIndex];

        const existing = btCart.find(item => item.name === product[0]);

        if (existing) {

            existing.quantity++;

        } else {

            btCart.push({
                name: product[0],
                price: product[1],
                quantity: 1
            });

        }

        btUpdateCart();

        btNotification(product[0]);

    }


    // UKLANJANJE IZ KORPE

    function btRemoveFromCart(index) {

        btCart.splice(index, 1);

        btUpdateCart();

    }


    // AŽURIRANJE POSTOJEĆE KORPE

    function btUpdateCart() {

        const cartBody = cartModal.querySelector(".modal-body");

        const cartFooter = cartModal.querySelector(".modal-footer");

        const total = btCart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const count = btCart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );


        // Broj proizvoda u navigaciji

        cartButton.textContent = `Korpa (${count})`;


        // Ako je korpa prazna

        if (btCart.length === 0) {

            cartBody.className = "modal-body empty-cart";

            cartBody.innerHTML = `
                <p class="empty-title">Korpa je prazna</p>

                <p class="empty-text">
                    Dodajte proizvode u korpu i oni će se pojaviti ovde.
                </p>
            `;

        } else {

            cartBody.className = "modal-body";

            cartBody.innerHTML = `

                <div class="bt-existing-cart">

                    ${btCart.map((item, index) => `

                        <div class="bt-existing-cart-item">

                            <div>

                                <h3>${item.name}</h3>

                                <p>
                                    ${btFormatPrice(item.price)} RSD
                                </p>

                                <span>
                                    Količina: ${item.quantity}
                                </span>

                            </div>

                            <button
                                class="bt-remove-cart-item"
                                data-index="${index}"
                                aria-label="Ukloni proizvod">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    `).join("")}

                </div>

            `;

        }


        // Ukupna cena

        let totalElement = document.getElementById("btCartTotal");

        if (!totalElement) {

            totalElement = document.createElement("div");

            totalElement.id = "btCartTotal";

            cartFooter.insertBefore(
                totalElement,
                cartFooter.firstChild
            );

        }

        totalElement.innerHTML = `
            <strong>Ukupno:</strong>
            <span>${btFormatPrice(total)} RSD</span>
        `;

        totalElement.style.display =
            btCart.length > 0 ? "flex" : "none";

    }


    // OBAVEŠTENJE O DODAVANJU

    function btNotification(productName) {

        let notification = document.getElementById("btCartNotification");

        if (!notification) {

            notification = document.createElement("div");

            notification.id = "btCartNotification";

            notification.className = "bt-cart-notification";

            document.body.appendChild(notification);

        }

        notification.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            ${productName} je dodat u korpu!
        `;

        notification.classList.add("bt-show");

        clearTimeout(window.btNotificationTimer);

        window.btNotificationTimer = setTimeout(() => {

            notification.classList.remove("bt-show");

        }, 2500);

    }


    // KLIK NA DODAVANJE PROIZVODA

    catalog.addEventListener("click", function(event) {

        const button = event.target.closest(".bt-add-cart");

        if (!button) return;

        const categoryIndex = Number(button.dataset.category);

        const productIndex = Number(button.dataset.product);

        btAddToCart(categoryIndex, productIndex);

    });


    // KLIK NA UKLANJANJE PROIZVODA

    cartModal.addEventListener("click", function(event) {

        const button = event.target.closest(".bt-remove-cart-item");

        if (!button) return;

        const index = Number(button.dataset.index);

        btRemoveFromCart(index);

    });


    // POKRETANJE SISTEMA

    btRenderProducts();

    btUpdateCart();

});

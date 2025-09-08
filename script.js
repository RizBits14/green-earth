const plantsContainer = document.getElementById("plants-container");
const categoriesContainer = document.getElementById("categories-container");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const loader = document.getElementById("loader");

const modal = document.getElementById("plant-modal");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDescription = document.getElementById("modal-description");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");

const menuBtn = document.getElementById("nav-btn");
const mobileMenu = document.getElementById("mobile-menu");

let cart = {};

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

const mobileMenuItems = mobileMenu.querySelectorAll("h3, button");
mobileMenuItems.forEach(item => {
    item.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
});

function showLoader() {
    loader.style.display = "flex";
    plantsContainer.classList.add("hidden");
}

function hideLoader() {
    loader.style.display = "none";
    plantsContainer.classList.remove("hidden");
}

function loadCategories() {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then(data => {
            if (data.status && Array.isArray(data.categories)) {
                displayCategories(data.categories);
            }
        });
}


function displayCategories(categories) {
    const allBtn = document.createElement("button");
    allBtn.textContent = "All Trees";
    allBtn.className = "category-btn active";
    allBtn.addEventListener("click", () => {
        loadPlants();
        setActiveCategory(allBtn);
    });
    categoriesContainer.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.category_name;
        btn.className = "category-btn";
        btn.addEventListener("click", () => {
            loadPlantsByCategory(cat.id);
            setActiveCategory(btn);
        });
        categoriesContainer.appendChild(btn);
    });
}

function setActiveCategory(clickedBtn) {
    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    clickedBtn.classList.add("active");
}

function loadPlants() {
    showLoader();
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
            if (data.status && Array.isArray(data.plants)) {
                displayPlants(data.plants);
            }
        })
        .finally(() => hideLoader());
}


function loadPlantsByCategory(id) {
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.status && Array.isArray(data.plants)) {
                displayPlants(data.plants);
            } else {
                plantsContainer.innerHTML = "<p class='col-span-3 text-center'>No plants in this category.</p>";
            }
        })
        .finally(() => hideLoader());
}


function displayPlants(plants) {
    plantsContainer.innerHTML = "";

    plants.forEach(plant => {
        const card = document.createElement("div");
        card.className = "plant-card";

        card.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <div class="flex justify-between items-center mb-2">
                <span class="category-tag">${plant.category}</span>
                <p class="price">৳${plant.price}</p>
            </div>
            <p>${plant.description}</p>
            <div class="add-btn w-full text-center mt-2 cursor-pointer rounded-full">Add to Cart</div>
        `;

        card.querySelector(".add-btn").addEventListener("click", e => {
            e.stopPropagation();
            addToCart(plant);
        });

        card.addEventListener("click", () => showPlantDetails(plant.id));

        plantsContainer.appendChild(card);
    });
}


function addToCart(plant) {
    if (cart[plant.id]) {
        cart[plant.id].quantity += 1;
    } else {
        cart[plant.id] = { ...plant, quantity: 1 };
    }
    updateCartUI();
}

function removeFromCart(id) {
    delete cart[id];
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    Object.values(cart).forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <div>
                <p class="font-semibold">${item.name}</p>
                <span>৳${item.price} x ${item.quantity}</span>
            </div>
            <div class="remove-btn">✕</div>
        `;
        itemEl.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
        cartItemsContainer.appendChild(itemEl);

        total += item.price * item.quantity;
    });

    cartTotalEl.textContent = `৳${total}`;
}

function showPlantDetails(id) {
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.status && data.plants) {
                const plant = data.plants;
                modalImage.src = plant.image;
                modalName.textContent = plant.name;
                modalDescription.textContent = plant.description;
                modalCategory.textContent = plant.category;
                modalPrice.textContent = `৳${plant.price}`;
                modal.style.display = "flex";
            }
        });
}


modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

loadCategories();
loadPlants();

const navbarBtn = document.getElementById("nav-btn");
const mobileMenu = document.getElementById("mobile-menu");

navbarBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});
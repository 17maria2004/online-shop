const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i"); /*From inside the menuBtn element, find the first <i> tag*/


const navData = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Contact", href: "#contact" }
];


// Dynamically create nav links from JSON
navData.forEach(item => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = item.href;
  a.textContent = item.name;
  li.appendChild(a);
  navLinks.appendChild(li);
});


menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const navSearch = document.getElementById("nav-search");
navSearch.addEventListener("click", (e) => {
    navSearch.classList.toggle("open");
});


const ScrollRevealOption = {
    distance: "50px",
    origin : "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
    ...ScrollRevealOption,
    origin : "right",
});

ScrollReveal().reveal(".header__content div", {
    duration : 1000,
    delay : 500,
});
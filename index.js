const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i"); /*From inside the menuBtn element, find the first <i> tag*/


const navData = [
    { name: "Home", href: "index.html" },
    { name: "About", href: "about.html" },
    { name: "Products", href: "products.html" },
    { name: "Contact", href: "contact.html" }
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
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
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
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
    ...ScrollRevealOption,
    origin: "right",
});

ScrollReveal().reveal(".header__content div", {
    duration: 1000,
    delay: 500,
});

ScrollReveal().reveal(".header__content h1", {
    ...ScrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".header__content p", {
    ...ScrollRevealOption,
    delay: 1500,
});


/*kermel l hot deals ta aamelun dynamically */
document.addEventListener("DOMContentLoaded", () => {
    fetch("deals.json")
        .then((response) => response.json())
        .then((data) => {
            const container = document.querySelector(".deals__container");

            /*looping through each item (deal)*/
            data.forEach((deal) => {
                const card = document.createElement("div");
                card.className = "deals__card";
                card.innerHTML = `
                <span><i class="${deal.icon}"></i></span>
                <h4>${deal.title}</h4>
                <p>${deal.description}</p>
                `;
                container.appendChild(card);
            });

            ScrollReveal().reveal(".deals__card", {
                ...ScrollRevealOption,
                interval: 500,
            });
        });
});

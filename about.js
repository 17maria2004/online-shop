const AboutScrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

document.addEventListener("DOMContentLoaded", () => {
  const aboutContainer = document.querySelector(".about__container");
  if (!aboutContainer) return;

  fetch("about.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load about.json");
      return res.json();
    })
    .then((data) => {
      const aboutHTML = `
        <h2 class="section__header">${data.heading}</h2>
        <p class="section__description">${data.description}</p>
        <button class="about__btn">Learn More</button>

        <div class="about__content">
          <div class="about__image">
            <img src="${data.image}" alt="about" />
          </div>
          <div class="about__grid">
            ${data.cards
              .map(
                (card) => `
              <div class="about__card">
                <h3>${card.number}</h3>
                <h4>${card.title}</h4>
                <p>${card.text}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      aboutContainer.innerHTML = aboutHTML;

      ScrollReveal().reveal(".about__image img", {
        origin: "right",
        distance: "100px",
        duration: 1000,
      });

      ScrollReveal().reveal(".about__card", {
        origin: "bottom",
        distance: "50px",
        duration: 800,
        interval: 200,
      });
    })
    .catch((error) => console.error("Error loading About section:", error));
});

const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon =
  menuBtn.querySelector(
    "i"
  ); /*From inside the menuBtn element, find the first <i> tag*/

const navData = [
  { name: "Home", href: "index.html" },
  { name: "About", href: "about.html" },
  { name: "Products", href: "products.html" },
  { name: "Contact", href: "contact.html" },
];

// Dynamically create nav links from JSON
navData.forEach((item) => {
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

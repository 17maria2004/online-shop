function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const ids = ["cart-count", "cart-count-main"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}
const AboutScrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
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

const ScrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("about.json")
    .then((res) => res.json())
    .then((data) => {
      const aboutContainer = document.querySelector(".about__container");

      const aboutHTML = `
        <div class="about__content">
          <div class="about__image">
            <img src="${data.image}" alt="about" />
          </div>
          <div class="about__grid">
            ${data.cards.map(card => `
              <div class="about__card">
                <h3>${card.number}</h3>
                <h4>${card.title}</h4>
                <p>${card.text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      aboutContainer.innerHTML = aboutHTML;

      ScrollReveal().reveal(".about__card", {
        ...ScrollRevealOption,
        interval: 300,
      });
    });
});

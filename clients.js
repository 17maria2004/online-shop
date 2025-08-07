document.addEventListener("DOMContentLoaded", () => {
  fetch("clients.json")
    .then((res) => res.json())
    .then((data) => {
      const wrapper = document.getElementById("client-swiper-wrapper");

      data.forEach((client) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
          <div class="client__card">
            <img src="${client.image}" alt="user" />
            <div>
              <p>${client.text}</p>
              <h4>${client.name}</h4>
              <h5>${client.title}</h5>
            </div>
          </div>
        `;
        wrapper.appendChild(slide);
      });

      new Swiper(".swiper", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
});

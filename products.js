document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products.json");
      return res.json();
    })
    .then((data) => {
      const container = document.querySelector(".product__container");
      if (!container) return;

      const categories = {};

      // ❌ This line filters out products with stock = 0
      // const inStockProducts = data.filter((p) => p.stock > 0);

      // ✅ Instead: include all products, even out-of-stock
      const inStockProducts = data;

      // Sort based on discount/sustainable
      inStockProducts.sort((a, b) => {
        const score = (p) => {
          if (p.discount) return 3;
          if (p.sustainable) return 2;
          return 1;
        };
        return score(b) - score(a);
      });

      // Group by category
      inStockProducts.forEach((product) => {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      });

      container.innerHTML = `<h2 class="section__header">Products</h2>`;

      for (const category in categories) {
        const section = document.createElement("div");
        section.classList.add("product__section");

        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

        section.innerHTML = `
          <h3 class="product__category">${categoryName}</h3>
          <div class="product__grid">
            ${categories[category]
              .map((product, index) => {
                const hasDiscount = product.discount && product.discountPercent;
                const discountAmount = hasDiscount
                  ? (product.price * (product.discountPercent / 100)).toFixed(2)
                  : 0;
                const finalPrice = hasDiscount
                  ? (product.price - discountAmount).toFixed(2)
                  : product.price.toFixed(2);

                return `
                <div class="product__card">
                  <img src="${product.image}" alt="${product.title}" />
                  <h4>${product.title}</h4>
                  ${product.new ? '<span class="badge badge--new">New</span>' : ""}
                  ${product.sustainable ? '<span class="badge badge--sustainable">🌿 Sustainable</span>' : ""}
                  <p class="product__price">
                    ${
                      hasDiscount
                        ? `
                        <span class="old-price">$${product.price.toFixed(2)}</span>
                        <span class="new-price">$${finalPrice}</span>
                        <span class="discount">-${product.discountPercent}%</span>
                        <span class="discount-name">${product.discount}</span>
                      `
                        : `$${product.price.toFixed(2)}`
                    }
                  </p>
                  <p class="product__stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                    ${product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
                  </p>
                  ${
                    product.stock > 0
                      ? `
                  <div class="quantity-controls">
                    <button class="decrement" data-index="${index}">-</button>
                    <span class="quantity" id="quantity-${index}">1</span>
                    <button class="increment" data-index="${index}">+</button>
                  </div>`
                      : ''
                  }
                </div>
              `;
              })
              .join("")}
          </div>
        `;

        container.appendChild(section);
      }

      // Quantity control buttons
      container.addEventListener("click", (e) => {
        if (e.target.classList.contains("increment")) {
          const index = e.target.dataset.index;
          const quantityEl = document.getElementById("quantity-" + index);
          quantityEl.textContent = parseInt(quantityEl.textContent) + 1;
        } else if (e.target.classList.contains("decrement")) {
          const index = e.target.dataset.index;
          const quantityEl = document.getElementById("quantity-" + index);
          const current = parseInt(quantityEl.textContent);
          if (current > 1) {
            quantityEl.textContent = current - 1;
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
});

let productsData = [];

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const ids = ["cart-count", "cart-count-main"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products.json");
      return res.json();
    })
    .then((data) => {
      productsData = data;

      const container = document.querySelector(".product__container");
      if (!container) return;

      // Sort by priority: discount > sustainable > others
      productsData.sort((a, b) => {
        const score = (p) => {
          if (p.discount) return 3;
          if (p.sustainable) return 2;
          return 1;
        };
        return score(b) - score(a);
      });

      // Group by category
      const categories = {};
      productsData.forEach((product) => {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      });

      container.innerHTML = `<h2 class="section__header">Products</h2>`;
      let globalIndex = 0;

      for (const category in categories) {
        const section = document.createElement("div");
        section.classList.add("product__section");

        const categoryName =
          category.charAt(0).toUpperCase() + category.slice(1);
        section.innerHTML = `
          <h3 class="product__category">${categoryName}</h3>
          <div class="product__grid">
            ${categories[category]
              .map((product) => {
                const hasDiscount = product.discount && product.discountPercent;
                const discountAmount = hasDiscount
                  ? (product.price * (product.discountPercent / 100)).toFixed(2)
                  : 0;
                const finalPrice = hasDiscount
                  ? (product.price - discountAmount).toFixed(2)
                  : product.price.toFixed(2);

                const uniqueIndex = globalIndex++;

                return `
                <div class="product__card" data-product-id="${encodeURIComponent(product.title)}" style="cursor: pointer;">
                  <div class="product-header">
                  <img src="${product.image}" alt="${product.title}" />
                                    </div>
                  <div class="product-body">
                  <h4>${product.title}</h4>

                  <div class="badge-container">
                    ${
                      product.new
                        ? '<span class="badge badge--new">New</span>'
                        : ""
                    }
                    ${
                      product.sustainable
                        ? '<span class="badge badge--sustainable">🌿 Sustainable</span>'
                        : ""
                    }
                  </div>


                  <p class="product__price">
                    ${
                      hasDiscount
                        ? `
                        <span class="old-price">$${product.price.toFixed(
                          2
                        )}</span>
                        <span class="new-price">$${finalPrice}</span>
                        <span class="discount">-${
                          product.discountPercent
                        }%</span>
                        <span class="discount-name">${product.discount}</span>
                      `
                        : `$${product.price.toFixed(2)}`
                    }
                  </p>
                  <p class="product__stock ${
                    product.stock === 0 ? "out-of-stock" : ""
                  }">
                    ${
                      product.stock > 0
                        ? `In Stock : <span id="stock-${uniqueIndex}">${product.stock}</span>`
                        : "Out of Stock"
                    }
                  </p>
                  <div class="cart-controls" onclick="event.stopPropagation();">
                    <div class="quantity-controls">
                      <button class="decrement" data-index="${uniqueIndex}" ${
                  product.stock === 0 ? "disabled" : ""
                }>-</button>
                      <span class="quantity" id="quantity-${uniqueIndex}">${
                  product.stock > 0 ? "1" : "0"
                }</span>
                      <button class="increment" data-index="${uniqueIndex}" data-stock="${
                  product.stock
                }" ${product.stock === 0 ? "disabled" : ""}>+</button>
                    </div>
                    <button class="add-to-cart" 
                      data-id="${product.title}" 
                      data-title="${product.title}" 
                      data-price="${finalPrice}" 
                      data-image="${product.image}" 
                      data-stock="${product.stock}" 
                      data-index="${uniqueIndex}" 
                      ${product.stock === 0 ? "disabled" : ""}
                    >
                      Add To Cart
                    </button>
                  </div>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `;

        container.appendChild(section);
      }

      // Event delegation for buttons inside container
      container.addEventListener("click", (e) => {
        const target = e.target;

        // Increment quantity
        if (target.classList.contains("increment")) {
          const index = target.dataset.index;
          const maxStock = parseInt(target.dataset.stock);
          const quantityEl = document.getElementById("quantity-" + index);
          const currentQuantity = parseInt(quantityEl.textContent);
          if (currentQuantity < maxStock) {
            quantityEl.textContent = currentQuantity + 1;
          }
        }

        // Decrement quantity
        else if (target.classList.contains("decrement")) {
          const index = target.dataset.index;
          const quantityEl = document.getElementById("quantity-" + index);
          const currentQuantity = parseInt(quantityEl.textContent);
          if (currentQuantity > 1) {
            quantityEl.textContent = currentQuantity - 1;
          }
        }

        // Add to cart button
        else if (target.classList.contains("add-to-cart")) {
          const index = target.dataset.index;
          const quantityEl = document.getElementById("quantity-" + index);
          let quantity = parseInt(quantityEl.textContent);

          // Find product by title (used as id)
          const product = productsData.find(
            (p) => p.title === target.dataset.id
          );

          if (!product) {
            alert("Product not found!");
            return;
          }

          if (product.stock < quantity) {
            alert(`Only ${product.stock} items left in stock.`);
            return;
          }

          // Decrease stock in memory
          product.stock -= quantity;

          const stockEl = document.getElementById("stock-" + index);
          if (stockEl) {
            if (product.stock > 0) {
              stockEl.textContent = product.stock;
            } else {
              stockEl.textContent = "0";
              target.disabled = true;
              const decrementBtn =
                target.parentElement.querySelector(".decrement");
              const incrementBtn =
                target.parentElement.querySelector(".increment");
              if (decrementBtn) decrementBtn.disabled = true;
              if (incrementBtn) incrementBtn.disabled = true;
            }
          }

          //mn baad ma zedna items aal cart manna nzabit l teghyir:
          quantityEl.textContent = product.stock > 0 ? "1" : "0";

          target.dataset.stock = product.stock;
          const incrementBtn = target.parentElement.querySelector(".increment");
          if (incrementBtn) incrementBtn.dataset.stock = product.stock;

          // Add/update cart in localStorage
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find((item) => item.id === product.title);

          if (existing) {
            existing.quantity += quantity;
          } else {
            cart.push({
              id: product.title,
              title: product.title,
              price: parseFloat(target.dataset.price),
              image: product.image,
              quantity: quantity,
            });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();

          alert(`${product.title} added to cart!`);
        }
      });

      // NEW: Add event listener for product card clicks to navigate to single product page
      container.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product__card");
        
        // If clicked on a product card but not on cart controls, navigate to single product
        if (productCard && !e.target.closest('.cart-controls')) {
          const productId = productCard.dataset.productId;
          if (productId) {
            window.location.href = `singleProduct.html?id=${productId}`;
          }
        }
      });

      updateCartCount();
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
});
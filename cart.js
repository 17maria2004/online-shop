document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.querySelector("#cart-table tbody");
  const totalPriceEl = document.getElementById("total-price");

  function renderCart() {
    tbody.innerHTML = "";

    if (cart.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Your cart is empty.</td></tr>`;
      totalPriceEl.textContent = "0.00";
      return; //exits the function early, nothing else to render
    }

    let total = 0; //kermel nebea nehsub l total price

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${
        item.title
      }" style="width:60px; height:60px; object-fit:cover; margin-right:15px;" />
            <div>${item.title}</div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${
            item.quantity
          }" data-index="${index}" class="form-control quantity-input" style="width:80px;">
        </td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    totalPriceEl.textContent = total.toFixed(2);
  }

  // Update quantity from input fields
  tbody.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-input")) {
      const idx = parseInt(e.target.dataset.index);
      const newQty = parseInt(e.target.value); //sarit l value tabaa l quantity

      if (newQty >= 1) {
        // eza l id of l cart item huwe 1 w l qtty 5 donc cart[1].quantity = 5
        cart[idx].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        //aam nsayyiv l updates li saro back to the localstorage
        renderCart(); //baayyit lal fctn to matches the latest changes
      }
    }
    updateCartCount();
  });

  // Remove item from cart
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const idx = parseInt(e.target.dataset.index); //bshuf l index tabaoo
      cart.splice(idx, 1); //splice yaane removes 1 item
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
    updateCartCount();
  });

  renderCart();

  const checkoutBtn = document.getElementById("checkout-btn");

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Clear the cart array
    cart = [];

    localStorage.setItem("cart", JSON.stringify(cart));

    // Re-render the cart table (will show empty message)
    renderCart();

    updateCartCount();

    alert("Thank you for your purchase! Your cart is now empty.");
  });
});
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector(".ri-menu-item");

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
  //bdde set icon class to "ri-close-line" aw "ri-menu-line" aala hasab eza open aw lae
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const navSearch = document.getElementById("nav-search");
navSearch.addEventListener("click", (e) => {
  // Don't toggle if clicking on the input field or search results
  if (e.target.tagName === 'INPUT' || e.target.closest('.search-results')) {
    return;
  }
  navSearch.classList.toggle("open");
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const ids = ["cart-count", "cart-count-main"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}

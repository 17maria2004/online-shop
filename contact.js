// Get form elements
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const ids = ["cart-count", "cart-count-main"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}

updateCartCount();

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const contactForm = document.getElementById("contact-form");
const errorElement = document.getElementById("error");
const successMsg = document.getElementById("success-msg");
const submitBtn = document.getElementById("submit");

const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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

const validate = (e) => {
  e.preventDefault(); // Stop form from submitting immediately

  if (nameInput.value.trim().length < 3) {
    errorElement.innerHTML = "Your name should be at least 3 characters long.";
    return false;
  }

  if (!(emailInput.value.includes(".") && emailInput.value.includes("@"))) {
    errorElement.innerHTML = "Please enter a valid email address.";
    return false;
  }

  if (!emailIsValid(emailInput.value)) {
    errorElement.innerHTML = "Please enter a valid email address.";
    return false;
  }

  if (messageInput.value.trim().length < 15) {
    errorElement.innerHTML = "Please write a longer message.";
    return false;
  }

  //eza kelshi tamem
  errorElement.innerHTML = "";
  successMsg.innerHTML =
    "Thank you! I will get back to you as soon as possible.";
  //Clears any previous error message.
  // Displays a success message to the user.

  // Clear success message & reset form after 6 seconds
  setTimeout(() => {
    successMsg.innerHTML = "";
    contactForm.reset();
  }, 6000);

  return true; //validation succeeded
};

submitBtn.addEventListener("click", validate);
// When the submit button is clicked, it runs validate().

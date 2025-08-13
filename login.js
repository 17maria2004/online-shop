// login.js - FIXED VERSION
document.addEventListener("DOMContentLoaded", () => {
  // Get all the elements
  const loginButton = document.getElementById("loginButton");
  const popupOverlay = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("closeBtn");
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  // Function to show the popup
  function showPopup() {
    if (popupOverlay) {
      popupOverlay.classList.add("active");
      // Reset to login form when opening
      signupContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    }
  }

  // Function to hide the popup
  function hidePopup() {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  }

  // Show popup when login button is clicked
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup();
    });
  }

  // Hide popup when close button is clicked
  if (closeBtn) {
    closeBtn.addEventListener("click", hidePopup);
  }

  // Hide popup when clicking outside the popup container
  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        hidePopup();
      }
    });
  }

  // Switch to signup form
  if (showSignup) {
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.classList.add("hidden");
      signupContainer.classList.remove("hidden");
    });
  }

  // Switch to login form
  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    });
  }

  // Handle login form submission
  const loginSubmit = document.getElementById("loginSubmit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      if (username && password) {
        // Here you would typically send data to server
        alert(`Login attempt for: ${username}`);
        hidePopup();
        // Clear form
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
      } else {
        alert("Please fill in both username and password");
      }
    });
  }

  // Handle signup form submission
  const signupSubmit = document.getElementById("signupSubmit");
  if (signupSubmit) {
    signupSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      if (username && email && password) {
        // Here you would typically send data to server
        alert(`Signup attempt for: ${username} (${email})`);
        hidePopup();
        // Clear form
        document.getElementById("signupUsername").value = "";
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPassword").value = "";
      } else {
        alert("Please fill in all fields");
      }
    });
  }

  // Close popup with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hidePopup();
    }
  });
});

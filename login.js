document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const loginButton2 = document.getElementById("loginButtonMain");
  const popupOverlay = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("closeBtn");
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  function showPopup() {
    if (popupOverlay) {
      popupOverlay.classList.add("active");
      signupContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    }
  }

  function hidePopup() {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  }

  // Show popup when login button is clicked
  if (loginButton2) {
    loginButton2.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup();
    });
  }
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup();
    });
  }

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

  if (showSignup) {
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.classList.add("hidden");
      signupContainer.classList.remove("hidden");
    });
  }

  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    });
  }

  const loginSubmit = document.getElementById("loginSubmit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      if (username && password) {
        alert(`Login attempt for: ${username}`);
        hidePopup();
        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";
      } else {
        alert("Please fill in both username and password");
      }
    });
  }

  const signupSubmit = document.getElementById("signupSubmit");
  if (signupSubmit) {
    signupSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      if (username && email && password) {
        alert(`Signup attempt for: ${username} (${email})`);
        hidePopup();
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

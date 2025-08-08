document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  });
});

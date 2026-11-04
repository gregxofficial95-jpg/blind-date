
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = document.getElementById("registerButton");
    const message = document.getElementById("authMessage");

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("dateOfBirth").value;
    const password = document.getElementById("password").value;
    const consent = document.getElementById("adultConsent").checked;

    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) age--;

    if (!consent || !dob || Number.isNaN(birthDate.getTime()) || age < 18) {
      message.textContent = "You must be at least 18 years old.";
      return;
    }

    button.disabled = true;
    button.textContent = "Creating account...";

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://gregxofficial95-jpg.github.io/blind-date/login.html",
        data: { full_name: fullName, date_of_birth: dob }
      }
    });

    if (error) {
      message.textContent = error.message;
    } else {
      message.textContent = "Account created. Check your email to confirm your address.";
      registerForm.reset();
    }

    button.disabled = false;
    button.textContent = "Create account";
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = document.getElementById("loginButton");
    const message = document.getElementById("loginMessage");

    button.disabled = true;
    button.textContent = "Logging in...";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
      button.disabled = false;
      button.textContent = "Log in";
      return;
    }

    window.location.href = "dashboard.html";
  });
}

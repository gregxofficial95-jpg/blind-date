
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

    if (!consent) {
      message.textContent = "You must confirm that you are 18 or older.";
      return;
    }

    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (!dob || Number.isNaN(birthDate.getTime()) || age < 18) {
      message.textContent = "You must be at least 18 years old.";
      return;
    }

    button.disabled = true;
    button.textContent = "Creating account...";
    message.textContent = "";

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://gregxofficial95-jpg.github.io/blind-date/login.html",
        data: {
          full_name: fullName,
          date_of_birth: dob
        }
      }
    });

    if (error) {
      message.textContent = error.message;
      button.disabled = false;
      button.textContent = "Create account";
      return;
    }

    message.textContent =
      "Registration received! Check your email to confirm your account.";
    registerForm.reset();

    button.disabled = false;
    button.textContent = "Create account";
  });
}


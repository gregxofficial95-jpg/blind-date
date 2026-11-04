
async function loadDashboard() {
  const { data: { user }, error: authError } =
    await supabaseClient.auth.getUser();

  if (authError || !user) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("full_name, is_verified_adult")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    document.getElementById("verificationStatus").textContent =
      "Profile unavailable";
    document.getElementById("statusDescription").textContent =
      "We couldn't load your profile. Please contact support.";
    return;
  }

  document.getElementById("welcomeName").textContent =
    `Welcome, ${profile.full_name}.`;

  document.getElementById("verificationStatus").textContent =
    profile.is_verified_adult ? "Verification approved" : "Verification pending";

  document.getElementById("statusDescription").textContent =
    profile.is_verified_adult
      ? "Your adult verification is approved. Profile setup and matchmaking will be available when those features launch."
      : "Email registration alone does not verify your age. Complete adult verification before accessing matchmaking and appointments.";
}

document.getElementById("logoutButton").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

loadDashboard();


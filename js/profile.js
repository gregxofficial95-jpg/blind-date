
const profileForm = document.getElementById("profileForm");

async function initialiseProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return;

  document.getElementById("gender").value = profile.gender || "";
  document.getElementById("preferredGender").value =
    profile.preferred_gender || "";
  document.getElementById("lookingFor").value =
    profile.looking_for || "";
  document.getElementById("schoolLevel").value =
    profile.school_level || "";
  document.getElementById("interests").value =
    (profile.interests || []).join(", ");

  document.getElementById("anyLevel").checked =
    profile.accepts_any_level;

  document.querySelectorAll("#levelChoices input:not(#anyLevel)")
    .forEach(input => {
      input.checked = (profile.preferred_levels || [])
        .includes(Number(input.value));
    });
}

const levelInputs = document.querySelectorAll(
  "#levelChoices input:not(#anyLevel)"
);
const anyLevel = document.getElementById("anyLevel");

levelInputs.forEach(input => {
  input.addEventListener("change", () => {
    const selected = [...levelInputs].filter(item => item.checked);

    if (selected.length > 3) {
      input.checked = false;
      alert("You can select a maximum of three levels.");
    }

    if (selected.length > 0) anyLevel.checked = false;
  });
});

anyLevel.addEventListener("change", () => {
  if (anyLevel.checked) {
    levelInputs.forEach(input => input.checked = false);
  }
});

profileForm.addEventListener("submit", async event => {
  event.preventDefault();

  const button = document.getElementById("saveProfileButton");
  const message = document.getElementById("profileMessage");

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  const preferredLevels = [...levelInputs]
    .filter(input => input.checked)
    .map(input => Number(input.value));

  if (!anyLevel.checked && preferredLevels.length === 0) {
    message.textContent = "Choose at least one preferred level or Any Level.";
    return;
  }

  button.disabled = true;
  button.textContent = "Saving...";

  const updates = {
    gender: document.getElementById("gender").value,
    preferred_gender: document.getElementById("preferredGender").value,
    looking_for: document.getElementById("lookingFor").value,
    school_level: Number(document.getElementById("schoolLevel").value),
    preferred_levels: preferredLevels,
    accepts_any_level: anyLevel.checked,
    interests: document.getElementById("interests").value
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
  };

  const { error } = await supabaseClient
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  message.textContent = error
    ? error.message
    : "Your profile has been saved successfully.";

  button.disabled = false;
  button.textContent = "Save my profile";
});

initialiseProfile();

const generateBtn = document.getElementById("generate-btn");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userLocation = document.getElementById("user-location");
const statusText = document.getElementById("status");

async function getRandomUser() {
  try {
    statusText.textContent = "Loading...";
    generateBtn.disabled = true;

    const response = await fetch("https://randomuser.me/api/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const user = data.results[0];

    const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
    const email = user.email;
    const location = `${user.location.city}, ${user.location.country}`;
    const avatarUrl = user.picture.large;

    userName.textContent = fullName;
    userEmail.textContent = email;
    userLocation.textContent = location;
    userAvatar.src = avatarUrl;
    userAvatar.alt = fullName;

    statusText.textContent = "User loaded successfully.";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Failed to load user. Please try again.";
  } finally {
    generateBtn.disabled = false;
  }
}

// Load a user on first page load
window.addEventListener("DOMContentLoaded", getRandomUser);

// Load a new user on button click
generateBtn.addEventListener("click", getRandomUser);
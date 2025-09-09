// ======== WEATHER / FORECAST FUNCTIONS ========

// Suggestions based on weather
function getSuggestion(description) {
  description = description.toLowerCase();
  if (description.includes("rain")) return "💧 Consider irrigation & cover crops";
  if (description.includes("clear") || description.includes("sun")) return "☀️ Good for planting and harvesting";
  if (description.includes("cloud")) return "🌤️ Moderate activity, monitor fields";
  if (description.includes("storm") || description.includes("thunder")) return "⚠️ Secure equipment & protect crops";
  if (description.includes("snow")) return "❄️ Protect sensitive plants";
  return "🌱 Regular farm care";
}

// Home Page: Fetch current weather
function loadCurrentWeather(city) {
  const apiKey = "867327a6239275c84a68a583e817e0b9";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const weatherDiv = document.getElementById("weatherResult");
      if (!weatherDiv) return;

      if (data.cod === 200) {
        const desc = data.weather[0].description;
        const suggestion = getSuggestion(desc);

        weatherDiv.innerHTML = `
          <p>📍 City: ${data.name}</p>
          <p>🌡️ Temperature: ${data.main.temp}°C</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>🌬️ Wind: ${data.wind.speed} m/s</p>
          <p>🌱 Suggestion: ${suggestion}</p>
        `;
      } else {
        weatherDiv.innerHTML = `<p>❌ City not found</p>`;
      }
    })
    .catch(() => {
      const weatherDiv = document.getElementById("weatherResult");
      if (weatherDiv) weatherDiv.innerHTML = `<p>⚠️ Error fetching weather</p>`;
    });
}

// Advisory Page: Fetch 7-day forecast
function loadForecast(city = "Hyderabad") {
  const apiKey = "867327a6239275c84a68a583e817e0b9";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecastResult");
      if (!forecastContainer) return;

      if (data.cod === "200") {
        forecastContainer.innerHTML = "";
        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 7);

        dailyData.forEach(day => {
          const date = new Date(day.dt_txt).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
          });
          const desc = day.weather[0].description;
          const suggestion = getSuggestion(desc);

          const card = document.createElement("div");
          card.classList.add("forecast-card");
          card.innerHTML = `
            <div class="forecast-details">
              <h3>${date}</h3>
              <p>${desc}</p>
              <p>🌡️ Temp: ${day.main.temp}°C</p>
              <p>💧 Humidity: ${day.main.humidity}%</p>
              <p>🌬️ Wind: ${day.wind.speed} m/s</p>
            </div>
            <div class="forecast-suggestion">${suggestion}</div>
          `;
          forecastContainer.appendChild(card);
        });
      } else {
        forecastContainer.innerHTML = `<p>❌ Forecast not available</p>`;
      }
    })
    .catch(() => {
      const forecastContainer = document.getElementById("forecastResult");
      if (forecastContainer) forecastContainer.innerHTML = `<p>⚠️ Error fetching forecast</p>`;
    });
}

// ======== AUTHENTICATION PLACEHOLDER ========
function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername")?.value;
  const password = document.getElementById("loginPassword")?.value;
  if (username && password) alert(`Logged in as ${username} (Demo)`);
}

function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("regUsername")?.value;
  const password = document.getElementById("regPassword")?.value;
  if (username && password) alert(`Registered ${username} (Demo)`);
}

// ======== PROFILE DROPDOWN ========
function toggleDropdown() {
  document.getElementById("dropdownMenu")?.classList.toggle("show");
}

function logoutUser() {
  alert("Logged out (Demo)");
}

// Close dropdown if click outside
window.onclick = function(event) {
  if (!event.target.matches('.profile img')) {
    const dropdowns = document.getElementsByClassName("dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// ======== EVENT LISTENERS ========
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  // Home page weather
  if (currentPage === "index.html") {
    const form = document.getElementById("weatherForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const city = document.getElementById("locationInput").value;
      if (city) loadCurrentWeather(city);
    });
  }

  // Advisory page forecast
  if (currentPage === "advisory.html") {
    loadForecast(); // default city
  }
});

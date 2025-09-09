// Forecast Function for Advisory Page
function loadForecast(city = "Hyderabad") {
  const apiKey = "867327a6239275c84a68a583e817e0b9"; 
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "200") {
        const forecastContainer = document.getElementById("forecastResult");
        if (!forecastContainer) return; // Exit if not on advisory page
        forecastContainer.innerHTML = "";

        // Show one forecast per day at 12:00
        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyData.forEach(day => {
          const date = new Date(day.dt_txt).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
          });

          const card = document.createElement("div");
          card.classList.add("forecast-card");
          card.innerHTML = `
            <h3>${date}</h3>
            <p>${day.weather[0].description}</p>
            <p>🌡️ ${day.main.temp}°C</p>
            <p>💧 ${day.main.humidity}%</p>
            <p>🌬️ ${day.wind.speed} m/s</p>
          `;

          forecastContainer.appendChild(card);
        });
      } else {
        document.getElementById("forecastResult").innerHTML = `<p>❌ Forecast not available.</p>`;
      }
    })
    .catch(() => {
      const forecastContainer = document.getElementById("forecastResult");
      if (forecastContainer) {
        forecastContainer.innerHTML = `<p>⚠️ Error fetching forecast.</p>`;
      }
    });
}

// Load forecast automatically if on advisory page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "advisory.html") {
    loadForecast(); // default city
  }
});

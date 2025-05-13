// DOM Elements
const container = document.querySelector('.container');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const tryAgainBtn = document.getElementById('try-again-btn');
const notFound = document.querySelector('.not-found');
const loading = document.querySelector('.loading');
const dateTimeElement = document.getElementById('date-time');
const forecastContainer = document.getElementById('forecast-container');

// Weather Icons (SVG/PNG)
const weatherIcons = {
  'Clear': "clear.png",
  'Clouds': 'cloud.png',
  'Rain': 'rain.jpg',
  'Snow': 'snow.png',
  'Thunderstorm': 'thunderstorm.png',
  'Drizzle': 'drizzle.png',
  'Mist': 'mist.png',
  'Fog': 'fog.png',
  'Haze': 'haze.png',
  'Smoke': 'fog.png',
  'Dust': 'dust.png',
  'Sand': 'dust.png',
  'Ash': 'ash.png',
  'Squall': 'squall.png',
  'Tornado': 'tornado.png'
};

// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
}

// Initial date/time update
updateDateTime();

// Update date/time every minute
setInterval(updateDateTime, 60000);

// Show loading animation
function showLoading() {
  loading.classList.add('active');
}

// Hide loading animation
function hideLoading() {
  loading.classList.remove('active');
}

// Search weather function
function searchWeather() {
  const city = searchInput.value.trim();
  
  if (city === '') {
    return;
  }
  
  showLoading();
  
  // Your API Key - replace with your actual API key
  const APIKey = '8f988dfba1484cd74e9d70b9bcaca8cd';
  
  // Fetch current weather data
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(weatherData => {
      if (weatherData.cod === '404') {
        showNotFoundError();
        return;
      }
      
      // Display current weather data
      displayWeatherData(weatherData);
      
      // After getting current weather, fetch forecast data
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`);
    })
    .then(response => {
      if (!response) return;
      return response.json();
    })
    .then(forecastData => {
      if (forecastData && forecastData.cod !== '404') {
        displayForecastData(forecastData);
      }
      hideLoading();
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      showNotFoundError();
      hideLoading();
    });
}

// Show not found error
function showNotFoundError() {
  notFound.classList.add('active');
  hideLoading();
}

// Hide not found error
function hideNotFoundError() {
  notFound.classList.remove('active');
}

// Display current weather data
function displayWeatherData(data) {
  hideNotFoundError();
  
  // Update main weather info
  document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
  document.getElementById('weather-description').textContent = data.weather[0].description;
  
  // Update weather icon
  const weatherIcon = document.getElementById('weather-icon');
  const weatherMain = data.weather[0].main;
  weatherIcon.src = weatherIcons[weatherMain] || weatherIcons['Clear'];
  
  // Update weather stats
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed)} km/h`;
  document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('cloud-cover').textContent = `${data.clouds.all}%`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

// Display forecast data
function displayForecastData(data) {
  // Clear previous forecast data
  forecastContainer.innerHTML = '';
  
  // Only show next 5 forecasts (every 3 hours)
  const forecasts = data.list.slice(0, 5);
  
  forecasts.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const hour = date.getHours();
    const formattedHour = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    
    const weatherMain = forecast.weather[0].main;
    const iconSrc = weatherIcons[weatherMain] || weatherIcons['Clear'];
    
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    forecastItem.innerHTML = `
      <div class="forecast-time">${formattedHour}</div>
      <img src="${iconSrc}" alt="${forecast.weather[0].description}" class="forecast-icon">
      <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

// Event listeners
searchBtn.addEventListener('click', searchWeather);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

tryAgainBtn.addEventListener('click', () => {
  hideNotFoundError();
  searchInput.focus();
});

// Load default city on initial load
window.addEventListener('load', () => {
  // Use a popular city as default
  searchInput.value = 'Pakistan';
  searchWeather();
});

// Optional: Background image change based on time of day
function setBackgroundBasedOnTime() {
  const hour = new Date().getHours();
  const body = document.body;
  
  // Morning
  if (hour >= 5 && hour < 12) {
    body.style.backgroundImage = "url('https://i.imgur.com/YEoEJCT.jpg')";
  }
  // Afternoon
  else if (hour >= 12 && hour < 17) {
    body.style.backgroundImage = "url('https://i.imgur.com/JafAI0k.jpg')";
  }
  // Evening
  else if (hour >= 17 && hour < 20) {
    body.style.backgroundImage = "url('https://i.imgur.com/mNt5RM2.jpg')";
  }
  // Night
  else {
    body.style.backgroundImage = "url('https://i.imgur.com/3ElHdQb.jpg')";
  }
}

// Set background on load
setBackgroundBasedOnTime();

// Change background every hour to match time of day
setInterval(setBackgroundBasedOnTime, 3600000);
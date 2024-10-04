const apiKey = '29e1502d5c154dbed39e52d113e21ee9';  // Replace with your OpenWeatherMap API key

document.getElementById('search-btn').addEventListener('click', function() {
  const city = document.getElementById('city-input').value;
  if (city) {
    getWeatherData(city);
  }
});

document.getElementById('current-location-btn').addEventListener('click', function() {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherDataByLocation(lat, lon);
  });
});

function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data);
      get5DayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function getWeatherDataByLocation(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data);
      get5DayForecast(lat, lon);
    })
    .catch(error => {
      console.error('Error fetching location weather data:', error);
    });
}

function updateCurrentWeather(data) {
  document.getElementById('current-weather').classList.remove('hidden');
  document.getElementById('city-name').textContent = `${data.name} (${new Date().toISOString().split('T')[0]})`;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('wind-speed').textContent = `Wind: ${data.wind.speed} M/S`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('weather-description').textContent = data.weather[0].description;
}

function get5DayForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      updateForecast(data);
    })
    .catch(error => {
      console.error('Error fetching 5-day forecast:', error);
    });
}

function updateForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.classList.remove('hidden');
  forecastContainer.innerHTML = '';  // Clear previous forecast

  const forecastList = data.list.filter((forecast, index) => index % 8 === 0);  // Get forecast every 24 hours
  forecastList.forEach(forecast => {
    const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
    const card = `
      <div class="forecast-card">
        <p class="font-bold">${date}</p>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon" class="w-12 h-12 my-2">
        <p>Temp: ${forecast.main.temp}°C</p>
        <p>Wind: ${forecast.wind.speed} M/S</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      </div>
    `;
    forecastContainer.innerHTML += card;
  });
}

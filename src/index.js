import './styles.css';

/* eslint-disable no-use-before-define */
const form = document.querySelector('form');
const input = document.querySelector('input');
const errorMessage = document.querySelector('.form__error-message');
const weatherContainer = document.querySelector('.weather__container');
form.addEventListener('submit', handleSubmission);

async function fetchWeatherData(city) {
  const apiResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=703f32b6fdd205e1e230086a61e0927b`, { mode: 'cors' });
  if (apiResponse.status !== 200) return new Error('City Not Found');

  const weatherData = await apiResponse.json();
  return weatherData;
}

function processWeatherData(weatherData) {
  const processedData = weatherData
    .then((data) => ({
      description: data.weather[0].description,
      country: data.sys.country,
      temp: Math.round(data.main.temp - 273),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6),
      pressure: data.main.pressure,
      city: data.name,
    }));
  return processedData;
}

function displayWeatherData(processedData) {
  weatherContainer.innerHTML = `
      <div class="weather__general">
      <span class="weather__weather">${processedData.description.toUpperCase()}</span>
      <span class="weather__location">${processedData.city}, ${processedData.country}</span>
      <span class="weather__temperature">${processedData.temp}°C</span>
    </div>
    <div class="weather__specifics">
      <span class="weather__humidity">HUMIDITY: ${processedData.humidity}%</span>
      <span class="weather__wind">WIND: ${processedData.wind} KM/H</span>
      <span class="weather__pressure">PRESSURE: ${processedData.pressure} HPA</span>
    </div>
  `;
}

function handleSubmission(e) {
  e.preventDefault();
  const weatherData = fetchWeatherData(input.value);
  weatherData.then((data) => {
    if (data instanceof Error) {
      errorMessage.classList.remove('hidden');
    } else {
      errorMessage.classList.add('hidden');
      processWeatherData(weatherData).then((weather) => {
        displayWeatherData(weather);
      });
    }
  });
}

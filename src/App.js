import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container} from 'react-bootstrap';
import Footer from './Footer';
import head_image from './images/nav-logo.png';

function App () {
  const [city, setCity] = useState ('');
  const [weatherData, setWeatherData] = useState (null);

  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get (
        `${API_URL}?q=${city}&appid=${API_KEY}`
      );
      setWeatherData (response.data);

      // Set the document title dynamically
      document.title = `Weather in ${response.data.name}, ${response.data.sys.country}`;
    } catch (error) {
      console.error ('Error fetching weather data:', error);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      fetchWeatherData ();
    }
  };

  const getWeatherEmoji = description => {
    const weatherEmojiMap = {
      clear: '☀️',
      cloud: '☁️',
      rain: '🌧️',
      thunderstorm: '⛈️',
      snow: '❄️',
      haze: '🌫️',
      hailstorm: '⚡❄️',
      cloudy: '☁️☁️',
      wave: '🌊',
      tornado: '🌪️',
      windy: '💨',
      storm: '🌩️',
      tsunami: '🌊🌪️',
      frost: '❄️🌬️',
      fog: '🌫️',
      thunder: '⚡',
      lightning: '⚡',
      humid: '💦',
      hurricane: '🌀',
      mist: '🌫️',
      sandstorm: '🌪️🏜️',
      drizzle: '🌦️',
      sleet: '🌨️❄️',
      rainbow: '🌈',
      snowflake: '❄️',
      sunny: '☀️',
    };

    const lowerCaseDescription = description.toLowerCase ();

    for (const key in weatherEmojiMap) {
      if (lowerCaseDescription.includes (key)) {
        return weatherEmojiMap[key];
      }
    }

    return '❓'; // Default emoji for unknown weather
  };

  useEffect (
    () => {
      if (weatherData) {
        const cityEmoji = getWeatherEmoji (weatherData.weather[0].description);
        document.title = `Weather in ${weatherData.name} ${cityEmoji}`;
      }
    },
    [weatherData]
  );

  const kelvinToCelsius = kelvin => {
    return kelvin - 273.15;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="mt-5 flex-grow-1">
        <div className="app-header text-center">
          <a href="https://dhakalnirajan.github.io/weather/">
            <img
              src={head_image}
              className="img-fluid"
              alt="logo"
              height={50}
              width={70}
            />
            <h1 className="mb-4 head-title" style="font-size: 55px;">
              Weather App{' '}
              {weatherData &&
                getWeatherEmoji (weatherData.weather[0].description)}
            </h1>
          </a>
        </div>
        <div className="app-description">
          <p className="lead">
            Welcome to the Weather App! Get real-time weather information and a
            30-day climate forecast for any city.
          </p>

          <p className="instruction">
            Enter the name of the city you want to know the weather for and click
            "Get Weather."
          </p>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={e => setCity (e.target.value)}
            onKeyPressCapture={handleKeyPress}
          />
          <button className="btn btn-warning" onClick={fetchWeatherData}>
            Get Weather
          </button>
        </div>

        {weatherData &&
          <div className="weather-info mt-5 p-3 bg-light border rounded">
            <h3 className="mb-3">
              Weather in {weatherData.name}, {weatherData.sys.country}
            </h3>
            <p className="mb-1">
              Temperature:{' '}
              {kelvinToCelsius (weatherData.main.temp).toFixed (2)} °C
            </p>
            <p className="mb-1">Humidity: {weatherData.main.humidity}%</p>
            <p className="mb-1">
              Weather: {weatherData.weather[0].description}
            </p>
            <p className="mb-1">Wind Speed: {weatherData.wind.speed} m/s</p>
            <p className="mb-1">Pressure: {weatherData.main.pressure} hPa</p>
            <p className="mb-0">Visibility: {weatherData.visibility} meters</p>
          </div>}

        {
          <div className="container mt-5 p-3">
            <div className="content">
              <h2 className="mb-3">Explore Weather Information</h2>
              <p className="lead-2">
                Stay informed about the weather conditions of any city by using our
                Weather App. Enter the name of the city you want to know the weather
                for and click "Get Weather."
              </p>
              <p className="lead-2">
                The app provides real-time weather information, including temperature,
                humidity, wind speed, pressure, and visibility. Additionally, you can
                enjoy a 30-day climate forecast for your chosen location.
              </p>
              <p className="lead-2">
                The weather information is dynamically updated, and the emoji on the
                title represents the current weather state. The app also changes the
                browser tab title to the name of the city you are exploring.
              </p>
              <p className="lead-2">
                Explore different cities, and watch how the content changes to
                accommodate the weather details. Try it now and stay ahead of the
                weather!
              </p>
              <p className="lead-2 mt-4 mb-5">
                <strong>Note:</strong>
                {' '}
                The weather emoji in the title represents the
                current weather state, providing a quick visual indication.
              </p>
            </div>
          </div>
        }

      </Container>
      <Footer />
    </div>
  );
}

export default App;

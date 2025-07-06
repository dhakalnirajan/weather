import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import {
  WiThermometer, WiHumidity, WiStrongWind, WiBarometer,
  WiDaySunnyOvercast, WiDirectionUp, WiSunrise, WiSunset,
  WiRaindrop, WiDaySunny, WiCloudy, WiRain, WiSnow,
  WiThunderstorm, WiFog, WiUmbrella
} from 'react-icons/wi';
import { FaSun, FaMoon, FaCloudRain, FaWind } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({});

  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5`;

  const fetchWeatherData = async () => {
    try {
      const [weatherRes, forecastRes, airQualityRes, uvRes] = await Promise.all([
        axios.get(`${API_URL}/weather?q=${city}&appid=${API_KEY}`),
        axios.get(`${API_URL}/forecast?q=${city}&appid=${API_KEY}`),
        axios.get(`${API_URL}/air_pollution?lat=${city}&lon=${city}&appid=${API_KEY}`),
        axios.get(`${API_URL}/uvi?lat=${city}&lon=${city}&appid=${API_KEY}`)
      ]);

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setAirQuality(airQualityRes.data.list[0]);
      setUvIndex(uvRes.data.value);
      updateBackground(weatherRes.data);
      document.title = `Weather in ${weatherRes.data.name}, ${weatherRes.data.sys.country}`;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const updateBackground = (data) => {
    const tempC = kelvinToCelsius(data.main.temp);
    let bgColor;
    if (tempC > 30) {
      const intensity = Math.min(0.2 + (tempC - 30) / 50, 0.7);
      bgColor = `linear-gradient(135deg, rgba(255, ${Math.floor(100 * (1 - intensity))}, ${Math.floor(100 * (1 - intensity))}, 0.8), rgba(255, ${Math.floor(50 * (1 - intensity))}, 0, 0.8))`;
    } else if (tempC < 10) {
      const intensity = Math.min(0.2 + (10 - tempC) / 30, 0.7);
      bgColor = `linear-gradient(135deg, rgba(${Math.floor(100 * (1 - intensity))}, ${Math.floor(150 * (1 - intensity))}, 255, 0.8), rgba(0, ${Math.floor(100 * (1 - intensity))}, 255, 0.8))`;
    } else {
      bgColor = 'linear-gradient(135deg, rgba(245, 247, 250, 0.8), rgba(195, 207, 226, 0.8))';
    }
    setBackgroundStyle({ background: bgColor });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData();
    }
  };

  // Utility Functions
  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);
  const unixToTime = (unix) => new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const unixToHour = (unix) => new Date(unix * 1000).getHours();

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return <WiThunderstorm size={40} />;
    if (weatherId >= 300 && weatherId < 400) return <WiRainMix size={40} />;
    if (weatherId >= 500 && weatherId < 600) return <WiRain size={40} />;
    if (weatherId >= 600 && weatherId < 700) return <WiSnow size={40} />;
    if (weatherId >= 700 && weatherId < 800) return <WiFog size={40} />;
    if (weatherId === 800) return <WiDaySunny size={40} />;
    if (weatherId > 800 && weatherId < 900) return <WiCloudy size={40} />;
    return <WiDaySunny size={40} />;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const getPressureTrend = (pressure) => {
    if (pressure < 1000) return 'Low (Stormy)';
    if (pressure < 1010) return 'Slightly Low (Rain likely)';
    if (pressure < 1020) return 'Normal (Changeable)';
    if (pressure < 1030) return 'Slightly High (Fair)';
    return 'High (Very dry)';
  };

  const getVisibilityDescription = (visibility) => {
    const km = visibility / 1000;
    if (km > 10) return 'Excellent';
    if (km > 5) return 'Good';
    if (km > 2) return 'Moderate';
    if (km > 1) return 'Poor';
    return 'Very poor';
  };

  const getUvIndexLevel = (index) => {
    if (index <= 2) return { level: 'Low', color: '#3EA72D' };
    if (index <= 5) return { level: 'Moderate', color: '#FFF300' };
    if (index <= 7) return { level: 'High', color: '#F18B00' };
    if (index <= 10) return { level: 'Very High', color: '#E53210' };
    return { level: 'Extreme', color: '#B567A4' };
  };

  const getAirQuality = (index) => {
    const levels = [
      { level: 'Good', color: '#55A84F' },
      { level: 'Fair', color: '#A3C853' },
      { level: 'Moderate', color: '#FFF833' },
      { level: 'Poor', color: '#F29C33' },
      { level: 'Very Poor', color: '#E93F33' }
    ];
    return levels[index - 1] || levels[0];
  };

  const getPrecipitationProbability = () => {
    if (!forecastData) return 0;
    const nextRain = forecastData.list.find(item => item.rain);
    return nextRain ? Math.round(nextRain.pop * 100) : 0;
  };

  const renderSunTimeline = () => {
    if (!weatherData) return null;
    const now = new Date().getTime() / 1000;
    const { sunrise, sunset } = weatherData.sys;
    const dayDuration = sunset - sunrise;
    const dayProgress = now - sunrise;
    const progressPercent = Math.min(Math.max((dayProgress / dayDuration) * 100, 100);

    return (
      <div className="sun-timeline">
        <div className="timeline-bar">
          <div className="timeline-progress" style={{ width: `${progressPercent}%` }} />
          <div className="timeline-now" style={{ left: `${progressPercent}%` }} />
        </div>
        <div className="timeline-labels">
          <div className="timeline-label">
            <WiSunrise size={24} />
            <span>{unixToTime(sunrise)}</span>
          </div>
          <div className="timeline-label">
            <WiSunset size={24} />
            <span>{unixToTime(sunset)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container" style={backgroundStyle}>
      <Container className="mt-4">
        <div className="search-container mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={fetchWeatherData}>
            Search
          </button>
        </div>

        {weatherData && (
          <div className="weather-dashboard">
            {/* Current Weather Header */}
            <div className="current-weather-header">
              <h2>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <div className="current-weather-main">
                <div className="weather-icon-large">
                  {getWeatherIcon(weatherData.weather[0].id)}
                </div>
                <div className="weather-temp">
                  {kelvinToCelsius(weatherData.main.temp)}°C
                </div>
                <div className="weather-desc">
                  {weatherData.weather[0].description}
                </div>
              </div>
            </div>

            {/* Weather Grid */}
            <div className="weather-grid">
              {/* Temperature Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiThermometer size={30} />
                </div>
                <div className="card-value">
                  {kelvinToCelsius(weatherData.main.temp)}°C
                </div>
                <div className="card-label">Temperature</div>
                <div className="card-extra">
                  Feels like: {kelvinToCelsius(weatherData.main.feels_like)}°C
                </div>
              </div>

              {/* Humidity Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiHumidity size={30} />
                </div>
                <div className="card-value">{weatherData.main.humidity}%</div>
                <div className="card-label">Humidity</div>
                <div className="humidity-bar">
                  <div
                    className="humidity-fill"
                    style={{ width: `${weatherData.main.humidity}%` }}
                  />
                </div>
              </div>

              {/* Wind Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiStrongWind size={30} />
                </div>
                <div className="card-value">{weatherData.wind.speed} m/s</div>
                <div className="card-label">Wind Speed</div>
                <div className="wind-direction">
                  <WiDirectionUp
                    size={20}
                    style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
                  />
                  {getWindDirection(weatherData.wind.deg)}
                </div>
              </div>

              {/* Pressure Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiBarometer size={30} />
                </div>
                <div className="card-value">{weatherData.main.pressure} hPa</div>
                <div className="card-label">Pressure</div>
                <div className="pressure-trend">
                  {getPressureTrend(weatherData.main.pressure)}
                </div>
              </div>

              {/* UV Index Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiDaySunny size={30} />
                </div>
                <div className="card-value">{uvIndex}</div>
                <div className="card-label">UV Index</div>
                <div className="uv-bar">
                  <div
                    className="uv-fill"
                    style={{
                      width: `${Math.min(uvIndex * 10, 100)}%`,
                      backgroundColor: getUvIndexLevel(uvIndex).color
                    }}
                  />
                </div>
                <div className="uv-level">{getUvIndexLevel(uvIndex).level}</div>
              </div>

              {/* Precipitation Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiUmbrella size={30} />
                </div>
                <div className="card-value">{getPrecipitationProbability()}%</div>
                <div className="card-label">Precipitation</div>
                <div className="precipitation-bar">
                  <div
                    className="precipitation-fill"
                    style={{ width: `${getPrecipitationProbability()}%` }}
                  />
                </div>
              </div>

              {/* Air Quality Card */}
              <div className="weather-card">
                <div className="card-icon">
                  <WiCloudy size={30} />
                </div>
                <div className="card-value">{airQuality?.main?.aqi || '-'}</div>
                <div className="card-label">Air Quality</div>
                <div className="air-quality-level">
                  {airQuality ? getAirQuality(airQuality.main.aqi).level : 'N/A'}
                </div>
                <div
                  className="air-quality-color"
                  style={{
                    backgroundColor: airQuality ? getAirQuality(airQuality.main.aqi).color : '#ccc'
                  }}
                />
              </div>

              {/* Sunrise/Sunset Card */}
              <div className="weather-card timeline-card">
                <div className="card-icon">
                  <FaSun size={20} style={{ color: '#FFD700' }} /> / <FaMoon size={20} style={{ color: '#4682B4' }} />
                </div>
                <div className="card-label">Daylight</div>
                {renderSunTimeline()}
                <div className="sun-times">
                  <div className="sun-time">
                    <WiSunrise size={24} />
                    <span>{unixToTime(weatherData.sys.sunrise)}</span>
                  </div>
                  <div className="sun-time">
                    <WiSunset size={24} />
                    <span>{unixToTime(weatherData.sys.sunset)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;

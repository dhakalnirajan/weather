import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { 
  SunFill, 
  CloudFill, 
  CloudRainFill, 
  CloudSnowFill, 
  CloudFogFill, 
  Wind 
} from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      setWeatherData(response.data);
      document.title = `Weather in ${response.data.name}, ${response.data.sys.country}`;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData();
    }
  };

  const getWeatherIcon = (description) => {
    const lowerCaseDescription = description.toLowerCase();
    if (lowerCaseDescription.includes('clear')) return <SunFill className="weather-icon text-warning" />;
    if (lowerCaseDescription.includes('cloud')) return <CloudFill className="weather-icon text-secondary" />;
    if (lowerCaseDescription.includes('rain')) return <CloudRainFill className="weather-icon text-info" />;
    if (lowerCaseDescription.includes('snow')) return <CloudSnowFill className="weather-icon text-light" />;
    if (lowerCaseDescription.includes('fog') || lowerCaseDescription.includes('mist')) return <CloudFogFill className="weather-icon text-secondary" />;
    return <Wind className="weather-icon text-secondary" />;
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit' });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Weather App</h1>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="primary" onClick={fetchWeatherData} className="ms-2">
              Get Weather
            </Button>
          </Form.Group>
        </Col>
      </Row>

      {weatherData && (
        <Card className="weather-card">
          <Card.Header>
            <h2 className="text-center">
              Weather in {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="d-flex justify-content-between align-items-center">
              {getWeatherIcon(weatherData.weather[0].description)}
              <span className="weather-description">{weatherData.weather[0].description}</span>
              <span>{formatDate()}</span>
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="text-center">
              <Col xs={4}>
                <img src="/temperature-icon.png" alt="Temperature" className="weather-info-icon" />
                <p className="weather-info-label">Temperature</p>
                <p className="weather-info-value">{weatherData.main.temp.toFixed(1)}°C</p>
              </Col>
              <Col xs={4}>
                <img src="/humidity-icon.png" alt="Humidity" className="weather-info-icon" />
                <p className="weather-info-label">Humidity</p>
                <p className="weather-info-value">{weatherData.main.humidity}%</p>
              </Col>
              <Col xs={4}>
                <img src="/wind-icon.png" alt="Wind Speed" className="weather-info-icon" />
                <p className="weather-info-label">Wind Speed</p>
                <p className="weather-info-value">{(weatherData.wind.speed * 3.6).toFixed(1)} km/hr</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Grid, TextField, Box, Button } from '@mui/material';
import './App.css';

function App() {
    const API_KEY = import.meta.env.REACT_APP_OPENWEATHER_API_KEY; // Replace with your actual API key
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("London");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('City not found');
                }

                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error(error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [city, API_KEY]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const inputCity = e.target.elements.city.value;
        if (inputCity.trim()) {
            setCity(inputCity);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wrapper">
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
                <TextField
                    name="city"
                    label="Enter city name"
                    variant="outlined"
                    defaultValue={city}
                />
                <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                    Search
                </Button>
            </Box>

            {weatherData && (
                <>
                    <div className="header">
                        <h1 className="city">{weatherData.name}</h1>
                        <p className="temperature">{Math.round(weatherData.main.temp)}°F</p>
                        <p className="condition">{weatherData.weather[0].description}</p>
                    </div>
                    <div className="weather-details">
                        <div>
                            <p>Humidity</p>
                            <p>{weatherData.main.humidity}%</p>
                        </div>
                        <div>
                            <p>Wind Speed</p>
                            <p>{weatherData.wind.speed} mph</p>
                        </div>
                    </div>
                </>
            )}

            {/* Forecast section would need another API call to get forecast data */}
            <div className="forecast">
                <h2 className="forecast-header">5-Day Forecast</h2>
                <div className="forecast-days">
                    <div className="forecast-day">
                        <p>Monday</p>
                        <p>Cloudy</p>
                        <p>12°F</p>
                    </div>
                    <div className="forecast-day">
                        <p>Monday</p>
                        <p>Cloudy</p>
                        <p>12°F</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
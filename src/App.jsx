import React, { useState, useEffect, useCallback } from 'react';
import {
    TextField, Button, Box, Container, Typography, Paper,
    CircularProgress, Grid, Card, CardContent, Avatar,
    MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import './App.css';
import Autocomplete from '@mui/material/Autocomplete';
import { getMeteocon } from '@/utils/weatherIcons';

function App() {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [city, setCity] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unitSystem, setUnitSystem] = useState('metric');
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

    const isDevelopment = import.meta.env.MODE === 'development';

    const fetchWeatherData = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Data unavailable');
        return await response.json();
    };

    const fetchWeatherByCoords = useCallback(async (lat, lon) => {
        try {
            setLoading(true);
            setError(null);

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitSystem}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitSystem}`;

            const [weatherData, forecastData] = await Promise.all([
                fetchWeatherData(weatherUrl),
                fetchWeatherData(forecastUrl)
            ]);

            setWeatherData(weatherData);
            setCity(weatherData.name);
            setForecast(forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5));
            setHourlyForecast(forecastData.list.slice(0, 8));
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            setUseCurrentLocation(false);
        } finally {
            setLoading(false);
            setFirstLoad(false);
        }
    }, [API_KEY, unitSystem]);

    const fetchWeatherByCity = useCallback(async (cityName) => {
        try {
            setLoading(true);
            setError(null);

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unitSystem}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unitSystem}`;

            const [weatherData, forecastData] = await Promise.all([
                fetchWeatherData(weatherUrl),
                fetchWeatherData(forecastUrl)
            ]);

            setWeatherData(weatherData);
            setCity(cityName);
            setForecast(forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5));
            setHourlyForecast(forecastData.list.slice(0, 8));
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
            setFirstLoad(false);
        }
    }, [API_KEY, unitSystem]);

    const fetchCitySuggestions = useCallback(async (query) => {
        if (query.length < 2) return [];
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&limit=5`
            );
            const data = await response.json();
            return data.features.map(feature => feature.place_name);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }
    }, []);

    const fetchWeather = useCallback(() => {
        if (useCurrentLocation) {
            if (isDevelopment) {
                fetchWeatherByCoords(60.192059, 24.945831);
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
                    () => {
                        setError("Location access denied. Please search for a city.");
                        setUseCurrentLocation(false);
                    }
                );
            } else {
                setUseCurrentLocation(false);
            }
        } else if (city) {
            fetchWeatherByCity(city);
        }
    }, [useCurrentLocation, city, isDevelopment, fetchWeatherByCoords, fetchWeatherByCity]);

    const handleLocationToggle = () => {
        setUseCurrentLocation(!useCurrentLocation);
        if (!useCurrentLocation) {
            setInputValue("");
        }
    };

    // Then update your useEffect hooks:
    useEffect(() => {
        if (firstLoad) {
            fetchWeather();
        }
    }, [firstLoad, fetchWeather]);

    useEffect(() => {
        if (!firstLoad) {
            fetchWeather();
        }
    }, [useCurrentLocation, unitSystem, fetchWeather]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (trimmedValue) {
            setUseCurrentLocation(false);
            fetchWeatherByCity(trimmedValue);
            setInputValue("");
        }
    };

    const tempUnit = unitSystem === 'metric' ? 'C' : 'F';
    const speedUnit = unitSystem === 'metric' ? 'kph' : 'mph';
    const tempValue = (temp) => Math.round(temp);

    if (loading && firstLoad) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Detecting your location...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xxl" sx={{ py: 1 }}>
            <Paper elevation={3} sx={{ p: 5, mb: 4, backgroundColor: '#636363' }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    p: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }}>
                    {/* Top Row - Logo/Title and Buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: useCurrentLocation && weatherData ? 2 : 0
                    }}>
                        {/* Left Side - Logo and Title */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                alt="icon"
                                src="public/WeatherIcon.png"
                                width='100px'
                                height='60px'
                                style={{ marginRight: '16px' }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFF' }}>Metora</Typography>
                        </Box>

                        {/* Right Side - Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Tooltip title={useCurrentLocation ? "Search for specific cities" : "Use your location"}>
                                <Button
                                    variant='contained'
                                    color={useCurrentLocation ? "primary" : "primary"}
                                    onClick={handleLocationToggle}
                                    startIcon={useCurrentLocation ? <MyLocationIcon /> : <LocationSearchingIcon />}
                                >
                                    {useCurrentLocation ? 'Search City' : 'Location'}
                                </Button>
                            </Tooltip>

                            <FormControl size="small" sx={{ minWidth: 100, color: '#FFF' }}>
                                <InputLabel>Units</InputLabel>
                                <Select
                                    value={unitSystem}
                                    onChange={(e) => setUnitSystem(e.target.value)}
                                    label="Units"
                                    sx={{ color: '#FFF' }}
                                >
                                    <MenuItem value="metric">Metric (C)</MenuItem>
                                    <MenuItem value="imperial">Imperial (F)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    {/* Location Message (appears below logo when using current location) */}
                    {useCurrentLocation && weatherData && (
                        <Typography variant="body1" sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            ml: '35vh', // Matches logo width + margin
                            mt: 1
                        }}>
                            Showing weather for your current location: <strong>{city}</strong>
                        </Typography>
                    )}
                    {!useCurrentLocation && (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mt: 3,
                                ml: '13vh',
                            }}
                        >
                            <Autocomplete
                                freeSolo
                                options={citySuggestions}
                                open={isSuggestionsOpen}
                                onOpen={() => setIsSuggestionsOpen(true)}
                                onClose={() => setIsSuggestionsOpen(false)}
                                onInputChange={async (event, newValue) => {
                                    setInputValue(newValue);
                                    if (newValue.length > 1) {
                                        const suggestions = await fetchCitySuggestions(newValue);
                                        setCitySuggestions(suggestions);
                                    } else {
                                        setCitySuggestions([]);
                                    }
                                }}
                                inputValue={inputValue}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setCity(newValue.split(',')[0]); // Get just the city name
                                        setInputValue("");
                                        fetchWeatherByCity(newValue.split(',')[0]);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Enter city name"
                                        variant="outlined"
                                        error={!!error}
                                        helperText={error}
                                        sx={{
                                            minWidth: '85vh',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiOutlinedInput-input::placeholder': {
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    opacity: 1,
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white',
                                                '&.Mui-focused': {
                                                    color: 'white',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<SearchIcon />}
                                sx={{ height: '56px' }}
                                disabled={!inputValue.trim()}
                            >
                                Search
                            </Button>
                        </Box>
                    )}
                </Box>

                {weatherData && (
                    <Grid container spacing={4} sx={{ justifyContent: 'flex-start', alignItems: 'stretch' }}>
                        <Grid>
                            <Card className="weather-card main-weather-card" sx={{ height: '100%', backgroundColor: '#0034a4', borderRadius: '16px', minWidth: '25vh' }}>
                                <CardContent sx={{ color: '#FFF', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography variant="h4" gutterBottom>
                                        {weatherData.name}, {weatherData.sys?.country}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}> {/* Added container Box */}
                                        <Avatar
                                            src={getMeteocon(weatherData.weather[0].icon)}
                                            alt={weatherData.weather[0].description}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h2" component="div">
                                        {tempValue(weatherData.main.temp)}{tempUnit}
                                    </Typography>
                                    <Typography variant="subtitle1" color="#FFF" sx={{ textTransform: 'capitalize' }}>
                                        {weatherData.weather[0].description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card className="weather-card details-card" sx={{ height: '100%', backgroundColor: '#002471', borderRadius: '16px' }}>
                                <CardContent sx={{ height: '100%', color: '#FFF' }}>
                                    <Typography variant="h6" gutterBottom>Weather Details</Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            ['Humidity', `${weatherData.main.humidity}%`],
                                            ['Wind Speed', `${weatherData.wind.speed} ${speedUnit}`],
                                            ['Pressure', `${weatherData.main.pressure} hPa`],
                                            ['Feels Like', `${tempValue(weatherData.main.feels_like)}${tempUnit}`],
                                            ['Min Temp', `${tempValue(weatherData.main.temp_min)}${tempUnit}`],
                                            ['Max Temp', `${tempValue(weatherData.main.temp_max)}${tempUnit}`]
                                        ].map(([label, value]) => (
                                            <Grid key={label} sx={{ backgroundColor: '#FFF', color: '#000', px: 2, py: 2, borderRadius: '16px' }}>
                                                <Typography>{label}</Typography>
                                                <Typography variant="h6">{value}</Typography>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Hourly Forecast Section */}
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>Next 24 Hours</Typography>
                                        <Typography variant="p" sx={{ fontStyle: 'italic', color: '#808080' }} gutterBottom>Updated in 3 hour intervals</Typography>
                                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, py: 1 }}>
                                            {hourlyForecast.map((hour, index) => (
                                                <Card key={index} sx={{ minWidth: 100 }}>
                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">
                                                            {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}:00
                                                        </Typography>
                                                        <Avatar
                                                            src={getMeteocon(hour.weather[0].icon)}  // Changed from weatherData to hour
                                                            alt={hour.weather[0].description}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                backgroundColor: 'transparent'
                                                            }}
                                                        />
                                                        <Typography variant="body1">
                                                            {tempValue(hour.main.temp)}{tempUnit}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {forecast.length > 0 && (
                    <Paper elevation={3} sx={{ p: 5, mt: 5, backgroundColor: '#002471', borderRadius: '16px' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#FFF' }}>5-Day Forecast</Typography>
                        <Grid container spacing={10}>
                            {forecast.map((day, index) => (
                                <Grid key={index}>
                                    <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1">
                                                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </Typography>
                                            <Avatar
                                                src={getMeteocon(day.weather[0].icon)}  // Changed from weatherData to day
                                                alt={day.weather[0].description}
                                                sx={{
                                                    width: 135,
                                                    height: 80,
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                            <Typography variant="h6">
                                                {tempValue(day.main.temp)}{tempUnit}
                                            </Typography>
                                            <Typography variant="caption">
                                                {day.weather[0].main}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {!weatherData && !firstLoad && !loading && (
                    <Typography textAlign="center" color="text.secondary">
                        {error || "Search for a city to see weather information"}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
}

export default App;
import React from 'react';
import {
    Box, Container, Typography, Paper,
    CircularProgress, Grid, Card, CardContent, Avatar,
    Link, Chip
} from '@mui/material';
import './styles/App.css';
import { getMeteocon } from '@/utils/weatherIcons';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from './components/CookieConsent';
import { describeWeather } from './utils/weatherdescriptions';
import { useWeather } from './context/WeatherContext';
import Navbar from './components/navbar';
import AdPlaceholder from './components/AdPlaceholder';
    
const theme = createTheme({
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
    },
});

function App() {
    const {
        unitSystem,
        weatherData,
        forecast,
        hourlyForecast,
        loading,
        error,
        fetchWeatherByCoords,
        setUseCurrentLocation
    } = useWeather();

    const [firstLoad, setFirstLoad] = React.useState(true);

    const tempUnit = unitSystem === 'metric' ? '°C' : '°F';
    const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';
    const tempValue = (temp) => Math.round(temp);

    const convertWindSpeed = (speed) => {
        return unitSystem === 'metric' ? Math.round(speed * 3.6) : Math.round(speed);
    };

    React.useEffect(() => {
        if (firstLoad) {
            if (import.meta.env.MODE === 'development') {
                fetchWeatherByCoords(60.192059, 24.945831);
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
                    () => {
                        setUseCurrentLocation(false);
                    }
                );
            } else {
                setUseCurrentLocation(false);
            }
            setFirstLoad(false);
        }
    }, [firstLoad, fetchWeatherByCoords, setUseCurrentLocation]);
    
    // Show loading screen on first load
    if (loading && firstLoad) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Detecting your location...</Typography>
            </Container>
        );
    }

    // Main component render
    return (
        <>
            <Navbar />
            <ThemeProvider theme={theme}>
                <Container maxWidth="xxl" sx={{
                    py: 1,
                    px: { xs: 2, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    mt: '60px' // Add margin-top to account for fixed navbar
                }}>
                    <Analytics />

                    {/* Main content container */}
                    <Paper elevation={3} sx={{
                        p: { xs: 0, md: 5, lg:2 },
                        mb: 4,
                        backgroundColor: { xs: 'transparent', md: 'transparent', lg:'#636363' },
                        mx: 'auto',
                        maxWidth: '1250px',
                        width: '100%', 
                        borderRadius: '16px',
                    }}>
                        {/* AdSense ad unit will be placed here */}
                        <AdPlaceholder height="90px" position="top" />

                        {/* Weather display grid - only shows when data is loaded */}
                        {weatherData && (
                            <Grid container spacing={4} sx={{
                                width: '100%',
                                mb: 4,
                                justifyContent: 'flex-start',
                            }}>
                                {/* Current weather in weather card */}
                                <Grid sx={{ width: { xs: '100%', md: '100%', lg: '25%' } }}>
                                    <Card className="weather-card main-weather-card" sx={{
                                        height: '100%',
                                        backgroundColor: '#0034a4',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <CardContent sx={{ 
                                            color: '#FFF', 
                                            textAlign: 'center', 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            justifyContent: 'center',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            {/* Location */}
                                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                                                {weatherData.name}, {weatherData.sys?.country}
                                            </Typography>

                                            {/* Weather Icon */}
                                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                                <Avatar
                                                    src={getMeteocon(weatherData.weather[0].icon)}
                                                    alt={weatherData.weather[0].description}
                                                    sx={{
                                                        width: 120,
                                                        height: 120,
                                                        backgroundColor: 'transparent',
                                                    }}
                                                />
                                            </Box>

                                            {/* Temperature */}
                                            {weatherData && (
                                                <Typography variant="h2" component="div" sx={{ fontWeight: 700 }}>
                                                    {unitSystem === 'metric' 
                                                        ? Math.round(weatherData.main.temp)
                                                        : Math.round((weatherData.main.temp))}
                                                    °{unitSystem === 'metric' ? 'C' : 'F'}
                                                </Typography>
                                            )}

                                            {/* AI-Generated Description */}
                                            <Typography variant="subtitle1" color="#FFF" sx={{ 
                                                textTransform: 'To.lower',
                                                my: 2,
                                                fontSize: '1.1rem',
                                                lineHeight: 1.4
                                            }}>
                                                {describeWeather(
                                                    unitSystem === 'metric' 
                                                        ? weatherData.main.temp 
                                                        : (weatherData.main.temp - 32) * 5/9, // Convert F to C for description
                                                    weatherData.weather[0].main.toLowerCase(),
                                                    weatherData.wind.speed,
                                                    weatherData.main.humidity,
                                                    weatherData.weather[0].icon.includes('d')
                                                )}
                                            </Typography>

                                            {/* Weather Details */}
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2, gap:1 }}>
                                                <Chip 
                                                    label={`Humidity: ${weatherData.main.humidity}%`}
                                                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', }} />
                                                <Chip 
                                                    label={`Feels Like: ${Math.floor(weatherData.main.feels_like)}${tempUnit}`}
                                                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                                                />
                                                <Chip 
                                                    label={`Wind: ${convertWindSpeed(weatherData.wind?.speed, unitSystem)} ${speedUnit}`}
                                                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Weather details panel */}
                                <Grid sx={{
                                    width: { xs: '100%', md: '100%', lg: '72%' },
                                    marginLeft: 'auto',
                                }}>
                                    <Card className="weather-card details-card" sx={{ height: '100%', backgroundColor: '#002471', borderRadius: '16px', }}>
                                        <CardContent sx={{ height: '100%', color: '#FFF', }}>
                                            <Typography variant="h6" gutterBottom>Weather Details</Typography>
                                            <Grid container spacing={2} sx={{
                                                width: '100%',
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: 'repeat(1, 1fr)',
                                                    sm: 'repeat(2, 1fr)',
                                                    md: 'repeat(3, 1fr)'
                                                }
                                            }}>
                                                {[
                                                    ['Pressure', `${weatherData.main.pressure} hPa`],
                                                    ['Min Temp', `${tempValue(weatherData.main.temp_min)}${tempUnit}`],
                                                    ['Max Temp', `${tempValue(weatherData.main.temp_max)}${tempUnit}`]
                                                ].map(([label, value]) => (
                                                    <Grid key={label} sx={{
                                                        width: '100% !important',
                                                        minWidth: 0,
                                                    }}>
                                                        <Card sx={{
                                                            height: '100%',
                                                            backgroundColor: '#FFF',
                                                            color: '#000',
                                                            borderRadius: '16px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}>
                                                            <CardContent sx={{ flexGrow: 1 }}>
                                                                <Typography variant="subtitle1">{label}</Typography>
                                                                <Typography variant="h6">{value}</Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            {/* Hourly Forecast Section */}
                                            <Box sx={{ width: '100%' }}>
                                                <Typography variant="h6" gutterBottom sx={{pt:1} }>Next 24 Hours</Typography>
                                                <Typography variant="p" sx={{ fontStyle: 'italic', color: '#808080',  }} gutterBottom>Updated in 3 hour intervals</Typography>
                                                <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, py: 1 }}>
                                                    {hourlyForecast.map((hour, index) => (
                                                        <Card key={index} sx={{ minWidth: 100, borderRadius: '16px' }}>
                                                            <CardContent sx={{ textAlign: 'center',  }}>
                                                                <Typography variant="subtitle2">
                                                                    {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Typography>
                                                                <Avatar
                                                                    src={getMeteocon(hour.weather[0].icon)}
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

                        {/* 5-day forecast - only shows when forecast data exists */}
                        {forecast.length > 0 && (
                            <Paper elevation={3} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                p: 5,
                                mt: 5,
                                backgroundColor: '#002471',
                                borderRadius: '16px',
                                mx: 'auto',
                            }}>
                                <Typography variant="h5" gutterBottom sx={{ color: '#FFF' }}>5-Day Forecast:</Typography>
                                <Grid container spacing={3} sx={{
                                    justifyContent: 'center',
                                    width: '100%'
                                }}>
                                    {forecast.map((day, index) => (
                                        <Grid key={index} sx={{width: { xs: '100%', md: 'auto' },
                                            maxWidth: { xs: '100%', md: 'none' },
                                        }}>
                                            <Card sx={{ textAlign: 'center', borderRadius: '16px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1">
                                                        {new Date(day.dt * 1000).toLocaleDateString("en-GB", {
                                                            weekday: "long",
                                                        })}
                                                    </Typography>
                                                    <Avatar
                                                        src={getMeteocon(day.weather[0].icon)}
                                                        alt={day.weather[0].description}
                                                        sx={{
                                                            width: 135,
                                                            height: 90,
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

                        {/* Show error or prompt if no weather data */}
                        {!weatherData && !firstLoad && !loading && (
                            <Typography textAlign="center" color="text.secondary">
                                {error || "Search for a city to see weather information"}
                            </Typography>
                        )}
                    </Paper>

                    {/* AdSense ad unit will be placed here */}
                    <AdPlaceholder height="150px" position="bottom" />

                    <CookieConsent /> {/* Cookie consent dialog */}
                    <Analytics/>

                    {/* Site footer */}
                    <Box component="footer" sx={{
                        mt: 10,
                        py: 3,
                        textAlign: 'center',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    }}>
                        <Typography variant="body2" color="#FFF" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            &copy; {new Date().getFullYear()} BarelyWeathery
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Typography variant="body2" color="#FFF" component="span">
                                <Link href="https://www.github.com/Synetraa1" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>
                                    My GitHub
                                </Link>
                            </Typography>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Link href="/privacy-policy" target="_blank" style={{ color: '#3f95ea', textDecoration: 'none' }}>
                                Privacy Policy
                            </Link>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Link href="/terms-of-service" target="_blank" style={{ color: '#3f95ea', textDecoration: 'none' }}>
                                Terms of Service
                            </Link>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Typography variant="body2" color="#FFF" component="span">
                                Powered by <Link href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#3f95ea', textDecoration: 'none' }}>
                                    OpenWeatherMap
                                </Link>
                            </Typography>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Typography variant="body2" color="#FFF" component="span">
                                Logo created with AI assistance
                            </Typography>
                        </Typography>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default App;
import React, { useEffect } from 'react';
import {
    Box, Container, Typography, Paper,
    CircularProgress, Grid, Card, CardContent, Avatar,
    Chip, Link,
} from '@mui/material';
import './styles/App.css';
import { getMeteocon } from './utils/weatherIcons'; 
import { ThemeProvider } from '@mui/material/styles';
import CookieConsent from './components/CookieConsent';
import Navbar from './components/navbar';
import AdPlaceholder from './components/AdPlaceholer';
import constants from './context/constants';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherSummary from './components/weathersummary';


// Main content component that uses the weather context
function WeatherApp() {
    const {
        weatherData,
        forecast,
        hourlyForecast,
        loading,
        error,
        unitSystem,
        firstLoad
    } = useWeather();

    // Get unit values from constants
    const { tempUnit, speedUnit } = constants.getUnits(unitSystem);
    const { tempValue, convertWindSpeed } = constants;

    // Show loading screen on first load
    if (loading && !weatherData) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Detecting your location...</Typography>
            </Container>
        );
    }

    return (
        <ThemeProvider theme={constants.theme}>
            <Container maxWidth="xl" sx={{
                py: 1,
                px: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                mt: '60px',
                mx: 'auto',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}>

                {/* Main content container */}
                <Paper elevation={3} sx={{
                    p: { xs: 1, sm: 2, md: 3, lg: 4 },
                    mb: 4,
                    backgroundColor: { xs: 'transparent', md: 'transparent', lg: '#636363' },
                    mx: 'auto',
                    maxWidth: '1300px',
                    width: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                }}>

                    {/* Weather display grid - only shows when data is loaded */}
                    {weatherData && (
                           <>
                        <Grid container spacing={2} sx={{
                        width: '100%',
                        mb: 4,
                        justifyContent: 'center',
                    }}>
                            {/* Current weather in weather card */}
                            <Grid sx={{ 
                                width: { xs: '100%', md: '100%', lg: '25%' },
                                mb: 2,
                            }}>
                                <Card className="weather-card main-weather-card" sx={{
                                    height: '100%',
                                    backgroundColor: '#0034a4',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    margin: { xs: '0 auto', md: 0 },
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}>
                                    <CardContent sx={{ 
                                        color: '#FFF', 
                                        textAlign: 'center', 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        p: { xs: 2, md: 3 },
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
                                        <Typography variant="h2" component="div" sx={{ fontWeight: 700 }}>
                                            {tempValue(weatherData.main.temp, unitSystem)}{tempUnit}
                                        </Typography>

                                        {/* Weather Description */}
                                        <Typography variant="subtitle1" color="#FFF" sx={{ 
                                            textTransform: 'capitalize',
                                            my: 2,
                                            fontSize: '1.1rem',
                                            lineHeight: 1.4
                                        }}>
                                            {weatherData.weather[0].description}
                                        </Typography>

                                        {/* Weather Details */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2, gap: 1}}>
                                            <Chip 
                                                label={`Humidity: ${weatherData.main.humidity}%`}
                                                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize:{xs:'14px', md:'26px', lg:'16px'}  }} />
                                            <Chip 
                                                label={`Feels Like: ${tempValue(weatherData.main.feels_like, unitSystem)}${tempUnit}`}
                                                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',  fontSize:{xs:'14px', md:'26px', lg:'16px'}  }} 
                                            />
                                            <Chip 
                                                label={`Wind: ${convertWindSpeed(weatherData.wind?.speed, unitSystem)} ${speedUnit}`}
                                                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',  fontSize:{xs:'14px', md:'26px', lg:'16px'}  }} 
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            

                            {/* Weather details panel */}
                            <Grid sx={{
                                width: { xs: '100%', md: '100%', lg: '73%' },
                                mx: 'auto',
                            }}>
                                <Card className="weather-card details-card" sx={{ 
                                    height: '97%', 
                                    backgroundColor: '#002471', 
                                    borderRadius: '16px',
                                    margin: { xs: '0 auto', md: 0 },
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}>
                                    <CardContent sx={{ 
                                        height: '100%', 
                                        color: '#FFF',
                                        p: { xs: 2, md: 3 },
                                    }}>
                                        <Typography variant="h6" gutterBottom>Weather Details</Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: {xs:'column', md:'row', lg:'row'},
                                            width: '100%',
                                            gap: 2,
                                        }} className="equal-height-container">
                                            {[
                                                ['Pressure', `${weatherData.main.pressure} hPa`],
                                                ['Min Temp', `${tempValue(weatherData.main.temp_min, unitSystem)}${tempUnit}`],
                                                ['Max Temp', `${tempValue(weatherData.main.temp_max, unitSystem)}${tempUnit}`]
                                            ].map(([label, value]) => (
                                                <Card key={label} className="weather-details-card" sx={{
                                                    backgroundColor: '#FFF',
                                                    color: '#000',
                                                    borderRadius: '16px',
                                                    width: {xs:'100%', md:'100%', lg:'20%'},
                                                    mb: 1
                                                }}>
                                                    <CardContent className="card-content-center" sx={{ 
                                                        '&:last-child': { pb: 2 }
                                                    }}>
                                                        <Typography variant="subtitle1" fontWeight="medium">{label}</Typography>
                                                        <Typography variant="h6">{value}</Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                        {/* Hourly Forecast Section */}
                                        <Box sx={{ width: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{pt:1}}>Next 24 Hours</Typography>
                                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#808080' }} gutterBottom>
                                            In 3 hour intervals
                                        </Typography>
                                        <Box className="scrollable-container forecast-scroll-container" sx={{ 
                                            width: '100%',
                                            WebkitOverflowScrolling: 'touch',
                                        }}>
                                            {hourlyForecast.map((hour, index) => (
                                                
                                                <Card key={index} className="hourly-forecast-card" sx={{
                                                    borderRadius: '16px',
                                                    backgroundColor: 'white'
                                                }}>
                                                    <CardContent className="card-content-center" sx={{ 
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="subtitle2">
                                                            {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            my: 1
                                                        }}>
                                                            <Avatar
                                                                src={getMeteocon(hour.weather[0].icon)}
                                                                alt={hour.weather[0].description}
                                                                sx={{
                                                                    width: { xs: 60, md: 70 },
                                                                    height: { xs: 60, md: 70 },
                                                                    backgroundColor: 'transparent'
                                                                }}
                                                            />
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {tempValue(hour.main.temp, unitSystem)}{tempUnit}
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
                        <WeatherSummary />
                        </>
                    )}

                {forecast.length > 0 && (
                    <Paper elevation={3} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: { xs: 2, md: 3 },
                        mt: 4,
                        backgroundColor: '#002471',
                        borderRadius: '16px',
                        mx: 'auto',
                        width: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, pt: 1 }}>5-Day Forecast</Typography>
                        <Box className="scrollable-container forecast-scroll-container" sx={{ 
                        flexWrap: { xs: 'nowrap', md: 'wrap' },
                        justifyContent: { xs: 'flex-start', md: 'space-between' },
                        overflowX: { xs: 'auto', md: 'visible' },
                        width: '100%',
                        pb: 2
                    }}>
                            {forecast.map((day, index) => (
                                <Card key={index} className="forecast-day-card" sx={{
                                    flex: { xs: '0 0 auto', md: '1 1 0' },
                                    maxWidth: { xs: 'none', md: '19%', },
                                    borderRadius: '16px',
                                    
                                }}>
                                    <CardContent className="card-content-center" sx={{ 
                                    textAlign: 'center',
                                }}>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {new Date(day.dt * 1000).toLocaleDateString("en-GB", {
                                                weekday: "long"
                                            })}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            my: 1,
                                        }}>
                                            <Avatar
                                                src={getMeteocon(day.weather[0].icon)}
                                                alt={day.weather[0].description}
                                                sx={{
                                                    width: { xs: 80, md: 100 },
                                                    height: { xs: 80, md: 100 },
                                                    backgroundColor: 'transparent',
                                                    my: 1
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h6">
                                            {tempValue(day.main.temp, unitSystem)}{tempUnit}
                                        </Typography>
                                        <Typography variant="caption">
                                            {day.weather[0].main}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Paper>
                    
                )}
                </Paper>

  
                {/* Show error or prompt if no weather data */}
                {!weatherData && !loading && (
                    <Typography textAlign="center" color="text.secondary">
                        {error || "Search for a city to see weather information"}
                    </Typography>
                )}


                {/* Site footer */}
                <Box component="footer" sx={{
                    mt: 10,
                    py: 3,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    width: '100%',
                    mx: 'auto',
                    px: 2,
                }}>
                    <Typography variant="body2" color="#FFF" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        &copy; {new Date().getFullYear()} BarelyWeathery
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
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

// Wrapper component that provides the context
function App() {
    return (
        <WeatherProvider>
            <AppContent />
        </WeatherProvider>
    );
}

// Component that holds the navbar and weather app content
function AppContent() {
    const { 
        unitSystem, 
        setUnitSystem, 
        city, 
        setCity, 
        useCurrentLocation, 
        setUseCurrentLocation, 
        fetchWeatherByCity, 
        loading 
    } = useWeather();

    return (
        <>
            <Navbar 
                unitSystem={unitSystem} 
                setUnitSystem={setUnitSystem} 
                setCity={setCity}
                useCurrentLocation={useCurrentLocation}
                setUseCurrentLocation={setUseCurrentLocation}
                onSearch={fetchWeatherByCity}
                loading={loading}
            />
            <WeatherApp />
        </>
    );
}

export default App;
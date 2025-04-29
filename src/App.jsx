import React, { useState, useEffect  } from 'react';
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
import StickyAdPlaceholder from './components/StickyAdPlaceholder';
import constants from './context/constants';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherSummary from './components/weathersummary';

const SunriseSunsetDisplay = ({ sunrise, sunset }) => {
    return (
      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "16px", 
        padding: "15px",
        color: "black"
      }}>
        <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>Sunrise & Sunset</Typography>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center", 
          marginBottom: "10px" 
        }}>
          <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>
            <img src="/icons/sunrise.svg" alt="Clear day icon" /></div>
            <div style={{ fontSize: "16px" }}>Sunrise</div>
            <div style={{ fontSize: "18px" }}>{sunrise}</div>
          </div>
          
          <div style={{ 
            height: "2px", 
            background: "linear-gradient(to right, #FFD700, #FF8C00)", 
            flex: 2,
            margin: "0 15px" 
          }}></div>
          
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: "24px", marginBottom: "5px" }}><img src="/icons/sunset.svg" alt="Clear day icon" /></div>
            <div style={{ fontSize: "16px" }}>Sunset</div>
            <div style={{ fontSize: "18px" }}>{sunset}</div>
          </div>
        </div>
        
        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "16px" }}>
          Day Length: {calculateDayLength(sunrise, sunset)}
        </div>
      </div>
    );
  };
  
  const calculateDayLength = (sunrise, sunset) => {
    // Parse times, handling AM/PM format
    const sunriseHours = parseInt(sunrise.split(':')[0]);
    const sunriseMinutes = parseInt(sunrise.split(':')[1].split(' ')[0]);
    const sunriseAmPm = sunrise.includes('PM') ? 'PM' : 'AM';
    
    const sunsetHours = parseInt(sunset.split(':')[0]);
    const sunsetMinutes = parseInt(sunset.split(':')[1].split(' ')[0]);
    const sunsetAmPm = sunset.includes('PM') ? 'PM' : 'AM';
    
    let sunrise24Hours = sunriseHours;
    if (sunriseAmPm === 'PM' && sunriseHours !== 12) sunrise24Hours += 12;
    if (sunriseAmPm === 'AM' && sunriseHours === 12) sunrise24Hours = 0;
    
    let sunset24Hours = sunsetHours;
    if (sunsetAmPm === 'PM' && sunsetHours !== 12) sunset24Hours += 12;
    if (sunsetAmPm === 'AM' && sunsetHours === 12) sunset24Hours = 0;
    
    let dayHours = sunset24Hours - sunrise24Hours;
    let dayMinutes = sunsetMinutes - sunriseMinutes;
    
    if (dayMinutes < 0) {
      dayHours--;
      dayMinutes += 60;
    }
    
    return `${dayHours}h ${dayMinutes}m`;
  };
  


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
                                    height: '102.5%',
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
                                    height: '100%', 
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
                                        flexDirection: 'column',
                                        width: '100%',
                                        gap: 1, // Reduce this gap between rows from 2 to 1
                                    }} className="equal-height-container"></Box>

                                    <Grid container spacing={2} sx={{ display: 'flex' }}>
                                    {/* Left side - Sunrise & Sunset Card taking 1/3 width */}
                                    <Grid sx={{ width: { xs: '100%', md: '33%' } }}>
                                        <Card sx={{
                                        height: '100%',
                                        backgroundColor: '#FFF',
                                        borderRadius: '16px',
                                        }}>
                                        <CardContent>
                                            
                                            <SunriseSunsetDisplay 
                                            sunrise={weatherData.formattedSunrise} 
                                            sunset={weatherData.formattedSunset} 
                                            />
                                        </CardContent>
                                        </Card>
                                    </Grid>
                                    
                                    {/* Right side - Weather details in 3 rows of 2 cards */}
                                    <Grid sx={{ width: { xs: '100%', md: '64%' }, display: 'flex', flexDirection: 'column' }}>
                                        {[
                                        [
                                            ['Pressure', `${weatherData.main.pressure} hPa`],
                                            ['Min Temp', `${tempValue(weatherData.main.temp_min, unitSystem)}${tempUnit}`]
                                        ],
                                        [
                                            ['Max Temp', `${tempValue(weatherData.main.temp_max, unitSystem)}${tempUnit}`],
                                            ['Cloud Cover', `${weatherData.clouds.all}%`]
                                        ],
                                        [
                                            ['Visibility', `${unitSystem === 'metric' ? weatherData.visibility : (weatherData.visibility * 0.621371).toFixed(1)} ${unitSystem === 'metric' ? 'km' : 'mi'}`],
                                            ['Precipitation (Past hour)', `${weatherData.rain && weatherData.rain['1h'] ? weatherData.rain['1h'] + ' mm' : 'None'}`]
                                        ]
                                        ].map((row, rowIndex) => (
                                        <Grid sx={{ display: 'flex', mb: rowIndex < 2 ? 2 : 0 }} key={`row-${rowIndex}`}>
                                            {row.map(([label, value], colIndex) => (
                                            <Grid sx={{ width: '50%', pr: colIndex === 0 ? 1 : 0, pl: colIndex === 1 ? 1 : 0 }} key={label}>
                                                <Card sx={{
                                                height: '100%',
                                                backgroundColor: '#FFF',
                                                borderRadius: '16px',
                                                }}>
                                                <CardContent sx={{ textAlign: 'center', py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                    <Typography variant="subtitle1" fontWeight="medium">{label}</Typography>
                                                    <Typography variant="h6">{value}</Typography>
                                                </CardContent>
                                                </Card>
                                            </Grid>
                                            ))}
                                        </Grid>
                                        ))}
                                    </Grid>
                                    </Grid>

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

    const [showStickyAd, setShowStickyAd] = useState(true);

    // Handler for closing the ad
    const handleAdClose = () => {
        setShowStickyAd(false);
        // Optionally save preference to localStorage
        localStorage.setItem('hideStickyAd', 'true');
    };

    // Check localStorage on component mount
    useEffect(() => {
        const adHidden = localStorage.getItem('hideStickyAd') === 'true';
        if (adHidden) {
            setShowStickyAd(false);
        }
    }, []);

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
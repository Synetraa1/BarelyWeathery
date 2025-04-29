import { createContext, useState, useCallback, useContext, useRef, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Create the context
const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const toggleInProgress = useRef(false);
  
  // Store original API response data for proper unit conversion
  const [originalWeatherData, setOriginalWeatherData] = useState(null);
  const [originalForecastData, setOriginalForecastData] = useState(null);

  // Utility functions for temperature and wind speed conversion
  const convertTemperature = (temp, toUnit) => {
    if (toUnit === 'imperial') {
      // Convert Celsius to Fahrenheit
      return Math.round((temp * 9/5) + 32);
    } else {
      // Convert Fahrenheit to Celsius
      return Math.round((temp - 32) * 5/9);
    }
  };
  
  const convertWindSpeed = (speed, toUnit) => {
    if (toUnit === 'imperial') {
      // Convert m/s to mph
      return speed * 2.237;
    } else {
      // Convert mph to m/s
      return speed / 2.237;
    }
  };
  
  const convertVisibility = (visibilityInMeters, toUnit) => {
    if (toUnit === 'imperial') {
      // Convert meters to miles
      return +((visibilityInMeters / 1000) * 0.621371).toFixed(1);
    } else {
      // Convert meters to kilometers
      return +(visibilityInMeters / 1000).toFixed(1);
    }
  };
  
  // Fetch weather on initial load
  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUseCurrentLocation(false);
          // Fallback to a default city
          fetchWeatherByCity("London");
        }
      );
    } else if (city) {
      fetchWeatherByCity(city);
    } else {
      // Default city if no location or city is set
      fetchWeatherByCity("London");
    }
  }, []);

  // Memoized fetch function
  const fetchWeatherData = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data unavailable');
    return await response.json();
  }, []);

  // Function to get sunrise and sunset data
  const processSunriseSunset = useCallback((data) => {
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    
    const sunriseTime = new Date(sunriseTimestamp * 1000);
    const sunsetTime = new Date(sunsetTimestamp * 1000);
    
    return {
      ...data,
      formattedSunrise: sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formattedSunset: sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, []);

  // Helper function for weather descriptions
  const getWeatherDescription = (temp, condition, windSpeed, humidity, isDay, visibility) => {
    return `Weather condition: ${condition}, Temperature: ${temp}°${unitSystem === 'metric' ? 'C' : 'F'}`;
  };

  // Common data processing function with unit conversion
  const processWeatherData = useCallback((current, forecastData, cityName, fromUnit = unitSystem, toUnit = unitSystem) => {
    // Clone the data to avoid mutating the original objects
    let processedCurrent = { ...current };
    let processedForecast = { ...forecastData };
    
    
    // Add sunrise and sunset data
    processedCurrent = processSunriseSunset(processedCurrent);

    // Convert visibility
    processedCurrent.visibility = convertVisibility(processedCurrent.visibility, toUnit);
    
    // Process forecast visibility
    processedForecast.list = processedForecast.list.map(item => ({
      ...item,
      visibility: convertVisibility(item.visibility, toUnit)
    }));

    // Additional unit conversions if changing unit systems
    if (fromUnit !== toUnit) {
      // Convert current weather data
      processedCurrent.main.temp = convertTemperature(processedCurrent.main.temp, toUnit);
      processedCurrent.main.feels_like = convertTemperature(processedCurrent.main.feels_like, toUnit);
      processedCurrent.main.temp_min = convertTemperature(processedCurrent.main.temp_min, toUnit);
      processedCurrent.main.temp_max = convertTemperature(processedCurrent.main.temp_max, toUnit);
      processedCurrent.wind.speed = convertWindSpeed(processedCurrent.wind.speed, toUnit);

      // Convert forecast data
      processedForecast.list = processedForecast.list.map(item => ({
        ...item,
        main: {
          ...item.main,
          temp: convertTemperature(item.main.temp, toUnit),
          feels_like: convertTemperature(item.main.feels_like, toUnit),
          temp_min: convertTemperature(item.main.temp_min, toUnit),
          temp_max: convertTemperature(item.main.temp_max, toUnit)
        },
        wind: {
          ...item.wind,
          speed: convertWindSpeed(item.wind.speed, toUnit)
        }
      }));
    }
    
    setWeatherData({
      ...processedCurrent,
      description: getWeatherDescription(
        processedCurrent.main.temp,
        processedCurrent.weather[0].main.toLowerCase(),
        processedCurrent.wind.speed,
        processedCurrent.main.humidity,
        processedCurrent.weather[0].icon.includes('d')
      )
    });
    
    setCity(cityName || processedCurrent.name);
    setForecast(processedForecast.list.filter((_, i) => i % 8 === 0).slice(0, 5));
    setHourlyForecast(processedForecast.list.slice(0, 8));
  }, [unitSystem]);

  // Weather fetching functions
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitSystem}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitSystem}`;
  
      const [current, forecast] = await Promise.all([
        fetchWeatherData(weatherUrl),
        fetchWeatherData(forecastUrl)
      ]);

      // Store original API responses
      setOriginalWeatherData(current);
      setOriginalForecastData(forecast);

      processWeatherData(current, forecast);
    } catch (err) {
      setError(err.message);
      setUseCurrentLocation(false);
    } finally {
      setLoading(false);
      toggleInProgress.current = false;
    }
  }, [unitSystem, fetchWeatherData, processWeatherData]);

  const fetchWeatherByCity = useCallback(async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unitSystem}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unitSystem}`;

      const [current, forecast] = await Promise.all([
        fetchWeatherData(weatherUrl),
        fetchWeatherData(forecastUrl)
      ]);

      // Store original API responses
      setOriginalWeatherData(current);
      setOriginalForecastData(forecast);

      processWeatherData(current, forecast, cityName);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather for this city');
    } finally {
      setLoading(false);
      toggleInProgress.current = false;
    }
  }, [unitSystem, fetchWeatherData, processWeatherData]);

  // Toggle unit system function with unit conversion
  const toggleUnitSystem = useCallback(() => {
    // Return early if already toggling
    if (toggleInProgress.current) {
      console.log('Context toggle already in progress, ignoring');
      return;
    }
    
    // Set flags to prevent multiple executions and show loading state
    toggleInProgress.current = true;
    setLoading(true);
    
    // Create the new unit system value
    const newUnitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    
    // Important: We'll now use the ORIGINAL API data to convert properly
    if (weatherData && originalWeatherData && originalForecastData) {
      // Update state
      setUnitSystem(newUnitSystem);
      
      // Use the original API data for conversion
      processWeatherData(originalWeatherData, originalForecastData, city, unitSystem, newUnitSystem);
      
      setTimeout(() => {
        toggleInProgress.current = false;
        setLoading(false);
      }, 300);
    } else {
      // If no data exists yet, just update the unit system and fetch new data
      setUnitSystem(newUnitSystem);
      
      if (city) {
        fetchWeatherByCity(city);
      } else if (useCurrentLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          error => {
            console.error('Geolocation error:', error);
            setUseCurrentLocation(false);
            setError('Could not get location. Please search for a city.');
            toggleInProgress.current = false;
            setLoading(false);
          }
        );
      } else {
        toggleInProgress.current = false;
        setLoading(false);
      }
    }
  }, [city, weatherData, originalWeatherData, originalForecastData, unitSystem, processWeatherData, fetchWeatherByCity, fetchWeatherByCoords, useCurrentLocation]);

  const value = {
    unitSystem,
    weatherData,
    forecast,
    hourlyForecast,
    city,
    loading,
    error,
    useCurrentLocation,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    toggleUnitSystem,
    setUnitSystem,
    setUseCurrentLocation,
    setCity
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
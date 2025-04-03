import { createContext, useState, useCallback, useContext, useRef } from 'react';
import { describeWeather } from '../utils/weatherdescriptions';

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

  // Memoized fetch function
  const fetchWeatherData = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data unavailable');
    return await response.json();
  }, []);

  // Common data processing function
  const processWeatherData = useCallback((current, forecastData, cityName) => {
    setWeatherData({
      ...current,
      description: describeWeather(
        current.main.temp,
        current.weather[0].main.toLowerCase(),
        current.wind.speed,
        current.main.humidity,
        current.weather[0].icon.includes('d')
      )
    });
    
    setCity(cityName || current.name);
    setForecast(forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5));
    setHourlyForecast(forecastData.list.slice(0, 8));
  }, []);

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

      console.log('API Response (Current):', current);
      console.log('Temperature from API:', current.main.temp);
      console.log('Unit System:', unitSystem);

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

      processWeatherData(current, forecast, cityName);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather for this city');
    } finally {
      setLoading(false);
      toggleInProgress.current = false;
    }
  }, [unitSystem, fetchWeatherData, processWeatherData]);

// Toggle unit system function with fixes
const toggleUnitSystem = useCallback(() => {
    // Return early if already toggling
    if (toggleInProgress.current) {
      console.log('Context toggle already in progress, ignoring');
      return;
    }
    
    // Set flags to prevent multiple executions and show loading state
    toggleInProgress.current = true;
    setLoading(true);
    console.log('Toggle initiated');
    
    // Create the new unit system value
    const newUnitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    console.log('Changing to:', newUnitSystem);
    
    // Important: Clear current data to prevent showing incorrect units during transition
    setWeatherData(null);
    setForecast([]);
    setHourlyForecast([]);
    
    // Update state
    setUnitSystem(newUnitSystem);
    
    // Define a function to reset the toggle flag and loading state
    const resetToggleFlag = () => {
      toggleInProgress.current = false;
      setLoading(false);
      console.log('Toggle completed');
    };
  
    // Add timestamp to prevent caching
    const timestamp = Date.now();
    
    // Refetch data with the new unit system
    if (city) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${newUnitSystem}&_=${timestamp}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${newUnitSystem}&_=${timestamp}`;
      
      console.log('Fetching new weather with units:', newUnitSystem);
      
      Promise.all([
        fetchWeatherData(weatherUrl),
        fetchWeatherData(forecastUrl)
      ])
        .then(([current, forecast]) => {
          console.log('Received new weather data:', current.main.temp, newUnitSystem);
          processWeatherData(current, forecast, city);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setError(error.message || 'Failed to fetch weather for this city');
        })
        .finally(resetToggleFlag);
    } else if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${newUnitSystem}&_=${timestamp}`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${newUnitSystem}&_=${timestamp}`;
          
          console.log('Fetching new weather with units:', newUnitSystem);
          
          Promise.all([
            fetchWeatherData(weatherUrl),
            fetchWeatherData(forecastUrl)
          ])
            .then(([current, forecast]) => {
              console.log('Received new weather data:', current.main.temp, newUnitSystem);
              processWeatherData(current, forecast);
            })
            .catch(error => {
              console.error('Error fetching weather:', error);
              setError(error.message);
              setUseCurrentLocation(false);
            })
            .finally(resetToggleFlag);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setUseCurrentLocation(false);
          resetToggleFlag();
        }
      );
    } else {
      setTimeout(resetToggleFlag, 500);
    }
  }, [city, useCurrentLocation, fetchWeatherData, processWeatherData, unitSystem]);

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
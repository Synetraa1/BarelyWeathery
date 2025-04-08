import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import constants from '../context/constants';

const WeatherSummary = () => {
  const { weatherData, unitSystem } = useWeather();
  const [summary, setSummary] = useState("Loading your personalized weather summary...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { tempUnit, speedUnit } = constants.getUnits(unitSystem);
  const { tempValue, convertWindSpeed } = constants;

  // Custom weather insight generator
  const generateInsight = (data, unit) => {
    if (!data) return "";
    
    const temp = data.main?.temp;
    const feelsLike = data.main?.feels_like;
    const description = data.weather?.[0]?.description || 'clear';
    const humidity = data.main?.humidity;
    const windSpeed = data.wind?.speed;
    const cityName = data.name;
    const isDay = data.weather?.[0]?.icon?.includes('d');
    
    const formattedTemp = tempValue(temp, unit);
    const formattedFeelsLike = tempValue(feelsLike, unit);
    const formattedWindSpeed = windSpeed !== undefined ? 
      convertWindSpeed(windSpeed, unit) : 'N/A';
    
    // Temperature categorization
    const categorizeTemp = (temp) => {
      if (unit === 'imperial') {
        if (temp > 85) return 'hot';
        if (temp > 70) return 'warm';
        if (temp > 55) return 'mild';
        if (temp > 40) return 'cool';
        if (temp > 32) return 'cold';
        return 'freezing';
      } else {
        if (temp > 29) return 'hot';
        if (temp > 21) return 'warm';
        if (temp > 12) return 'mild';
        if (temp > 4) return 'cool';
        if (temp > 0) return 'cold';
        return 'freezing';
      }
    };

    const tempCategory = categorizeTemp(formattedTemp);
    
    // Clothing suggestions based on temperature
    const clothingSuggestions = {
      hot: 'Wear light, breathable clothing and don\'t forget sunscreen.',
      warm: 'A light jacket might be handy, especially if you\'re out late.',
      mild: 'A medium-weight jacket should keep you comfortable throughout the day.',
      cool: 'You\'ll want a warm jacket when heading outside.',
      cold: 'Bundle up with a warm coat, hat, and gloves before venturing outdoors.',
      freezing: 'Dress in multiple layers with a heavy coat, hat, gloves, and scarf for these freezing temperatures.'
    };

    // Weather condition descriptions
    const getWeatherDescription = () => {
      const timePhrase = isDay ? "today" : "tonight";
      
      const weatherDescriptions = {
        'clear': isDay 
          ? `The sky is beautifully clear in ${cityName} ${timePhrase}` 
          : `The night sky is clear in ${cityName} ${timePhrase}`,
        'cloud': `${cityName} is experiencing cloudy skies ${timePhrase}`,
        'rain': `It's rainy in ${cityName} ${timePhrase}, so have an umbrella handy`,
        'snow': `${cityName} is seeing snowfall ${timePhrase}, making for a winter wonderland`,
        'fog': `There's fog in ${cityName} ${timePhrase}, reducing visibility`,
        'storm': `${cityName} is experiencing stormy conditions ${timePhrase}, so stay safe indoors if possible`
      };

      // Find the first matching description
      for (let key in weatherDescriptions) {
        if (description.includes(key)) {
          return weatherDescriptions[key];
        }
      }

      // Fallback
      return `${cityName} is experiencing ${description} ${timePhrase}`;
    };

    // Generate feels-like comparison
    const getFeelsLikePhrase = () => {
      const tempDiff = Math.abs(formattedTemp - formattedFeelsLike);
      const isWindy = formattedWindSpeed > (unit === 'imperial' ? 10 : 15);
      
      if (tempDiff > 3) {
        return formattedFeelsLike < formattedTemp
          ? `though it feels colder at ${formattedFeelsLike}${tempUnit} due to the ${isWindy ? 'wind' : 'conditions'}`
          : `though it feels warmer at ${formattedFeelsLike}${tempUnit} due to the ${humidity > 70 ? 'humidity' : 'conditions'}`;
      }
      
      return `with a feels-like temperature of ${formattedFeelsLike}${tempUnit}`;
    };

    // Wind description
    const getWindPhrase = () => {
      const isWindy = formattedWindSpeed > (unit === 'imperial' ? 10 : 15);
      const isVeryWindy = formattedWindSpeed > (unit === 'imperial' ? 20 : 30);
      
      if (isVeryWindy) {
        return `Strong winds at ${formattedWindSpeed} ${speedUnit} are making conditions more challenging`;
      }
      
      if (isWindy) {
        return `The ${formattedWindSpeed} ${speedUnit} breeze adds a bit of a chill`;
      }
      
      return `With light winds of ${formattedWindSpeed} ${speedUnit}`;
    };

    // Combine everything into a natural-sounding insight
    return `${getWeatherDescription()} with a temperature of ${formattedTemp}${tempUnit}, ${getFeelsLikePhrase()}. ${getWindPhrase()}, and humidity at ${humidity}%. ${clothingSuggestions[tempCategory]}`;
  };

  useEffect(() => {
    if (weatherData) {
      setIsLoading(true);
      
      try {
        const generatedInsight = generateInsight(weatherData, unitSystem);
        setSummary(generatedInsight);
        setError(null);
      } catch (err) {
        console.error('Error generating weather insight:', err);
        setError('Could not generate weather summary at this time');
        
        // Create basic fallback
        const fallback = `It's currently ${tempValue(weatherData.main?.temp, unitSystem)}${tempUnit} in ${weatherData.name} with ${weatherData.weather?.[0]?.description || 'current conditions'}. Feels like ${tempValue(weatherData.main?.feels_like, unitSystem)}${tempUnit} with wind at ${convertWindSpeed(weatherData.wind?.speed, unitSystem)} ${speedUnit} and humidity at ${weatherData.main?.humidity || 'N/A'}%.`;
        setSummary(fallback);
      } finally {
        setIsLoading(false);
      }
    }
  }, [weatherData, unitSystem]);

  if (!weatherData) return null;

  return (
    <Card sx={{ 
      backgroundColor: '#002471', 
      borderRadius: '16px',
      mt: 2,
      color: 'white',
      width: '100%',
      mx: 'auto',
      maxWidth: '1300px',
      mb: 5,
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{fontWeight:'500'}}>
          Weather Insights
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
            <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
            <Typography variant="body1">
              Generating your personalized weather summary...
            </Typography>
          </Box>
        ) : error ? (
          <Box>
            <Typography variant="body1" sx={{ py: 2, lineHeight: 1.6 }}>
              {summary}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              Basic weather information
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ py: 2, lineHeight: 1.6 }}>
              {summary}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              Weather insight based on current conditions
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
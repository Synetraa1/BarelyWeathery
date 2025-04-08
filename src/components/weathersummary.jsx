import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import constants from '../contexts/constants';

const WeatherSummary = () => {
  const { weatherData, unitSystem } = useWeather();
  const [summary, setSummary] = useState("Loading your personalized weather summary...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { tempUnit, speedUnit } = constants.getUnits(unitSystem);

  const getWeatherContext = (weatherId) => {
    if (!weatherId) return '';
    
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'drizzle';
    if (weatherId >= 500 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'atmospheric condition';
    if (weatherId === 800) return 'clear sky';
    if (weatherId > 800) return 'cloudy';
    
    return '';
  };

  useEffect(() => {
    const generateSummary = async () => {
      if (!weatherData) return;
      
      setIsLoading(true);
      setError(null);
      
      const weatherDescription = weatherData.weather?.[0]?.description || 'Unknown';
      const formattedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
      
      const temperature = weatherData.main?.temp;
      const formattedTemp = temperature ? Math.round(temperature) : 'N/A';
      
      const feelsLike = weatherData.main?.feels_like;
      const formattedFeelsLike = feelsLike ? Math.round(feelsLike) : 'N/A';
      
      const iconCode = weatherData.weather?.[0]?.icon || '';
      const isDaytime = iconCode.endsWith('d') ? 'during the day' : iconCode.endsWith('n') ? 'at night' : '';
      
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `Generate a friendly, conversational 2-3 sentence weather summary based on these conditions:
              Location: ${weatherData.name}, ${weatherData.sys?.country || ''}
              Temperature: ${formattedTemp}°C (feels like ${formattedFeelsLike}°C)
              Conditions: ${formattedDescription} ${isDaytime}
              Wind: ${weatherData.wind?.speed || 'N/A'} ${speedUnit}
              Humidity: ${weatherData.main?.humidity || 'N/A'}%
              Weather ID: ${weatherData.weather?.[0]?.id || 'Unknown'}
              Main Weather Type: ${weatherData.weather?.[0]?.main || 'Unknown'}
              
              The summary should be natural-sounding, personalized, and highlight the most important aspects of the weather. Don't just list the data - create a helpful summary that emphasizes what the weather actually feels like and any notable conditions. Include practical advice if relevant.`
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate weather summary');
        }
        
        const data = await response.json();
        
        const generatedText = data[0]?.generated_text || '';
        const summaryText = generatedText.split('The summary should be')[1]?.split('\n\n')[1] || generatedText;
        
        setSummary(summaryText);
      } catch (err) {
        console.error('Error generating summary:', err);
        setError('Could not generate weather summary at this time');
        setSummary(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (weatherData) {
      generateSummary();
    }
  }, [weatherData, speedUnit, unitSystem]);

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
      mb:5,
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
          <Typography variant="body1" color="error.light" sx={{ py: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ py: 2, lineHeight: 1.6 }}>
              {summary}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              AI-generated summary based on current conditions
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
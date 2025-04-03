export const describeWeather = (temp, condition, windSpeed, humidity = 50, iconContainsD = true, hourOfDay = null) => {
    if (typeof temp !== 'number' || typeof windSpeed !== 'number') {
      throw new Error('Invalid temperature or wind speed');
    }
    
    // Determine time of day
    let timeOfDay;
    
    if (hourOfDay === null) {
      // If no hour is provided, use the iconContainsD parameter as before
      timeOfDay = iconContainsD ? 'day' : 'night';
    } else {
      // Use the hour to determine more specific time of day
      const hour = typeof hourOfDay === 'number' ? hourOfDay : new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        timeOfDay = 'morning';
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon';
      } else if (hour >= 18 && hour < 22) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'night';
      }
    }
    
    const tempDescriptor =
      temp < -15 ? 'Arctic blast ❄️☃️' :
      temp < -5 ? 'Freezing cold ❄️' :
      temp < 5 ? 'Very chilly 🥶' :
      temp < 10 ? 'Cool 🧊' :
      temp < 15 ? 'Pleasant 🌤️' :
      temp < 25 ? 'Warm ☀️' : 'Hot 🔥';
    
    // Enhanced conditions based on time of day
    const conditions = {
      clear: {
        morning: 'clear morning sky 🌅',
        afternoon: 'sunny ☀️',
        evening: 'clear evening sky 🌇',
        night: 'clear night sky 🌙✨'
      },
      clouds: {
        morning: 'cloudy morning ☁️',
        afternoon: 'cloudy ☁️',
        evening: 'cloudy evening ☁️',
        night: 'cloudy night ☁️🌙'
      },
      rain: humidity > 80 ? {
        morning: 'heavy morning rain 🌧️',
        afternoon: 'heavy rain 🌧️',
        evening: 'heavy evening rain 🌧️',
        night: 'heavy night rain 🌧️'
      } : {
        morning: 'light morning showers 🌦️',
        afternoon: 'light rain 🌦️',
        evening: 'light evening showers 🌦️',
        night: 'light night showers 🌦️'
      },
      drizzle: {
        morning: 'morning drizzle 🌧️',
        afternoon: 'drizzling 🌧️',
        evening: 'evening drizzle 🌧️',
        night: 'night drizzle 🌧️'
      },
      snow: {
        morning: 'morning snow ❄️',
        afternoon: 'snowing ❄️',
        evening: 'evening snow ❄️',
        night: 'night snow ❄️🌙'
      },
      thunderstorm: {
        morning: 'morning thunderstorm ⚡🌧️',
        afternoon: 'thunderstorm ⚡🌧️',
        evening: 'evening thunderstorm ⚡🌧️',
        night: 'night thunderstorm ⚡🌧️'
      },
      mist: {
        morning: 'misty morning 🌫️',
        afternoon: 'misty 🌫️',
        evening: 'misty evening 🌫️',
        night: 'misty night 🌫️'
      },
      fog: {
        morning: 'foggy morning 🌁',
        afternoon: 'foggy 🌁',
        evening: 'foggy evening 🌁',
        night: 'foggy night 🌁'
      }
    };
    
    // Get the condition descriptor based on condition and time of day
    const conditionLower = condition.toLowerCase();
    const conditionObject = conditions[conditionLower];
    let conditionDescriptor;
    
    if (conditionObject && conditionObject[timeOfDay]) {
      conditionDescriptor = conditionObject[timeOfDay];
    } else {
      // Fallback if specific time description isn't available
      conditionDescriptor = conditionLower;
    }
    
    const windDescriptor =
      windSpeed > 40 ? ' with violent winds 🌪️' :
      windSpeed > 30 ? ' with strong winds 💨' :
      windSpeed > 20 ? ', very breezy' :
      windSpeed > 10 ? ', breezy' : '';
    
    const humidityEffect =
      humidity > 80 ? ' High humidity makes it feel muggy.' :
      humidity < 30 ? ' Low humidity makes it feel crisp.' : '';
    
    // Time-specific suggestions
    const timeBasedSuggestions = {
      morning: {
        hot: 'Apply sunscreen before heading out! ⛱️',
        cold: 'Grab a warm jacket and hat! 🧥',
        rain: 'Take an umbrella for your commute! ☔',
        default: 'Great morning to start the day!'
      },
      afternoon: {
        hot: 'Stay hydrated and find some shade! 💧',
        cold: 'Keep bundled up! 🧣',
        rain: 'Perfect time for indoor activities! ☕',
        default: 'Enjoy your afternoon!'
      },
      evening: {
        hot: 'A good time for a cool evening walk. 🚶‍♂️',
        cold: 'Cozy up with a warm drink! 🍵',
        rain: 'Movie night is a good idea! 🎬',
        default: 'Enjoy your evening!'
      },
      night: {
        hot: 'Keep windows open for a cool night. 🌬️',
        cold: 'Extra blankets recommended tonight! 🛌',
        rain: 'Fall asleep to the sound of rain. 😴',
        default: 'Sleep well! 💤'
      }
    };
    
    let suggestion;
    if (condition.includes('thunder')) {
      suggestion = 'Stay indoors and avoid electronics! ⚡';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      suggestion = timeBasedSuggestions[timeOfDay].rain;
    } else if (temp > 28) {
      suggestion = timeBasedSuggestions[timeOfDay].hot;
    } else if (temp < 2) {
      suggestion = timeBasedSuggestions[timeOfDay].cold;
    } else {
      suggestion = timeBasedSuggestions[timeOfDay].default;
    }
    
    return `${tempDescriptor} and ${conditionDescriptor}${windDescriptor}.${humidityEffect} ${suggestion}`;
  };
  
  // Enhanced caching with expiration
  const descriptionCache = new Map();
  export const getCachedDescription = (temp, condition, windSpeed, humidity, iconContainsD, hourOfDay = null) => {
    // Include hour in the cache key
    const key = `${temp}_${condition}_${windSpeed}_${humidity}_${iconContainsD}_${hourOfDay}`;
    const now = Date.now();
    
    if (!descriptionCache.has(key) || (now - descriptionCache.get(key).timestamp) > 3600000) { // 1 hour cache
      descriptionCache.set(key, {
        description: describeWeather(temp, condition, windSpeed, humidity, iconContainsD, hourOfDay),
        timestamp: now
      });
    }
    
    return descriptionCache.get(key).description;
  };
  
  // Utility function to clear cache
  export const clearWeatherCache = () => descriptionCache.clear();
export const getMeteocon = (openWeatherIconCode) => {
    const iconMap = {
        // Clear
        '01d': '/icons/clear-day.svg',
        '01n': '/icons/clear-night.svg',

        // Clouds
        '02d': '/icons/partly-cloudy-day.svg',
        '02n': '/icons/partly-cloudy-night.svg',
        '03d': '/icons/cloudy.svg',
        '03n': '/icons/cloudy.svg',
        '04d': '/icons/overcast-day.svg',
        '04n': '/icons/overcast-night.svg',

        // Rain
        '09d': '/icons/rain.svg',
        '09n': '/icons/rain.svg',
        '10d': '/icons/partly-cloudy-day-rain.svg',
        '10n': '/icons/partly-cloudy-night-rain.svg',

        // Thunderstorm
        '11d': '/icons/thunderstorm-day.svg',
        '11n': '/icons/thunderstorm-night.svg',

        // Snow
        '13d': '/icons/snow.svg',
        '13n': '/icons/snow.svg',

        // Atmosphere
        '50d': '/icons/fog.svg',
        '50n': '/icons/fog.svg',

        // Default
        'default': '/icons/not-available.svg'
    };

    return iconMap[openWeatherIconCode] || iconMap.default;
};

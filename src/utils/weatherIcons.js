export const getMeteocon = (openWeatherIconCode) => {
    const iconMap = {
        // Clear
        '01d': '/public/icons/clear-day.svg',
        '01n': '/public/icons/clear-night.svg',

        // Clouds
        '02d': '/public/icons/partly-cloudy-day.svg',
        '02n': '/public/icons/partly-cloudy-night.svg',
        '03d': '/public/icons/cloudy.svg',
        '03n': '/public/icons/cloudy.svg',
        '04d': '/public/icons/overcast-day.svg',
        '04n': '/public/icons/overcast-night.svg',

        // Rain
        '09d': '/public/icons/rain.svg',
        '09n': '/public/icons/rain.svg',
        '10d': '/public/icons/partly-cloudy-day-rain.svg',
        '10n': '/public/icons/partly-cloudy-night-rain.svg',

        // Thunderstorm
        '11d': '/public/icons/thunderstorm-day.svg',
        '11n': '/public/icons/thunderstorm-night.svg',

        // Snow
        '13d': '/public/icons/snow.svg',
        '13n': '/public/icons/snow.svg',

        // Atmosphere
        '50d': '/public/icons/fog.svg',
        '50n': '/public/icons/fog.svg',

        // Default
        'default': '/public/icons/not-available.svg'
    };

    return iconMap[openWeatherIconCode] || iconMap.default;
};
# BarelyWeathery App Documentation

## Overview

BarelyWeather is a simple, user-friendly weather application that provides real-time weather information and forecasts. The application is hosted at [barelyweathery.com](https://barelyweathery.com).

## Features

- **Current Weather Conditions**: View real-time weather data including temperature, humidity, wind speed, and conditions.
- **Weather Forecasts**: Access daily and hourly weather forecasts.
- **Location-Based Weather**: Get weather information for your current location or search for specific locations.
- **Responsive Design**: User-friendly interface that works across desktop and mobile devices.

## Technology Stack

- **Frontend**: Built with React and MUI (Material-UI) library
- **Build Tool**: Vite for fast development and optimized production builds
- **Weather Data**: Leverages a third-party weather API for accurate, up-to-date information
- **Geolocation**: Uses browser geolocation services to detect user location

## User Guide

### Getting Started

1. **Access the Application**: Navigate to [barelyweathery.com](https://barelyweathery.com) in your web browser.

2. **Location Permissions**: Upon first visit, the app will request permission to access your location. Allow this for the most accurate local weather information.

3. **Default View**: The app will display current weather conditions for your location (if permissions are granted) or a default location.

### Using the Application

#### Viewing Current Weather

The main screen displays:
- Current temperature
- Weather condition (sunny, cloudy, rainy, etc.)
- Feels-like temperature
- Humidity percentage
- Wind speed and direction
- Visibility
- Pressure

#### Checking the Forecast

- **Daily Forecast**: Scroll down or navigate to the forecast section to view weather predictions for the upcoming days.
- **Hourly Forecast**: View hour-by-hour weather predictions to plan your day accordingly.

#### Changing Locations

1. Click on the search icon or search bar.
2. Enter a city name, postal code, or address.
3. Select from the suggested locations if multiple options appear.
4. The weather display will update to show information for the selected location.

#### Settings and Preferences

- **Units**: Toggle between metric (Celsius, km/h) and imperial (Fahrenheit, mph) units.
- **Theme**: Switch between light and dark modes (if available).
- **Saved Locations**: Save frequently checked locations for quick access.

## Developer Information

### Repository Structure

The WeatherApp repository is structured as a React + Vite application with MUI components:

- **src/**: Source code directory
  - **components/**: React component files
  - **assets/**: Icons, images, and other static resources
  - **hooks/**: Custom React hooks
  - **utils/**: Utility functions
  - **context/**: React context providers
  - **App.jsx**: Main application component
  - **main.jsx**: Entry point for the React application
- **public/**: Static files served directly
- **index.html**: HTML entry point
- **vite.config.js**: Vite configuration
- **package.json**: Project dependencies and scripts

### API Integration

The application integrates with a weather data API to fetch:
- Current weather conditions
- Weather forecasts (hourly and daily)
- Location data based on coordinates or search queries

The React components use hooks to manage API calls and state, while MUI components provide the user interface elements with Material Design styling.

## Troubleshooting

### Common Issues

- **Location Not Found**: Ensure you've entered a valid location name or postal code.
- **Weather Data Not Loading**: Check your internet connection or try refreshing the page.
- **Inaccurate Location**: Your IP-based location might differ from your actual location. Use the search function to enter your specific location.
- **Permission Denied**: If you previously denied location access, you'll need to update your browser settings to allow location access for barelyweather.com.

### Browser Compatibility

BarelyWeather is designed to work with modern web browsers including:
- Google Chrome (recommended)
- Mozilla Firefox
- Safari
- Microsoft Edge

For the best experience, ensure your browser is updated to the latest version.

## Privacy Information

- **Location Data**: Your location data is used solely to provide accurate weather information and is not stored persistently on our servers.
- **Usage Data**: Anonymous usage statistics may be collected to improve the application.
- **Third-Party Services**: Weather data is sourced from third-party APIs, which have their own privacy policies.

## Contact and Support

For issues, feedback, or questions about BarelyWeather, please:
- Create an issue on the [GitHub repository](https://github.com/Synetraa1/WeatherApp)
- Contact the developer through GitHub


*Last updated: March 30, 2025*

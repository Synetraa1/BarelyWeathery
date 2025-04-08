import { createTheme } from '@mui/material/styles';

const constants = {
    theme: createTheme({
        typography: {
            fontFamily: [
                'Roboto', // The chosen font
                'Arial', // Fallback
                'sans-serif'
            ].join(','),
        },
    }),
    
    // Temperature unit helper functions
    getUnits: (unitSystem) => {
        const tempUnit = unitSystem === 'metric' ? String.fromCharCode(176) + 'C' : String.fromCharCode(176) + 'F';
        const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';
        
        return { tempUnit, speedUnit };
    },
    
    // Format temperature value
    tempValue: (temp, unitSystem) => {
        if (unitSystem === 'imperial') {
          return Math.round((temp * 9/5) + 32);
        }
        // For metric, just round the value (assuming API returns Celsius)
        return Math.round(temp);
      },
    
    // Convert wind speed based on unit system selected
    convertWindSpeed: (speed, unitSystem) => {
        if (unitSystem === 'metric') {
            return Math.round(speed * 3.6);
        }
        // Already in mph for imperial
        return Math.round(speed);
    }
};

export default constants;
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Link, 
  Tooltip, 
  InputAdornment,
  Autocomplete,
  CircularProgress,
  Paper,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const Navbar = ({ unitSystem, setUnitSystem, setCity, useCurrentLocation, setUseCurrentLocation, onSearch }) => {
    const [searchValue, setSearchValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // Common button style with consistent dimensions
    const buttonStyle = {
        width: '40px',
        height: '40px',
        minWidth: '40px',
        padding: '8px',
        ml: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const buttonStyleTwo = {
        width: '80px',
        height: '40px',
        minWidth: '40px',
        padding: '8px',
        ml: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue) {
            const cityName = typeof searchValue === 'string' ? searchValue : searchValue.name;
            setCity(cityName);
            if (onSearch) onSearch(cityName);
            setDrawerOpen(false); // Close drawer after search on mobile
        }
    };
    
    const handleLocationToggle = () => {
        if (!useCurrentLocation) {
            setSearchValue("");
            setInputValue("");
        }
        setUseCurrentLocation(!useCurrentLocation);
        if (isMobile) setDrawerOpen(false); // Close drawer after location toggle on mobile
    };

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    useEffect(() => {
        let active = true;
        const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
        console.log("API Key available:", !!MAPBOX_API_KEY);

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        setLoading(true);

        // Direct implementation using fetch
        const fetchPlaces = async () => {
            try {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=5`;
                console.log("Fetching from Mapbox:", url.replace(MAPBOX_API_KEY, "API_KEY_HIDDEN"));
                
                const response = await fetch(url);
                const data = await response.json();
                
                console.log("Mapbox response:", data);
                
                if (active && data.features) {
                    // Format the results for the Autocomplete component
                    const results = data.features.map(place => ({
                        name: place.text,
                        fullName: place.place_name,
                        id: place.id
                    }));
                    
                    console.log("Formatted results:", results);
                    setOptions(results);
                }
            } catch (error) {
                console.error("Error fetching places:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have at least 2 characters
        if (inputValue.length >= 2) {
            fetchPlaces();
        } else {
            setLoading(false);
            setOptions([]);
        }

        return () => {
            active = false;
        };
    }, [inputValue]);

    // Custom TextField component correctly configured for MUI v7
    const CustomTextField = React.forwardRef((props, ref) => {
        const { InputProps, inputProps, ...other } = props;

        return (
            <TextField
                {...other}
                inputProps={{
                    ...inputProps,
                    autoComplete: "off"  // Helps with mobile input issues
                }}
                ref={ref}
                InputProps={{
                    ...InputProps,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: isMobile && drawerOpen ? '#0034a4' : 'white' }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {InputProps?.endAdornment}
                        </>
                    )
                }}
                sx={{ 
                    '& .MuiInputBase-root': {
                        color: isMobile && drawerOpen ? '#0034a4' : 'white',
                        backgroundColor: isMobile && drawerOpen ? 'white' : 'rgba(255, 255, 255, 0.1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isMobile && drawerOpen ? '#0034a4' : 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isMobile && drawerOpen ? '#0034a4' : 'rgba(255, 255, 255, 0.5)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: isMobile && drawerOpen ? '#0034a4' : 'white'
                        }
                    }
                }}
            />
        );
    });

    // Search form component to reuse in both mobile and desktop views
    const SearchForm = ({ fullWidth = false }) => (
        <form onSubmit={handleSearch} style={{ display: 'flex', width: fullWidth ? '100%' : '100%', maxWidth: fullWidth ? '100%' : '500px' }}>
            <Autocomplete
                id="mapbox-places-autocomplete"
                sx={{ width: '100%' }}
                freeSolo
                filterOptions={(x) => x} // Don't filter options - Mapbox does this already
                options={options}
                loading={loading}
                getOptionLabel={(option) => {
                    // Handle both string inputs and option objects
                    return typeof option === 'string' ? option : option.name;
                }}
                value={searchValue}
                onChange={(event, newValue) => {
                    console.log("Selection changed:", newValue);
                    setSearchValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <CustomTextField
                        {...params}
                        placeholder="Search for a city..."
                        variant="outlined"
                        size="small"
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {option.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {option.fullName}
                            </Typography>
                        </Box>
                    </li>
                )}
                PaperComponent={(props) => (
                    <Paper 
                        {...props} 
                        elevation={4}
                        sx={{ 
                            backgroundColor: '#fff',
                            mt: 1,
                            zIndex: 1500
                        }} 
                    />
                )}
                noOptionsText="No locations found"
                loadingText="Searching..."
                // Fix for mobile keyboard focus issues
                disablePortal
                clearOnEscape
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={isMobile && drawerOpen ? {
                    ...buttonStyleTwo,
                    backgroundColor: '#0034a4',
                    color: 'white'
                } : buttonStyleTwo}
            >
                Search
            </Button>
        </form>
    );

    // Drawer content for mobile view
    const drawerContent = (
        <Box
            sx={{
                width: 250,
                padding: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            role="presentation"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ color: '#0034a4', fontWeight: 'bold' }}>
                    Menu
                </Typography>
                <IconButton onClick={toggleDrawer(false)} aria-label="close menu">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#0034a4' }}>
                    Search Location
                </Typography>
                <SearchForm fullWidth />
            </Box>
            
            <List>
                <ListItemButton onClick={handleLocationToggle}>
                    <ListItemIcon>
                        <MyLocationIcon color={useCurrentLocation ? "success" : "primary"} />
                    </ListItemIcon>
                    <ListItemText 
                        primary={useCurrentLocation ? "Using Current Location" : "Use My Location"} 
                    />
                </ListItemButton>
                
                <ListItemButton component={Link} href="/About" target="_blank">
                    <ListItemIcon>
                        <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </ListItemButton>
                
                <ListItem>
                    <ListItemIcon>
                        <WbSunnyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Units" />
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                            value={unitSystem}
                            onChange={(e) => setUnitSystem(e.target.value)}
                            sx={{ color: '#0034a4' }}
                        >
                            <MenuItem value="metric">{`Metric (${String.fromCharCode(176)}C)`}</MenuItem>
                            <MenuItem value="imperial">{`Imperial (${String.fromCharCode(176)}F)`}</MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                position: 'fixed',
                top: 0,
                backgroundColor: '#0034a4',
                left: 0,
                zIndex: 1000,
                boxSizing: 'border-box',
            }}
        >
            {/* Logo - visible in both mobile and desktop */}
            <Box>
                <img
                    alt="BarelyWeathery Logo"
                    src="/Logo.png"
                    style={{
                        height: '40px',
                        width: 'auto',
                    }}
                />
            </Box>
            
            {/* Spacer for mobile view */}
            {isMobile && <Box sx={{ flex: 1 }} />}

            {/* Desktop layout - hidden on mobile */}
            {!isMobile && (
                <>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flex: '1',
                        mx: 2
                    }}>
                        <SearchForm />

                        {/* Location button */}
                        <Tooltip title={useCurrentLocation ? "Currently using your location" : "Use your location"}>
                            <Button
                                variant="contained"
                                color={useCurrentLocation ? "success" : "primary"}
                                onClick={handleLocationToggle}
                                sx={buttonStyle}
                            >
                                <MyLocationIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="About BarelyWeathery">
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                href="/About"
                                target="_blank"
                                sx={{
                                    height: '40px',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white', 
                                    mr: 1,
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                About
                            </Button>
                        </Tooltip>
                        <FormControl size="small" sx={{ minWidth: 100, color: '#FFF' }}>
                            <InputLabel>Units</InputLabel>
                            <Select
                                value={unitSystem}
                                onChange={(e) => setUnitSystem(e.target.value)}
                                label="Units"
                                sx={{ color: '#FFF' }}
                            >
                                <MenuItem value="metric">{`Metric (${String.fromCharCode(176)}C)`}</MenuItem>
                                <MenuItem value="imperial">{`Imperial (${String.fromCharCode(176)}F)`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </>
            )}
            
            {/* Burger menu icon - only visible on mobile, placed at the right */}
            {isMobile && (
                <IconButton 
                    color="inherit" 
                    aria-label="open menu"
                    onClick={toggleDrawer(true)}
                    sx={{ ml: 1 }}
                >
                    <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
            )}

            {/* Drawer for mobile view */}
            <Drawer
                anchor="left"
                open={isMobile && drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: '80%',
                        maxWidth: '300px'
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Navbar;
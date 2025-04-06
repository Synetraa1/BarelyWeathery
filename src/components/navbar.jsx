import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const Navbar = ({ 
    unitSystem, 
    setUnitSystem, 
    setCity, 
    useCurrentLocation, 
    setUseCurrentLocation, 
    onSearch 
}) => {
    const [searchValue, setSearchValue] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const autocompleteRef = useRef(null);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // Button styles
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

    // Search handler
    const handleSearch = useCallback((selectedValue) => {
        const cityName = selectedValue 
            ? (typeof selectedValue === 'string' 
                ? selectedValue 
                : (selectedValue.name || selectedValue.fullName))
            : inputValue;

        if (cityName) {
            setCity(cityName);
            if (onSearch) onSearch(cityName);
            setDrawerOpen(false);
        }
    }, [inputValue, setCity, onSearch]);

    // Location toggle handler
    const handleLocationToggle = () => {
        if (!useCurrentLocation) {
            setSearchValue(null);
            setInputValue("");
        }
        setUseCurrentLocation(!useCurrentLocation);
        if (isMobile) setDrawerOpen(false);
    };

    // Drawer toggle
    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Place search effect
    useEffect(() => {
        let active = true;
        const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        setLoading(true);

        // Debounced API call
        const timeoutId = setTimeout(() => {
            const fetchPlaces = async () => {
                try {
                    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=5`;
                    
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (active && data.features) {
                        const results = data.features.map(place => ({
                            name: place.text,
                            fullName: place.place_name,
                            id: place.id
                        }));
                        
                        setOptions(results);
                    }
                } catch (error) {
                    console.error("Error fetching places:", error);
                    setOptions([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchPlaces();
        }, 500);

        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    // Search form component
    const SearchForm = ({ fullWidth = false }) => (
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchValue);
            }} 
            style={{ 
                display: 'flex', 
                width: fullWidth ? '100%' : '100%', 
                maxWidth: fullWidth ? '100%' : '500px' 
            }}
        >
            <Autocomplete
                ref={autocompleteRef}
                id="mapbox-places-autocomplete"
                sx={{ width: '100%' }}
                freeSolo
                clearOnBlur={false}
                disableClearable
                filterOptions={(x) => x}
                options={options}
                loading={loading}
                getOptionLabel={(option) => {
                    if (!option) return '';
                    return typeof option === 'string' 
                        ? option 
                        : (option.fullName || option.name || '');
                }}
                value={searchValue}
                onChange={(event, newValue, reason) => {
                    if (reason === 'selectOption') {
                        setSearchValue(newValue);
                        if (newValue && typeof newValue !== 'string') {
                            setInputValue(newValue.name || newValue.fullName);
                        }
                    } else if (reason === 'clear') {
                        setSearchValue(null);
                        setInputValue('');
                    }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                        setInputValue(newInputValue);
                        setSearchValue(newInputValue); // Add this line to sync searchValue
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search for a city..."
                        variant="outlined"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: isMobile && drawerOpen ? '#0034a4' : 'white' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                        sx={{ 
                            '& .MuiInputBase-root': {
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
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.id || option.name}>
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
                noOptionsText="No locations found"
                loadingText="Searching..."
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

    // Drawer content for mobile
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
            {/* Logo */}
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

            {/* Desktop layout */}
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
                            <InputLabel sx={{ color: 'white' }}>Units</InputLabel>
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
            
            {/* Burger menu icon for mobile */}
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
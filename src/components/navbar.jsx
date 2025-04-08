import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Button, 
  Link, 
  Tooltip, 
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
  ListItemButton,
  Paper,
  InputBase,
  Popper,
  ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
  onSearch,
  loading
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchRef = useRef(null);
  const isTogglingRef = useRef(false);
  
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
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    borderRadius: '50%'
  };

  const buttonStyleLarge = {
    minWidth: '15vh',
    height: '40px',
    padding: '8px',
    ml: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    borderRadius: '20px'
  };

  // Toggle unit system handler
  const handleToggle = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isTogglingRef.current || loading) {
      console.log('Ignoring rapid click or already loading');
      return;
    }
    
    isTogglingRef.current = true;
    console.log('Toggle initiated from navbar');
    
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');
    
    // Close the drawer if on mobile
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 500);
  }, [setUnitSystem, loading, isMobile, unitSystem]);

  // Search handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setAnchorEl(searchRef.current);
    
    // Only fetch suggestions if there's enough text
    if (value.length >= 3) {
      fetchCitySuggestions(value);
    } else {
      setOptions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Always close the drawer immediately when submitting search
      if (isMobile) {
        setDrawerOpen(false);
      }
      
      setCity(searchValue.trim());
      if (onSearch) onSearch(searchValue.trim());
      setUseCurrentLocation(false);
      setSearchValue('');
      setOptions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = suggestion.split(',')[0];
    
    // Always close the drawer immediately when selecting a suggestion
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    setCity(cityName);
    if (onSearch) onSearch(cityName);
    setUseCurrentLocation(false);
    setSearchValue('');
    setOptions([]);
  };

  // Location handler
  const handleLocationToggle = () => {

  
    // If turning on location
    if (!useCurrentLocation) {
      setSearchValue('');
      setUseCurrentLocation(true);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchCityFromCoords(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            setUseCurrentLocation(false); // Revert if error
          }
        );
      }
    } else {
      // Turning off location
      setUseCurrentLocation(false);
    }
  };
  
  // Add this function to fetch city name from coordinates
  const fetchCityFromCoords = async (lat, lon) => {
    try {
      const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const cityName = data.features[0].text;
        setCity(cityName);
        if (onSearch) onSearch(cityName);
      }
    } catch (error) {
      console.error("Error fetching city from coordinates:", error);
    }
  };

  // Drawer toggle
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // City suggestion fetching
  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    
    try {
      const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=5`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features) {
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
      setIsLoading(false);
    }
  };

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
        <Box sx={{ width: '100%' }}>
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            ref={searchRef}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '20px',
              width: '100%',
              height: '40px',
              backgroundColor: useCurrentLocation ? 'rgba(76, 175, 80, 0.1)' : 'white',
              border: useCurrentLocation ? '1px solid #4caf50' : 'none'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={useCurrentLocation ? "Using your location..." : "Search city..."}
              inputProps={{ 'aria-label': 'search city' }}
              value={searchValue}
              onChange={handleSearchChange}
              disabled={useCurrentLocation}
            />
            <IconButton 
              type="submit" 
              sx={{ p: '10px', color: useCurrentLocation ? '#4caf50' : '#0034a4' }} 
              aria-label="search"
              disabled={useCurrentLocation}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          
          {/* Suggestions in drawer */}
          {options.length > 0 && (
            <Paper
              sx={{
                width: '100%',
                maxHeight: '200px',
                overflow: 'auto',
                borderRadius: '8px',
                mt: 0.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <List dense>
                {options.map((option, index) => (
                  <ListItem
                    key={option.id || index}
                    onClick={() => handleSuggestionClick(option.fullName)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 52, 164, 0.08)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={option.name}
                      secondary={option.fullName.substring(option.fullName.indexOf(',') + 1).trim()}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>
      
      <List>
        <ListItemButton onClick={handleLocationToggle}>
          <ListItemIcon>
            <LocationOnIcon color={useCurrentLocation ? "success" : "primary"} />
          </ListItemIcon>
          <ListItemText 
            primary={useCurrentLocation ? "Using Current Location, click to enable search" : "Use My Location"} 
          />
        </ListItemButton>
        
        <ListItemButton onClick={handleToggle} disabled={loading}>
          <ListItemIcon>
            <WbSunnyIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary={loading ? "Loading..." : `Switch to ${unitSystem === 'imperial' ? '°C' : '°F'}`}
          />
          {loading && (
            <CircularProgress size={16} sx={{ color: '#0034a4' }} />
          )}
        </ListItemButton>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItemButton component={Link} href="/About" target="_blank">
          <ListItemIcon>
            <InfoIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>
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
            {/* Always visible search bar for desktop */}
            <ClickAwayListener onClickAway={() => setOptions([])}>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  ref={searchRef}
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    width: '100%',
                    height: '40px',
                    backgroundColor: useCurrentLocation ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <InputBase
                    sx={{ 
                      ml: 1, 
                      flex: 1,
                      color: useCurrentLocation ? '#000' : 'inherit',
                      '&.Mui-disabled': {
                        color: useCurrentLocation ? '#000' : 'rgba(0, 0, 0, 0.38)'
                      }
                    }}
                    placeholder={useCurrentLocation ? "Using your location..." : "Search city..."}
                    inputProps={{ 'aria-label': 'search city' }}
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  <IconButton 
                    type="submit" 
                    sx={{ p: '10px', color: useCurrentLocation ? '#4caf50' : '#0034a4' }} 
                    aria-label="search"
                    disabled={useCurrentLocation}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
                
                {/* Suggestions dropdown */}
                {options.length > 0 && (
                  <Popper
                    open={Boolean(anchorEl) && options.length > 0}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    modifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ]}
                    sx={{ zIndex: 1200, width: searchRef.current?.offsetWidth || 'auto' }}
                  >
                    <Paper
                      sx={{
                        width: '100%',
                        maxHeight: '300px',
                        overflow: 'auto',
                        borderRadius: '8px',
                        mt: 0.5,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    >
                      <List dense>
                        {options.map((option, index) => (
                          <ListItem
                            key={option.id || index}
                            onClick={() => handleSuggestionClick(option.fullName)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 52, 164, 0.08)',
                              }
                            }}
                          >
                            <ListItemText 
                              primary={option.name}
                              secondary={option.fullName.substring(option.fullName.indexOf(',') + 1).trim()}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Popper>
                )}
              </Box>
            </ClickAwayListener>

            {/* Location button - always visible */}
            <Tooltip title={useCurrentLocation ? "Currently using your location" : "Use your location"}>
                <IconButton
                    onClick={handleLocationToggle}
                    sx={{
                    ...buttonStyle,
                    backgroundColor: useCurrentLocation ? '#90EE90' : '#FFF',
                    '&:hover': {
                        backgroundColor: useCurrentLocation ? '#EEE' : '#EEE'
                    }
                    }}
                >
                    <MyLocationIcon sx={{ color: useCurrentLocation ? '#000' : '#000' }} />
                </IconButton>
                </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={handleToggle}
              disabled={loading}
              sx={buttonStyleLarge}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={16}
                    sx={{
                      color: '#fff',
                      mr: 1
                    }}
                  />
                  Loading...
                </>
              ) : (
                `Switch to ${unitSystem === 'imperial' ? '°C' : '°F'}`
              )}
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/About"
              target="_blank"
              sx={{
                height: '40px',
                ml: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                },
                borderRadius: '20px'
              }}
            >
              About
            </Button>
          </Box>
        </>
      )}
      
      {/* Mobile layout: burger menu icon */}
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
        anchor="right"
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
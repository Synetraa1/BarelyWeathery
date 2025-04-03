import React, { useCallback, useRef, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useWeather } from '../context/WeatherContext';

export default function Navbar() {
  const { 
    unitSystem, 
    toggleUnitSystem, 
    loading, 
    fetchWeatherByCity,
    fetchWeatherByCoords, 
    setUseCurrentLocation 
  } = useWeather();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isTogglingRef = useRef(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef(null);
  
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
    
    toggleUnitSystem();
    
    // Close the drawer if on mobile
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 500);
  }, [toggleUnitSystem, loading, isMobile]);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchValue('');
    setCitySuggestions([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setAnchorEl(searchRef.current);
    
    // Only fetch suggestions if there's enough text
    if (value.length >= 2) {
      fetchCitySuggestions(value);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Always close the drawer immediately when submitting search
      if (isMobile) {
        setDrawerOpen(false);
      }
      
      fetchWeatherByCity(searchValue.trim());
      setUseCurrentLocation(false);
      setSearchValue('');
      setIsSearchExpanded(false);
      setCitySuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = suggestion.split(',')[0];
    
    // Always close the drawer immediately when selecting a suggestion
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    fetchWeatherByCity(cityName);
    setUseCurrentLocation(false);
    setSearchValue('');
    setIsSearchExpanded(false);
    setCitySuggestions([]);
  };

  const handleLocationRequest = () => {
    // Always close the drawer immediately when requesting location
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUseCurrentLocation(true);
          // We need to fetch weather with these coordinates
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // City suggestion fetching - reused from your App component
  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&limit=5`
      );
      const data = await response.json();
      setCitySuggestions(data.features.map(feature => feature.place_name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setCitySuggestions([]);
    }
  };

  // Close suggestions when clicking outside
  const handleClickAway = () => {
    setCitySuggestions([]);
  };

  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 2,
        backgroundColor: '#0034a4'
      }}>
        <img
          alt="BarelyWeathery Logo"
          src="/Logo.png"
          style={{
            height: '30px',
            width: 'auto',
            maxWidth: '200px',
          }}
        />
      </Box>
      <Divider />
      <List>
        <ListItem>
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
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search city..."
                inputProps={{ 'aria-label': 'search city' }}
                value={searchValue}
                onChange={handleSearchChange}
              />
              <IconButton 
                type="submit" 
                sx={{ p: '10px', color: '#0034a4' }} 
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            
            {/* Suggestions dropdown in drawer */}
            {citySuggestions.length > 0 && (
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
                  {citySuggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 52, 164, 0.08)',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={suggestion.split(',')[0]}
                        secondary={suggestion.substring(suggestion.indexOf(',') + 1).trim()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </ListItem>
        <ListItem onClick={handleLocationRequest} sx={{ cursor: 'pointer' }}>
          <ListItemText primary="Use Current Location" />
          <LocationOnIcon sx={{ color: '#0034a4' }} />
        </ListItem>
        <ListItem onClick={handleToggle} disabled={loading} sx={{ cursor: 'pointer' }}>
          <ListItemText 
            primary={loading ? 'Loading...' : `Switch to ${unitSystem === 'imperial' ? '°C' : '°F'}`} 
          />
          {loading && (
            <CircularProgress
              size={16}
              sx={{
                color: '#0034a4',
              }}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem 
          component="a" 
          href="/About" 
          sx={{ cursor: 'pointer' }}
          onClick={() => setDrawerOpen(false)}
        >
          <ListItemText primary="About" />
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
        backgroundColor: '#0034a4',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          alt="BarelyWeathery Logo"
          src="/Logo.png"
          style={{
            height: '30px',
            width: 'auto',
            maxWidth: '300px',
          }}
        />
      </Box>
      
      {isMobile ? (
        // Mobile view with burger menu
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer(true)}
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        // Desktop view with regular controls
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Field */}
          {isSearchExpanded ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ position: 'relative' }}>
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  ref={searchRef}
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '20px',
                    width: { xs: '180px', sm: '250px' },
                    height: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search city..."
                    inputProps={{ 'aria-label': 'search city' }}
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                  <IconButton 
                    type="submit" 
                    sx={{ p: '10px', color: '#0034a4' }} 
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton 
                    sx={{ p: '5px', color: '#0034a4' }} 
                    aria-label="close search"
                    onClick={handleCloseSearch}
                  >
                    <CloseIcon />
                  </IconButton>
                </Paper>
                
                {/* Suggestions dropdown */}
                {citySuggestions.length > 0 && (
                  <Popper
                    open={Boolean(anchorEl) && citySuggestions.length > 0}
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
                        {citySuggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 52, 164, 0.08)',
                              }
                            }}
                          >
                            <ListItemText 
                              primary={suggestion.split(',')[0]}
                              secondary={suggestion.substring(suggestion.indexOf(',') + 1).trim()}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Popper>
                )}
              </Box>
            </ClickAwayListener>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Search city">
                <IconButton 
                  onClick={handleSearchClick}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Use current location">
                <IconButton 
                  onClick={handleLocationRequest}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Unit Toggle Button */}
          <Button
            onClick={handleToggle}
            disabled={loading}
            sx={{
              color: '#fff',
              minWidth: '15vh',
              position: 'relative',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              borderRadius: '20px',
              ml: 1
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={16}
                  sx={{
                    color: '#fff',
                    position: 'absolute',
                    left: '10px'
                  }}
                />
                <span style={{ marginLeft: '20px'}}>Loading</span>
              </>
            ) : (
              `Switch to ${unitSystem === 'imperial' ? '°C' : '°F'}`
            )}
          </Button>
          <Button
            href="/About"
            sx={{
              color: '#fff',
              minWidth: '90px',
              position: 'relative',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              borderRadius: '20px',
              ml: 1
            }}
          >
            About
          </Button>
        </Box>
      )}
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
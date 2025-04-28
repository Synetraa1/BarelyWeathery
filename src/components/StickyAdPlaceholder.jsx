import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StickyAdPlaceholder = ({ 
  width, 
  height,
  onClose,
  show = true,
  adSlot // AdSense slot ID
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const adRef = useRef(null);
  const isAdInitialized = useRef(false);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    // Only initialize if:
    // 1. The ad is visible
    // 2. We have an adSlot
    // 3. The ref is attached to a DOM element
    // 4. We haven't already initialized this ad
    // 5. AdSense is loaded
    if (
      isVisible && 
      adSlot && 
      adRef.current && 
      !isAdInitialized.current && 
      window.adsbygoogle
    ) {
      try {
        // Mark this ad as initialized
        isAdInitialized.current = true;
        
        // Push the ad to AdSense for display
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [isVisible, adSlot]);

  // If not visible, return null
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
        padding: '10px',
        backgroundColor: 'rgba(0, 13, 47, 0.8)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '728px',
          margin: '0 auto',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: '-10px',
            top: '-10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            zIndex: 1,
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Display AdSense ad if adSlot is provided */}
        {adSlot ? (
          <Box sx={{ width: width || '100%', height: height || '90px' }}>
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{
                display: 'block',
                width: width || '728px',
                height: height || '90px',
              }}
              data-ad-client="ca-pub-4039094909147349"
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </Box>
        ) : (
          /* Fallback placeholder if no adSlot provided */
          <Box
            sx={{
              width: width || '100%',
              height: height || '90px',
              backgroundColor: 'rgba(200, 200, 200, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
              Advertisement
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StickyAdPlaceholder;
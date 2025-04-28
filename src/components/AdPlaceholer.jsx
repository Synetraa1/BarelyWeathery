import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

// AdPlaceholder component that displays Google AdSense ads
const AdPlaceholder = ({ width, height, adSlot }) => {
  // Use a ref to track whether this specific ad has been initialized
  const adRef = useRef(null);
  const isAdInitialized = useRef(false);

  useEffect(() => {
    // Only initialize if:
    // 1. We have an adSlot
    // 2. The ref is attached to a DOM element
    // 3. We haven't already initialized this specific ad
    // 4. AdSense is loaded
    if (
      adSlot && 
      adRef.current && 
      !isAdInitialized.current && 
      window.adsbygoogle
    ) {
      try {
        // Mark this specific ad as initialized
        isAdInitialized.current = true;
        
        // Push the ad to AdSense for display
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adSlot]);

  return (
    <>
      {/* Fallback placeholder shown while ads are loading or if they fail */}
      {!adSlot && (
        <Box
          sx={{
            width: width || '100%',
            height: height || '100px',
            backgroundColor: 'rgba(200, 200, 200, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 2,
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

      {/* Actual AdSense ad unit */}
      {adSlot && (
        <Box
          sx={{
            width: width || '100%',
            height: height || '100px',
            my: 2,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: width || '100%',
              height: height || '100px',
            }}
            data-ad-client="ca-pub-4039094909147349"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </Box>
      )}
    </>
  );
};

export default AdPlaceholder;
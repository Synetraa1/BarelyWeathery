import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const AdBanner = () => {
    const adRef = useRef(null);
    const adInitialized = useRef(false);

    useEffect(() => {
        if (import.meta.env.PROD && !adInitialized.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            try {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                                adInitialized.current = true;
                                observer.disconnect();
                            } catch (e) {
                                console.error('AdSense error:', e);
                            }
                        }
                    });
                },
                { threshold: 0.1 }
            );

            if (adRef.current) {
                observer.observe(adRef.current);
            }

            return () => {
                if (adRef.current) {
                    observer.unobserve(adRef.current);
                }
            };
        }
    }, []);

    return (
        <Box
            ref={adRef}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                width: '100%',
                maxWidth: '1200px',
                mx: 'auto',
                textAlign: 'center',
                minHeight: '90px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}
        >
            <ins
                className="adsbygoogle"
                style={{
                    display: 'block',
                    width: '728px',
                    height: '90px'
                }}
                data-ad-client="ca-pub-4039094909147349"
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </Box>
    );
};

export default AdBanner;
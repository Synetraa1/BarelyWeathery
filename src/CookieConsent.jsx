import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Snackbar,
    Link,
    Stack
} from '@mui/material';

const CookieConsent = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // If no choice has been made, show the consent popup
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        // Save user preference
        localStorage.setItem('cookieConsent', 'accepted');
        setOpen(false);

        // Here you would initialize any tracking or cookie-based services
        // For example: initializeAnalytics();
    };

    const handleDecline = () => {
        // Save user preference
        localStorage.setItem('cookieConsent', 'declined');
        setOpen(false);

        // Here you would disable any tracking or cookie-based services
        // For example: disableAnalytics();
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
                width: '100%',
                maxWidth: { xs: '95%', sm: '600px' },
                bottom: { xs: '10px', sm: '20px' }
            }}
        >
            <Paper elevation={6} sx={{
                p: 3,
                borderRadius: '8px',
                width: '100%'
            }}>
                <Typography variant="h6" gutterBottom>
                    Cookie Consent
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    We use cookies to enhance your experience on our website. By continuing to use this site, you consent to our use of cookies in accordance with our
                    <Link href="/privacy-policy" sx={{ ml: 1 }}>
                        Privacy Policy
                    </Link>
                    .
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleDecline}
                        fullWidth
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        fullWidth
                    >
                        Accept
                    </Button>
                </Stack>
            </Paper>
        </Snackbar>
    );
};

export default CookieConsent;
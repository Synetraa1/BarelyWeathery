import React from 'react';
import { Container, Typography, Paper, Box, Link } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
                <Typography variant="subtitle1" gutterBottom>Last Updated: {new Date().toLocaleDateString()}</Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>1. Introduction</Typography>
                    <Typography paragraph>
                        Welcome to Weather or Not. We respect your privacy and are committed to protecting your personal data.
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>2. Information We Collect</Typography>
                    <Typography paragraph>
                        <strong>a. Location Data:</strong> With your permission, we collect your approximate geographical location to provide weather information relevant to your area.
                    </Typography>
                    <Typography paragraph>
                        <strong>b. Usage Data:</strong> We collect information on how you interact with our website, including pages visited, time spent, and features used.
                    </Typography>
                    <Typography paragraph>
                        <strong>c. Device Information:</strong> We collect data about your device type, operating system, browser type, and screen resolution to optimize your experience.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>3. How We Use Your Information</Typography>
                    <Typography paragraph>
                        We use the collected information to:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <li>Provide accurate weather forecasts based on your location</li>
                        <li>Improve and optimize our website functionality</li>
                        <li>Analyze usage patterns to enhance user experience</li>
                        <li>Display relevant advertisements</li>
                        <li>Prevent fraudulent activities and ensure security</li>
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>4. Cookies</Typography>
                    <Typography paragraph>
                        We use cookies and similar tracking technologies to enhance your browsing experience. You can manage your cookie preferences through our Cookie Consent banner.
                    </Typography>
                    <Typography paragraph>
                        <strong>a. Essential Cookies:</strong> Required for the website to function properly.
                    </Typography>
                    <Typography paragraph>
                        <strong>b. Analytics Cookies:</strong> Help us understand how visitors interact with our website.
                    </Typography>
                    <Typography paragraph>
                        <strong>c. Advertising Cookies:</strong> Used to deliver relevant advertisements based on your interests.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>5. Third-Party Services</Typography>
                    <Typography paragraph>
                        We use third-party services to enhance functionality:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <li>OpenWeather API for weather data</li>
                        <li>Google Analytics for website analytics</li>
                        <li>Google AdSense for displaying advertisements</li>
                        <li>Mapbox for location services</li>
                    </Typography>
                    <Typography paragraph>
                        These third parties may collect and use your information according to their own privacy policies.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>6. Data Security</Typography>
                    <Typography paragraph>
                        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>7. Your Rights</Typography>
                    <Typography paragraph>
                        Depending on your location, you may have the following rights regarding your data:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <li>Access to your personal data</li>
                        <li>Correction of inaccurate data</li>
                        <li>Deletion of your data</li>
                        <li>Restriction of processing</li>
                        <li>Data portability</li>
                        <li>Objection to processing</li>
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>8. Children's Privacy</Typography>
                    <Typography paragraph>
                        Our service is not directed to individuals under 13 years of age. We do not knowingly collect personal information from children.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>9. Changes to This Privacy Policy</Typography>
                    <Typography paragraph>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>10. Contact Us</Typography>
                    <Typography paragraph>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </Typography>
                    <Typography paragraph>
                        Email: hickman.nico@gmail.com
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PrivacyPolicy;
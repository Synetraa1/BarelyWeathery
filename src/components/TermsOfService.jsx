import React from 'react';
import { Container, Typography, Paper, Box, Link } from '@mui/material';

const TermsOfService = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant="h4" gutterBottom>Terms of Service</Typography>
                <Typography variant="subtitle1" gutterBottom>Last Updated: {new Date().toLocaleDateString()}</Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>1. Acceptance of Terms</Typography>
                    <Typography paragraph>
                        By accessing or using BarelyWeathery ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>2. Description of Service</Typography>
                    <Typography paragraph>
                        BarelyWeathery provides weather forecasts, current conditions, and related information based on data from third-party providers. The Service is provided "as is" and "as available" without warranties of any kind.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>3. Data Accuracy</Typography>
                    <Typography paragraph>
                        While we strive to provide accurate weather information, we cannot guarantee the accuracy, completeness, or timeliness of data presented. Weather forecasts are inherently uncertain, and actual conditions may vary. Users should check multiple sources for critical weather-dependent decisions.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>4. User Obligations</Typography>
                    <Typography paragraph>
                        Users agree to:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <li>Use the Service only for lawful purposes</li>
                        <li>Not attempt to probe, scan, or test the vulnerability of the system</li>
                        <li>Not interfere with or disrupt the Service or servers</li>
                        <li>Comply with all applicable laws and regulations</li>
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>5. Intellectual Property</Typography>
                    <Typography paragraph>
                        The Service and its original content, features, and functionality are owned by BarelyWeathery and are protected by international copyright, trademark, and other intellectual property laws.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>6. Third-Party Services and Links</Typography>
                    <Typography paragraph>
                        Our Service may contain links to third-party websites or services that are not owned or controlled by BarelyWeathery. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                    </Typography>
                    <Typography paragraph>
                        Weather data is provided by OpenWeatherMap and other third-party weather data providers. Their terms of service and privacy policies apply to their respective services.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>7. Limitation of Liability</Typography>
                    <Typography paragraph>
                        In no event shall BarelyWeathery, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <li>Your access to or use of or inability to access or use the Service</li>
                        <li>Any conduct or content of any third party on the Service</li>
                        <li>Any content obtained from the Service</li>
                        <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                        <li>Reliance on weather data provided through the Service</li>
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>8. Termination</Typography>
                    <Typography paragraph>
                        We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>9. Governing Law</Typography>
                    <Typography paragraph>
                        These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>10. Changes to Terms</Typography>
                    <Typography paragraph>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>11. Contact</Typography>
                    <Typography paragraph>
                        If you have any questions about these Terms, please contact me at hickman.nico@gmail.com.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsOfService;
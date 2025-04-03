import React from 'react';
import { Container, Typography, Paper, Box, Link, Grid, Card, CardContent, Avatar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloudIcon from '@mui/icons-material/Cloud';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', backgroundColor: '#636363' }}>
                <Typography variant="h4" gutterBottom color="#FFF">About BarelyWeathery</Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">The Goals of BarelyWeathery</Typography>
                    <Typography paragraph color="#FFF">
                        BarelyWeathery aims to provide accurate, easy-to-understand weather information in a clean,
                        user-friendly interface. I believe weather data should be accessible to everyone, presented
                        clearly without unnecessary complications.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">How It Started</Typography>
                    <Typography paragraph color="#FFF">
                        BarelyWeathery began as a personal project to learn and create a weather application that focused on
                        simplicity and usability. So I created a simple weather app that
                        delivers exactly what users need, nothing more and nothing less.
                    </Typography>
                </Box>

                <Box sx={{ mt: 5, mb: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">Key Features</Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid sx={{ width: { xs: '100%', sm: '100%', lg: '100%' } } } >
                            <Card sx={{ height: '100%', backgroundColor: '#002471', color: '#FFF', borderRadius: '16px', }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ backgroundColor: '#0034a4', mr: 2 }}>
                                            <CloudIcon />
                                        </Avatar>
                                        <Typography variant="h6">Accurate Forecasts</Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        I use OpenWeatherMap API to provide reliable weather data for locations worldwide,
                                        with up-to-date forecasts and current conditions.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ width: { xs: '100%', sm: '100%', lg: '100%' } }} >
                            <Card sx={{ height: '100%', backgroundColor: '#002471', color: '#FFF', borderRadius: '16px' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ backgroundColor: '#0034a4', mr: 2 }}>
                                            <SpeedIcon />
                                        </Avatar>
                                        <Typography variant="h6">Simple Interface</Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        The user interface is designed to be clean, intuitive, and fast. Get the weather
                                        information you need at a glance without distractions.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ width: { xs: '100%', sm: '100%', lg: '100%' } }} >
                            <Card sx={{ height: '100%', backgroundColor: '#002471', color: '#FFF', borderRadius: '16px' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ backgroundColor: '#0034a4', mr: 2 }}>
                                            <CodeIcon />
                                        </Avatar>
                                        <Typography variant="h6">Open Development</Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        I do also believe in transparency and continuous improvement. Our code is publicly available
                                        on GitHub, and we welcome feedback from our users.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">The Data</Typography>
                    <Typography paragraph color="#FFF">
                        BarelyWeathery uses data from <Link href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" sx={{ color: '#3f95ea' }}>OpenWeatherMap</Link>,
                        one of the leading providers of weather data worldwide. Their comprehensive API gives us access to:
                    </Typography>
                    <ul style={{ color: '#FFF' }}>
                        <li>Current weather conditions</li>
                        <li>Five-day forecasts</li>
                        <li>Hourly predictions</li>
                        <li>Historical weather data</li>
                    </ul>
                    <Typography paragraph color="#FFF">
                        Weather forecasting is a complex science that combines atmospheric physics, data analysis, and
                        computational modeling. While we strive for accuracy, please note that weather predictions become
                        less reliable the further they extend into the future.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">Meet the Developer</Typography>
                    <Typography paragraph color="#FFF">
                        BarelyWeathery is developed and maintained by a passionate web developer with love for clean, functional design. You can find more of my projects on
                        <Link href="https://www.github.com/Synetraa1" target="_blank" rel="noopener noreferrer" sx={{ color: '#3f95ea', ml: 1 }}>
                            GitHub
                        </Link>.
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom color="#FFF">Contact Us</Typography>
                    <Typography paragraph color="#FFF">
                        Have questions, suggestions, or feedback? I'd love to hear from you. Please contact me at
                        <Link href="mailto:hickman.nico@gmail.com" sx={{ color: '#3f95ea', ml: 1 }}>
                            hickman.nico@gmail.com
                        </Link>.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default About;
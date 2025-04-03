import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import './styles/index.css';
import { WeatherProvider } from './context/WeatherContext';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <WeatherProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
        </BrowserRouter>
    </WeatherProvider>
    </React.StrictMode>
);
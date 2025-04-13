import { createGlobalStyle } from 'styled-components';

// Amsterdam tour app colors
export const COLORS = {
  primary: '#FF6B35', // bright orange
  secondary: '#004D7F', // deep blue
  accent: '#FFB563', // light orange
  neutral: {
    light: '#F7F7F7',
    medium: '#E5E5E5',
    dark: '#333333',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
  },
};

// Font families
export const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Open Sans', sans-serif",
  map: "'Roboto', sans-serif",
};

// Tour information
export const TOUR_INFO = {
  title: 'Amsterdam Family Walking Tour',
  subtitle: 'NEMO to Jordaan',
  totalDistance: '3 km (1.8 miles)',
  totalStops: 7,
  estimatedTime: '3-4 hours',
};

// Map settings
export const MAP_CONFIG = {
  initialCenter: [52.370216, 4.895168], // Amsterdam center
  initialZoom: 15,
  minZoom: 13,
  maxZoom: 18,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Add global styles to ensure fonts are used throughout the app
export const GlobalStyle = createGlobalStyle`
  :root {
    --font-heading: ${FONTS.heading};
    --font-body: ${FONTS.body};
    --font-map: ${FONTS.map};
  }

  body {
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
`;

// Export default for importing in other files
export default {
  COLORS,
  FONTS,
  TOUR_INFO,
  MAP_CONFIG,
};

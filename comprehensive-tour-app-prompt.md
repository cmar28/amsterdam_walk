# Comprehensive Amsterdam Walking Tour Application Prompt

Create a cutting-edge mobile walking tour application that reimagines urban exploration through technology, focusing on Amsterdam's rich cultural landscape. The application should provide an immersive, educational experience for tourists exploring Amsterdam, with a focus on historical sites from NEMO Science Museum to the Jordaan district.

## Application Overview

Create a fullstack JavaScript application with the following features:
- Interactive map using Leaflet showing tour stops and the user's current location
- Audio narration for each stop with text transcripts
- Detailed information about each location including history and points of interest
- Support for a "kid-friendly" content mode
- Responsive, touch-friendly mobile-first design
- Clean, intuitive user interface with a bottom-sliding panel for stop details

## Technical Stack

- **Frontend**: React with TypeScript, hosted in a Vite application
- **Backend**: Express.js server 
- **Data Storage**: In-memory storage with option to migrate to PostgreSQL later
- **Core Libraries**:
  - Tanstack Query (React Query) for data fetching
  - Leaflet for mapping
  - Howler.js for audio handling
  - Zod for schema validation
  - Tailwind CSS for styling
  - Wouter for client-side routing
  - Lucide React for icons
  - Drizzle ORM for database operations
  - Shadcn/UI for UI components

## Database Schema

Create the following data models:

1. **TourStop**:
   - id: Primary key
   - title: Name of the location
   - subtitle: Short description line
   - description: Detailed description of the stop
   - kidsContent: Child-friendly description (optional)
   - orderNumber: Sequence in the tour
   - latitude: GPS coordinate
   - longitude: GPS coordinate
   - audioUrl: Path to audio narration
   - duration: Expected time at this stop
   - nextStopWalkingTime: Time to next stop
   - walkingTip: Directions to next stop
   - images: Array of image URLs

2. **RoutePath**:
   - id: Primary key
   - fromStopId: Starting point reference
   - toStopId: Ending point reference
   - coordinates: Array of lat/lng points for the walking path

## Key Components

1. **Main Tour Page** that hosts:
   - Header with menu and search toggles
   - View toggle for Map/List views
   - Map view with Leaflet integration
   - Stop detail panel that slides up/down
   - Bottom navigation tabs

2. **MapView Component** providing:
   - Interactive map with custom markers for stop points
   - User location tracking with permission handling
   - Custom zoom and locate controls
   - Visual indication of the current selected stop

3. **StopPanel Component** featuring:
   - Draggable panel for expanded/collapsed states
   - Image gallery for location photos
   - Audio player with playback controls
   - Text transcript toggle
   - Content sections for general information, kids content, and walking tips
   - Next stop preview with quick navigation

4. **AudioPlayer Component** with:
   - Play/pause controls
   - Time-based progress bar
   - Duration display
   - Transcript toggle

5. **ListView Component** showing:
   - Scrollable list of all tour stops
   - Visual indication of current stop
   - Selection mechanism to change current stop

## Core Functionality

1. **Geolocation Features**:
   - Track user's current position on the map
   - Calculate proximity to tour stops
   - Provide permission handling with clear user messaging
   - Support for high and low accuracy modes

2. **Tour Navigation**:
   - Sequential progression through ordered stops
   - Map centering on current stop
   - Ability to jump to any stop from the list view
   - Walking directions between stops

3. **Audio Narration System**:
   - Text-to-speech generation using OpenAI's API
   - Audio playback with scrubbing capability
   - Transcript display option for accessibility
   - Custom voice selection for consistent tour guide experience

4. **Interactive Elements**:
   - Touch-optimized controls for mobile users
   - Gesture support for panel dragging
   - Image gallery navigation
   - Map interaction with zoom/pan controls

## Server Implementation

1. **API Endpoints**:
   - GET /api/tour-stops - Return all tour stops
   - GET /api/tour-stops/:id - Return specific stop details
   - GET /api/route-paths - Return all route paths
   - GET /api/images/:imageName - Serve stop images
   - GET /api/audio/:audioFileName - Serve audio files

2. **Audio Generation Scripts**:
   - Implement scripts to generate audio narration from stop descriptions
   - Use OpenAI's text-to-speech API
   - Generate a consistent voice across all tour stops
   - Include kids content in separate narration sections

## Tour Content

Include content for a walking tour with 8 stops through Amsterdam:
1. NEMO Science Museum (starting point)
2. Montelbaanstoren (medieval tower)
3. Nieuwmarkt & Waag (historic market square)
4. Zeedijk and Fo Guang Shan He Hua Temple (Chinatown)
5. Dam Square (city center)
6. Begijnhof (hidden courtyard)
7. The Nine Streets shopping area
8. Westerkerk & Anne Frank House (Jordaan district)

For each stop, include:
- Historical information
- Points of interest
- Kid-friendly explanations
- Walking directions to the next stop
- Duration recommendations
- Geographical coordinates

## UI/UX Design

1. **Color Scheme**:
   - Primary: #FF6B35 (orange)
   - Secondary: #004D7F (blue)
   - Accent: #FFB563 (light orange)
   - Neutral: Various shades of gray (#F7F7F7, #E5E5E5, #333333)

2. **Typography**:
   - Headings: Montserrat
   - Body: Open Sans
   - Map elements: Roboto

3. **Interface Elements**:
   - Custom map markers with stop numbers
   - Bottom-sliding information panel
   - Image carousel for stop photos
   - Custom audio player with progress bar
   - Persistent bottom navigation
   - View toggle between map and list views

## Implementation Details

1. **Tour Data Management**:
   - Implement useTourData hook for centralized data access
   - Sort stops by orderNumber for sequential presentation
   - Provide loading and error states

2. **Location Tracking**:
   - Implement useCurrentLocation hook for geolocation services
   - Handle permission states (granted, denied, prompt)
   - Provide visual feedback about location accuracy
   - Include fallback options for low-accuracy devices

3. **Panel Interaction**:
   - Implement drag-to-expand functionality
   - Support touch gestures for mobile
   - Preserve state when navigating between stops
   - Automatically expand in list view mode

4. **Media Handling**:
   - Preload audio files for smooth playback
   - Implement on-demand loading for images
   - Provide fallbacks for missing media
   - Support transcript mode for accessibility

## Development Guidelines

1. Follow modern web application patterns and best practices
2. Keep the frontend as the primary focus, with backend mainly for data serving
3. Implement responsive design that works well on mobile devices
4. Ensure all UI elements are touch-friendly with appropriate sizing
5. Include comprehensive error handling and loading states
6. Generate audio using OpenAI's text-to-speech API for consistent narration
7. Use in-memory storage initially with the option to migrate to a database later

## Additional Notes

- The main view should be a map with stop markers and user location
- The application should be usable without constant internet by preloading essential assets
- The slide-up panel should have two states: collapsed (preview) and expanded (full details)
- Support for both map view and list view of the tour stops
- Permission handling for geolocation should be clear and user-friendly
- Audio narration should have a consistent voice throughout the tour
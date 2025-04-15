# Amsterdam Walking Tour App

## Introduction

The Amsterdam Walking Tour App is a cutting-edge mobile walking tour application that reimagines urban exploration through technology. This interactive application focuses on Amsterdam's rich cultural landscape, guiding users through a carefully curated tour from the NEMO Science Museum to the Jordaan District.

The application was built using modern web technologies, with a focus on providing an immersive and interactive experience for tourists and locals alike. It combines geolocation services, interactive maps, and AI-powered audio narration to create a comprehensive guided tour experience.

## Features

- **Interactive Map**: Using Leaflet.js for high-performance, mobile-friendly map interactions
- **Geolocation Services**: Real-time location tracking to guide users along the tour route
- **Audio Narration**: AI-generated audio guides for each stop using OpenAI's text-to-speech API
- **Detailed Tour Information**: Comprehensive descriptions, images, and historical context for each stop
- **Responsive Design**: Mobile-first approach ensuring the app works well on smartphones and tablets
- **Offline Capability**: Access to tour content even without continuous internet connection
- **Route Planning**: Optimized walking paths between tour stops
- **Tour Progress Tracking**: Visual indicators of tour completion and distance information

## Architecture

### System Overview

The Amsterdam Walking Tour App follows a modern full-stack JavaScript architecture with the following components:

```
├── Client (React + TypeScript)
│   ├── UI Components
│   ├── State Management
│   ├── API Integration
│   └── Map Integration
│
├── Server (Express + TypeScript)
│   ├── API Routes
│   ├── Static File Serving
│   └── Data Storage
│
└── Shared
    └── TypeScript Schemas
```

### Client-Side Architecture

The frontend is built with React and TypeScript, using a component-based architecture for maintainability and reusability. Key architectural components include:

1. **Component Structure**:
   - Presentational components for UI elements (AudioPlayer, BottomNavigation, Header, etc.)
   - Container components for managing state and logic
   - Page components for routing and layout

2. **State Management**:
   - React Query for server state management and data fetching
   - React's built-in useState and useEffect for component-level state

3. **Map Implementation**:
   - Leaflet.js integration for interactive maps
   - Custom markers and routing visualization
   - Geolocation integration using browser APIs

4. **UI Framework**:
   - TailwindCSS for styling
   - Shadcn UI components for consistent design language
   - Custom styling with styled-components for global styles

### Server-Side Architecture

The backend is built with Express.js and TypeScript, providing API endpoints and serving static assets:

1. **API Endpoints**:
   - RESTful API for tour data
   - Static file serving for audio and images
   - Structured route organization

2. **Data Storage**:
   - In-memory storage implementation with TypeScript interfaces
   - Database schema defined with Drizzle ORM
   - Type safety through shared schemas

3. **Build & Development**:
   - Vite for frontend development and building
   - ESBuild for server-side code transpilation

### Data Flow Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│  React UI   │◄────►│  Express.js │◄────►│  Data Store │
│             │      │   Server    │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       ▲                                         ▲
       │                                         │
       │                                         │
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│             │                          │             │
│  Leaflet.js │                          │ Shared Type │
│    Maps     │                          │  Definitions│
│             │                          │             │
└─────────────┘                          └─────────────┘
```

## Technologies Used

### Frontend

- React 18
- TypeScript
- TailwindCSS
- Shadcn UI
- Leaflet.js for maps
- Howler.js for audio playback
- React Query for data fetching
- Wouter for routing

### Backend

- Express.js
- TypeScript
- Drizzle ORM
- Zod for validation

### Build Tools

- Vite
- ESBuild
- TypeScript

### External Services

- OpenAI's API for text-to-speech conversion
- OpenStreetMap for map tiles

## Local Setup

Follow these steps to run the Amsterdam Walking Tour App locally:

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/amsterdam-tour-app.git
cd amsterdam-tour-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
# For OpenAI TTS functionality (optional, only needed for audio generation)
OPENAI_API_KEY=your_openai_api_key
```

4. **Run the development server**

```bash
npm run dev
```

This will start both the backend server and the frontend development server. The application will be available at `http://localhost:5000`.

5. **Build for production**

```bash
npm run build
```

6. **Run in production mode**

```bash
npm run start
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions and constants
│   │   ├── pages/            # Page components
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   └── index.html            # HTML template
│
├── server/
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Data storage implementation
│   └── vite.ts               # Vite server configuration
│
├── shared/
│   └── schema.ts             # Shared type definitions
│
├── public/
│   ├── audio/                # Tour audio files
│   └── images/               # Tour images
│
├── scripts/                  # Utility scripts for audio generation
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Deployment

The application can be deployed to any hosting service that supports Node.js applications. For Replit-specific deployment:

1. Fork the project on Replit
2. The application is configured for Replit Deployments
3. Click "Deploy" in the Replit interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.
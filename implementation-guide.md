# Amsterdam Walking Tour App: Implementation Guide

This document provides step-by-step implementation instructions to recreate the Amsterdam Walking Tour application.

## Step 1: Project Setup

1. **Initialize the project**:
   ```bash
   # Install Node.js dependencies
   npm init -y
   npm install express typescript tsx vite react react-dom @types/react @types/react-dom @types/express
   npm install @vitejs/plugin-react esbuild
   ```

2. **Set up TypeScript**:
   ```bash
   tsc --init
   ```

3. **Create directory structure**:
   ```
   .
   ├── client/
   │   ├── src/
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── lib/
   │   │   ├── pages/
   │   │   ├── App.tsx
   │   │   └── main.tsx
   ├── server/
   │   ├── index.ts
   │   ├── routes.ts
   │   ├── storage.ts
   │   └── vite.ts
   ├── shared/
   │   └── schema.ts
   ├── public/
   │   ├── audio/
   │   └── images/
   ├── scripts/
   └── package.json
   ```

4. **Install additional key dependencies**:
   ```bash
   # Core functionality
   npm install wouter @tanstack/react-query howler leaflet
   npm install @types/howler

   # UI/Styling
   npm install tailwindcss postcss autoprefixer
   npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
   npm install lucide-react styled-components

   # Data handling
   npm install zod drizzle-orm drizzle-zod
   npm install drizzle-kit --save-dev

   # Shadcn components
   npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-slider
   npm install @radix-ui/react-toast @radix-ui/react-toggle
   ```

5. **Configure Tailwind**:
   ```bash
   npx tailwindcss init -p
   ```

## Step 2: Set Up the Database Schema

Create the shared schema in `shared/schema.ts`:

```typescript
import { pgTable, text, serial, integer, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (optional for future auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tour stops table
export const tourStops = pgTable("tour_stops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  kidsContent: text("kids_content"),
  orderNumber: integer("order_number").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  audioUrl: text("audio_url"),
  duration: text("duration"),
  nextStopWalkingTime: text("next_stop_walking_time"),
  walkingTip: text("walking_tip"),
  images: json("images").$type<string[]>().default([]),
});

export const insertTourStopSchema = createInsertSchema(tourStops).omit({
  id: true,
});

export type InsertTourStop = z.infer<typeof insertTourStopSchema>;
export type TourStop = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  kidsContent: string | null;
  orderNumber: number;
  latitude: number;
  longitude: number;
  audioUrl: string | null;
  duration: string | null;
  nextStopWalkingTime: string | null;
  walkingTip: string | null;
  images: string[];
};

// Route paths table
export const routePaths = pgTable("route_paths", {
  id: serial("id").primaryKey(),
  fromStopId: integer("from_stop_id").notNull(),
  toStopId: integer("to_stop_id").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}[]>().notNull(),
});

export const insertRoutePathSchema = createInsertSchema(routePaths).omit({
  id: true,
});

export type InsertRoutePath = z.infer<typeof insertRoutePathSchema>;
export type RoutePath = {
  id: number;
  fromStopId: number;
  toStopId: number;
  coordinates: { lat: number; lng: number; }[];
};
```

## Step 3: Implement Server Storage

Create the server storage in `server/storage.ts`:

```typescript
import { User, InsertUser, TourStop, InsertTourStop, RoutePath, InsertRoutePath } from '../shared/schema';

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tour stop operations
  getTourStops(): Promise<TourStop[]>;
  getTourStop(id: number): Promise<TourStop | undefined>;
  createTourStop(tourStop: InsertTourStop): Promise<TourStop>;

  // Route path operations
  getRoutePaths(): Promise<RoutePath[]>;
  getRoutePath(id: number): Promise<RoutePath | undefined>;
  createRoutePath(routePath: InsertRoutePath): Promise<RoutePath>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tourStopsMap: Map<number, TourStop>;
  private routePathsMap: Map<number, RoutePath>;
  private userCurrentId: number;
  private tourStopCurrentId: number;
  private routePathCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tourStopsMap = new Map();
    this.routePathsMap = new Map();
    this.userCurrentId = 1;
    this.tourStopCurrentId = 1;
    this.routePathCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(user.id, user);
    return user;
  }

  async getTourStops(): Promise<TourStop[]> {
    return Array.from(this.tourStopsMap.values());
  }

  async getTourStop(id: number): Promise<TourStop | undefined> {
    return this.tourStopsMap.get(id);
  }

  async createTourStop(insertTourStop: InsertTourStop): Promise<TourStop> {
    const id = this.tourStopCurrentId++;
    const tourStop: TourStop = { 
      ...insertTourStop, 
      id,
      kidsContent: insertTourStop.kidsContent || null,
      audioUrl: insertTourStop.audioUrl || null,
      duration: insertTourStop.duration || null,
      nextStopWalkingTime: insertTourStop.nextStopWalkingTime || null,
      walkingTip: insertTourStop.walkingTip || null,
      images: insertTourStop.images || [],
    };
    this.tourStopsMap.set(tourStop.id, tourStop);
    return tourStop;
  }

  async getRoutePaths(): Promise<RoutePath[]> {
    return Array.from(this.routePathsMap.values());
  }

  async getRoutePath(id: number): Promise<RoutePath | undefined> {
    return this.routePathsMap.get(id);
  }

  async createRoutePath(insertRoutePath: InsertRoutePath): Promise<RoutePath> {
    const id = this.routePathCurrentId++;
    const routePath: RoutePath = { 
      ...insertRoutePath, 
      id 
    };
    this.routePathsMap.set(routePath.id, routePath);
    return routePath;
  }
}

// Export singleton instance
export const storage = new MemStorage();
```

## Step 4: Implement Server Routes

Create the server routes in `server/routes.ts`:

```typescript
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

// Initialize with tour data if needed
async function initializeTourData() {
  // Check if we already have tour stops
  const existingStops = await storage.getTourStops();
  if (existingStops.length > 0) {
    return;
  }

  // Tour stops from NEMO to Jordaan
  const tourStops = [
    {
      title: "NEMO Science Museum",
      subtitle: "Starting point - The distinctive green hull-shaped museum",
      description: "We begin at NEMO Science Museum, the large green building shaped like a ship's hull rising from the water...",
      kidsContent: "Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play...",
      orderNumber: 1,
      latitude: 52.374175,
      longitude: 4.912442,
      audioUrl: "/api/audio/stop1_full.mp3",
      duration: "10 minutes",
      nextStopWalkingTime: "5-7 minutes",
      walkingTip: "From NEMO, walk west along the pedestrian bridge...",
      images: ["/api/images/nemo1.jpg", "/api/images/nemo2.jpg"]
    },
    // Add other tour stops here...
  ];

  // Route paths between stops
  const routePaths = [
    {
      fromStopId: 1,
      toStopId: 2,
      coordinates: [
        { lat: 52.374175, lng: 4.912442 },
        { lat: 52.3725, lng: 4.9115 },
        { lat: 52.3715, lng: 4.9105 },
        { lat: 52.3712, lng: 4.9087 }
      ]
    },
    // Add other route paths here...
  ];

  // Save to storage
  for (const stop of tourStops) {
    await storage.createTourStop(stop);
  }

  for (const path of routePaths) {
    await storage.createRoutePath(path);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the tour data
  await initializeTourData();

  // API route to get all tour stops
  app.get("/api/tour-stops", async (req, res) => {
    try {
      const tourStops = await storage.getTourStops();
      res.json(tourStops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour stops" });
    }
  });

  // API route to get tour stop by ID
  app.get("/api/tour-stops/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const tourStop = await storage.getTourStop(id);
      if (!tourStop) {
        return res.status(404).json({ message: "Tour stop not found" });
      }
      res.json(tourStop);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour stop" });
    }
  });

  // API route to get route paths for the tour
  app.get("/api/route-paths", async (req, res) => {
    try {
      const routePaths = await storage.getRoutePaths();
      res.json(routePaths);
    } catch (error) {
      res.status(500).json({ message: "Error fetching route paths" });
    }
  });

  // Tour images - serving JPG files from public/images directory
  app.get("/api/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const jpgPath = path.join(process.cwd(), 'public', 'images', imageName);
    
    // Try to serve the JPG file if it exists
    if (fs.existsSync(jpgPath)) {
      try {
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(jpgPath);
      } catch (error) {
        console.error(`Error serving JPG file ${jpgPath}:`, error);
      }
    }
    
    // Fallback to a placeholder SVG
    const svg = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#E5E5E5"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#333333">
        AMSTERDAM Tour Image
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="16" text-anchor="middle" fill="#666666">
        Image not found for: ${imageName}
      </text>
    </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });
  
  // API route to serve audio files from the public/audio directory
  app.get("/api/audio/:audioFileName", (req, res) => {
    const audioFileName = req.params.audioFileName;
    const audioPath = path.join(process.cwd(), 'public', 'audio', audioFileName);
    
    // Check if the audio file exists
    if (fs.existsSync(audioPath)) {
      res.sendFile(audioPath);
    } else {
      // Fallback for audio files that haven't been generated yet
      const stopNumber = audioFileName.replace(/[^0-9]/g, '');
      
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({
        message: `Audio file for stop ${stopNumber} not found. Run the audio generation script to create it.`,
        audioUrl: req.originalUrl
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
```

## Step 5: Set Up Server Entry Point

Create the server entry point in `server/index.ts`:

```typescript
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    log(`serving on port ${PORT}`);
  });
})();
```

## Step 6: Create Client Hooks and Utilities

Create key hooks in the client directory:

1. `client/src/lib/queryClient.ts`:
```typescript
import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
      queryFn: defaultQueryFn
    },
  },
});

// Default query function that adds the base URL to the query key
async function defaultQueryFn({ queryKey }: { queryKey: string[] }) {
  const [url] = queryKey;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }
  return response.json();
}

// Helper for mutations
export async function apiRequest(url: string, method: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }
  
  return response.json();
}
```

2. `client/src/lib/constants.ts`:
```typescript
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
  title: 'Amsterdam Walking Tour',
  subtitle: 'NEMO to Jordaan',
  totalDistance: '3 km (1.8 miles)',
  totalStops: 8,
  estimatedTime: '3-4 hours',
};

// Map settings
export const MAP_CONFIG = {
  initialCenter: [52.37197, 4.89817], // Amsterdam center
  initialZoom: 14,
  minZoom: 13,
  maxZoom: 18,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Add global styles
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

export default {
  COLORS,
  FONTS,
  TOUR_INFO,
  MAP_CONFIG,
};
```

3. `client/src/hooks/useCurrentLocation.ts`:
```typescript
import { useState, useEffect, useCallback } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

type LocationPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export function useCurrentLocation() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('unknown');

  // Handle location errors
  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError('Please allow location access to track your position on the map');
        setPermissionStatus('denied');
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError('Cannot determine your location. Please check your device settings.');
        break;
      case error.TIMEOUT:
        setLocationError('Location request timed out. Please try again.');
        break;
      default:
        setLocationError('An unknown location error occurred');
        break;
    }
    setCurrentPosition(null);
  }, []);

  // Success handler for getting position
  const handleLocationSuccess = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy, heading, speed } = position.coords;
    setCurrentPosition({ 
      latitude, 
      longitude, 
      accuracy,
      heading: heading !== undefined ? heading : null,
      speed: speed !== undefined ? speed : null,
      timestamp: Date.now()
    });
    setLocationError(null);
    setPermissionStatus('granted');
  }, []);

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionStatus(result.state as LocationPermissionStatus);
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state as LocationPermissionStatus);
        });
      } catch (error) {
        console.error('Permission check error:', error);
      }
    }
  }, []);

  // Request location permission explicitly
  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return Promise.reject('Geolocation not supported');
    }

    return new Promise<Position>((resolve, reject) => {
      console.log("Requesting location permission...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got position with high accuracy:", position.coords);
          const { latitude, longitude, accuracy, heading, speed } = position.coords;
          const newPosition = { 
            latitude, 
            longitude, 
            accuracy,
            heading: heading !== undefined ? heading : null,
            speed: speed !== undefined ? speed : null,
            timestamp: Date.now()
          };
          setCurrentPosition(newPosition);
          setLocationError(null);
          setPermissionStatus('granted');
          resolve(newPosition);
        },
        (error) => {
          console.warn("High accuracy position failed:", error);
          
          // If high accuracy fails, try with lower accuracy
          if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log("Got position with low accuracy:", position.coords);
                const { latitude, longitude, accuracy, heading, speed } = position.coords;
                const newPosition = { 
                  latitude, 
                  longitude, 
                  accuracy,
                  heading: heading !== undefined ? heading : null,
                  speed: speed !== undefined ? speed : null,
                  timestamp: Date.now()
                };
                setCurrentPosition(newPosition);
                setLocationError(null);
                setPermissionStatus('granted');
                resolve(newPosition);
              },
              (fallbackError) => {
                console.error("Both high and low accuracy position failed:", fallbackError);
                handleLocationError(fallbackError);
                reject(fallbackError);
              },
              { 
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000
              }
            );
          } else {
            handleLocationError(error);
            reject(error);
          }
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [handleLocationError]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000
    };

    const id = navigator.geolocation.watchPosition(
      handleLocationSuccess, 
      handleLocationError, 
      options
    );
    
    setWatchId(id);
    setIsWatching(true);
    
    return id;
  }, [handleLocationSuccess, handleLocationError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setIsWatching(false);
      setWatchId(null);
    }
  }, [watchId]);

  // Initialize geolocation watching
  useEffect(() => {
    checkPermission();
    
    // Get initial position and start watching
    requestLocationPermission()
      .then(() => {
        const id = startWatching();
        if (id !== null) {
          setWatchId(id);
        }
      })
      .catch(error => {
        console.warn('Initial location request failed:', error);
        if (permissionStatus !== 'denied') {
          const id = startWatching();
          if (id !== null) {
            setWatchId(id);
          }
        }
      });

    // Clean up
    return () => {
      stopWatching();
    };
  }, [checkPermission, requestLocationPermission, startWatching, stopWatching, permissionStatus]);

  return { 
    currentPosition, 
    locationError, 
    isWatching,
    permissionStatus,
    requestLocationPermission,
    startWatching,
    stopWatching
  };
}
```

4. `client/src/hooks/useTourData.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { TourStop, RoutePath } from '@shared/schema';

export function useTourData() {
  // Fetch tour stops
  const { 
    data: tourStops = [], 
    isLoading: isLoadingStops,
    error: stopError
  } = useQuery<TourStop[]>({
    queryKey: ['/api/tour-stops'],
    staleTime: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetch route paths
  const { 
    data: routePaths = [], 
    isLoading: isLoadingPaths,
    error: pathError
  } = useQuery<RoutePath[]>({
    queryKey: ['/api/route-paths'],
    staleTime: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Sort tour stops by order number
  const sortedTourStops = [...tourStops].sort((a, b) => a.orderNumber - b.orderNumber);

  return {
    tourStops: sortedTourStops,
    routePaths,
    isLoading: isLoadingStops || isLoadingPaths,
    error: stopError || pathError
  };
}
```

## Step 7: Create Core Components

Create the main application components starting with:

1. `client/src/components/AudioPlayer.tsx`
2. `client/src/components/MapView.tsx`
3. `client/src/components/StopPanel.tsx`
4. `client/src/components/ListView.tsx`
5. `client/src/components/Header.tsx`
6. `client/src/components/BottomNavigation.tsx`
7. `client/src/components/ViewToggle.tsx`

Follow the component structure shown in the component analysis, implementing each with its required functionality.

## Step 8: Create the Main Tour Page

Implement the TourPage component in `client/src/pages/TourPage.tsx` that brings together all the individual components.

## Step 9: Create App Entry Point

Set up the main React application entry in `client/src/App.tsx` and `client/src/main.tsx`:

```tsx
// App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import TourPage from "@/pages/TourPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TourPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
```

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Step 10: Create Audio Generation Scripts

Implement scripts to generate audio for tour stops in `scripts/generate-audio.ts`:

```typescript
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { TourStop } from '../shared/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The available voice options
const VOICES = {
  alloy: 'alloy',
  echo: 'echo',
  fable: 'fable',
  onyx: 'onyx',
  nova: 'nova',
  shimmer: 'shimmer',
};

// Choose the voice for tour guide
const TOUR_GUIDE_VOICE = VOICES.fable;

// Function to generate transcript with kids content
function generateTranscript(stop: TourStop): string {
  let transcript = stop.description;
  
  if (stop.kidsContent) {
    transcript += `\n\nFor Kids:\n${stop.kidsContent}`;
  }
  
  return transcript;
}

// Function to generate and save audio for a stop
async function generateAudioForStop(stop: TourStop): Promise<string> {
  try {
    console.log(`Generating audio for stop #${stop.orderNumber}: ${stop.title}`);
    
    // Generate the transcript
    const transcript = generateTranscript(stop);
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: TOUR_GUIDE_VOICE,
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename based on stop number
    const fileName = `stop${stop.orderNumber}_full.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
    // Return the audio relative URL
    return `/api/audio/${fileName}`;
  } catch (error) {
    console.error(`Error generating audio for ${stop.title}:`, error);
    return '';
  }
}

// Load tour stops data
async function loadTourStops(): Promise<TourStop[]> {
  try {
    const { storage } = require('../server/storage');
    return await storage.getTourStops();
  } catch (error) {
    console.error('Error loading tour stops:', error);
    return [];
  }
}

// Main function to generate all audio files
async function generateAllAudio(): Promise<void> {
  try {
    const tourStops = await loadTourStops();
    
    if (!tourStops || tourStops.length === 0) {
      console.error('No tour stops found');
      return;
    }
    
    console.log(`Found ${tourStops.length} tour stops. Starting audio generation...`);
    
    // Sort tour stops by order number
    const sortedStops = [...tourStops].sort((a, b) => a.orderNumber - b.orderNumber);
    
    // Process each stop and collect audio URLs
    const audioUrls: Array<{ stopId: number; audioUrl: string }> = [];
    
    for (const stop of sortedStops) {
      const audioUrl = await generateAudioForStop(stop);
      if (audioUrl) {
        audioUrls.push({ stopId: stop.id, audioUrl });
      }
    }
    
    console.log('Audio generation complete!');
    console.log('Audio URLs:', audioUrls);
    
    // You can optionally save the audio URLs to a file for reference
    fs.writeFileSync('audio-urls.json', JSON.stringify(audioUrls, null, 2));
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateAllAudio();
```

## Step 11: Create Package.json Scripts

Update the scripts section in package.json:

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "tsc && vite build",
  "start": "NODE_ENV=production node dist/server/index.js",
  "generate-audio": "tsx scripts/generate-audio.ts"
}
```

## Step 12: Add Necessary Images and Media

Add placeholder images to the `public/images` directory, and prepare the `public/audio` directory for generated audio files.

## Step 13: Configure Deployment

Set up the application for deployment by ensuring:
- Static assets are correctly served
- Environment variables are properly managed
- Paths and URLs are correctly referenced

## Step 14: Testing and Refinement

Test the application thoroughly:
1. Test the map view with geolocation
2. Test audio playback and transcript display
3. Test the sliding panel interaction
4. Test navigation between stops
5. Test list view and stop selection
6. Test responsive design on mobile devices

Make refinements based on testing feedback to ensure a polished user experience.
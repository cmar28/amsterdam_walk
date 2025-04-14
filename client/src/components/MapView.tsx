import React, { useEffect, useRef, useState } from 'react';
import { MAP_CONFIG } from '@/lib/constants';
import { TourStop, RoutePath } from '@shared/schema';
import { MapPin, Plus, Minus, Navigation2 } from 'lucide-react';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';

// Declare Leaflet variables for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  tourStops: TourStop[];
  routePaths: RoutePath[];
  currentStopId: number;
  onStopSelect: (stopId: number, switchToMap?: boolean) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  tourStops, 
  routePaths, 
  currentStopId, 
  onStopSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routePathsRef = useRef<any[]>([]);
  const { currentPosition, locationError } = useCurrentLocation();
  const [userMarker, setUserMarker] = useState<any>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = window.L;
    if (!L) {
      console.error('Leaflet is not loaded');
      return;
    }

    // Initialize map
    const map = L.map(mapRef.current, {
      center: MAP_CONFIG.initialCenter,
      zoom: MAP_CONFIG.initialZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      zoomControl: false // We'll add custom zoom controls
    });

    // Add tile layer
    L.tileLayer(MAP_CONFIG.tileLayerUrl, {
      attribution: MAP_CONFIG.attribution
    }).addTo(map);

    leafletMapRef.current = map;

    // Clean up on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Render tour stops as markers
  useEffect(() => {
    if (!leafletMapRef.current || !tourStops.length) return;

    const L = window.L;
    const map = leafletMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Prepare bounds for fitting markers
    const bounds = L.latLngBounds([]);

    // Add new markers for each tour stop
    tourStops.forEach(stop => {
      // Create custom icon based on stop status (current or not)
      const isCurrentStop = stop.id === currentStopId;
      
      const markerHtml = `
        <div class="bg-${isCurrentStop ? '[#FF6B35]' : '[#004D7F]'} text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          <span class="font-heading font-bold">${stop.orderNumber}</span>
        </div>
      `;
      
      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Create marker with correct coordinates
      const latLng = [stop.latitude, stop.longitude];
      const marker = L.marker(latLng, { icon })
        .addTo(map)
        .on('click', () => onStopSelect(stop.id, true));

      // Add popup with stop name for easier identification
      marker.bindTooltip(`${stop.orderNumber}. ${stop.title}`, { 
        direction: 'top',
        offset: [0, -16]
      });

      // Add to marker ref for future cleanup
      markersRef.current.push(marker);
      
      // Extend bounds to include this marker
      bounds.extend(latLng);
    });

    // Fit the map to show all markers with some padding
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }

    // Log markers to verify coordinates
    console.log('Map markers created with coordinates:', 
      tourStops.map(stop => `${stop.orderNumber}. ${stop.title}: [${stop.latitude}, ${stop.longitude}]`));
  }, [tourStops, currentStopId, onStopSelect]);

  // Route paths rendering is disabled as requested
  // We'll only show the stop markers without the connecting routes
  useEffect(() => {
    // Clear any existing paths whenever this component updates
    if (leafletMapRef.current) {
      routePathsRef.current.forEach(path => path.remove());
      routePathsRef.current = [];
    }
  }, [routePaths]);

  // Update user location marker when position changes
  useEffect(() => {
    if (!leafletMapRef.current || !currentPosition) return;

    const L = window.L;
    const map = leafletMapRef.current;
    
    // Remove existing user marker
    if (userMarker) {
      userMarker.remove();
    }
    
    // Create custom user location marker
    const userLocationHtml = `
      <div class="relative">
        <div class="bg-blue-500 rounded-full w-6 h-6 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="bg-blue-300 rounded-full w-2 h-2 animate-ping absolute"></div>
        </div>
        <div class="bg-blue-500 opacity-20 rounded-full w-12 h-12 -top-3 -left-3 absolute"></div>
      </div>
    `;
    
    const icon = L.divIcon({
      html: userLocationHtml,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    // Add marker for user's location
    const newUserMarker = L.marker(
      [currentPosition.latitude, currentPosition.longitude],
      { icon, zIndexOffset: 1000 }
    ).addTo(map);
    
    setUserMarker(newUserMarker);
  }, [currentPosition]);

  // Handle map controls
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleCenterOnUser = () => {
    if (leafletMapRef.current && currentPosition) {
      leafletMapRef.current.setView(
        [currentPosition.latitude, currentPosition.longitude],
        MAP_CONFIG.initialZoom
      );
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="bg-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
          aria-label="Zoom in"
        >
          <Plus className="h-6 w-6 text-neutral-dark" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
          aria-label="Zoom out"
        >
          <Minus className="h-6 w-6 text-neutral-dark" />
        </button>
        <button 
          onClick={handleCenterOnUser}
          className={`bg-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center ${
            currentPosition ? 'text-[#004D7F]' : 'text-gray-400'
          }`}
          aria-label="Center on my location"
          disabled={!currentPosition}
        >
          <Navigation2 className="h-6 w-6" />
        </button>
      </div>
      
      {/* Location error message */}
      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-red-500 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {locationError}
        </div>
      )}
    </div>
  );
};

export default MapView;

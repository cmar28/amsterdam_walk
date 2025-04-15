import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MAP_CONFIG } from '@/lib/constants';
import { TourStop, RoutePath } from '@shared/schema';
import { MapPin, Plus, Minus, Navigation2, AlertTriangle } from 'lucide-react';
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
  // Refs for map elements
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routePathsRef = useRef<any[]>([]);
  const accuracyCircleRef = useRef<any>(null);
  
  // State
  const [userMarker, setUserMarker] = useState<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Get current location
  const { 
    currentPosition, 
    locationError, 
    permissionStatus,
    requestLocationPermission 
  } = useCurrentLocation();
  
  // Function to handle location permission request
  const handleRequestLocation = useCallback(async () => {
    try {
      await requestLocationPermission();
    } catch (error) {
      console.error('Failed to get location permission:', error);
    }
  }, [requestLocationPermission]);

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
    setIsMapInitialized(true);

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
    if (!isMapInitialized || !leafletMapRef.current || !tourStops.length) return;

    const L = window.L;
    const map = leafletMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Prepare bounds for fitting markers
    // Create bounds for markers
    const bounds = L.latLngBounds(
      // Add initial center coordinates to have at least one point
      [[MAP_CONFIG.initialCenter[0], MAP_CONFIG.initialCenter[1]]]
    );

    // Add new markers for each tour stop
    tourStops.forEach(stop => {
      // Create custom icon based on stop status (current or not)
      const isCurrentStop = stop.id === currentStopId;
      
      const markerHtml = `
        <div class="bg-${isCurrentStop ? '[#FF6B35]' : '[#004D7F]'} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg ${isCurrentStop ? 'border-2 border-white' : ''}">
          <span class="font-heading font-bold text-lg">${stop.orderNumber}</span>
        </div>
      `;
      
      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
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
    try {
      if (bounds.isValid() && markersRef.current.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      } else {
        // Fallback to initial center if bounds are not valid
        map.setView(MAP_CONFIG.initialCenter, MAP_CONFIG.initialZoom);
      }
    } catch (error) {
      console.warn('Could not fit bounds, using default view:', error);
      map.setView(MAP_CONFIG.initialCenter, MAP_CONFIG.initialZoom);
    }

    console.log('Map markers created with coordinates:', 
      tourStops.map(stop => `${stop.orderNumber}. ${stop.title}: [${stop.latitude}, ${stop.longitude}]`));
  }, [tourStops, currentStopId, onStopSelect, isMapInitialized]);

  // Route paths rendering is disabled as requested
  useEffect(() => {
    if (!isMapInitialized || !leafletMapRef.current) return;
    
    // Clear any existing paths
    routePathsRef.current.forEach(path => path.remove());
    routePathsRef.current = [];
  }, [routePaths, isMapInitialized]);

  // Update user location marker when position changes
  useEffect(() => {
    if (!isMapInitialized || !leafletMapRef.current || !currentPosition) return;

    const L = window.L;
    const map = leafletMapRef.current;
    
    // Remove existing user marker and accuracy circle
    if (userMarker) {
      userMarker.remove();
    }
    
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }
    
    // Create accuracy circle first (so it appears under the marker)
    if (currentPosition.accuracy) {
      accuracyCircleRef.current = L.circle(
        [currentPosition.latitude, currentPosition.longitude],
        {
          radius: currentPosition.accuracy,
          fillColor: '#4299e1',
          fillOpacity: 0.15,
          stroke: true,
          color: '#4299e1',
          weight: 1
        }
      ).addTo(map);
    }
    
    // Create custom user location marker with enhanced visibility
    const userLocationHtml = `
      <div class="relative">
        <div class="bg-blue-500 rounded-full w-8 h-8 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="bg-blue-300 rounded-full w-3 h-3 animate-ping absolute"></div>
        </div>
        <div class="bg-blue-500 opacity-20 rounded-full w-16 h-16 -top-4 -left-4 absolute animate-pulse"></div>
      </div>
    `;
    
    const icon = L.divIcon({
      html: userLocationHtml,
      className: 'user-location-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    // Add marker for user's location
    const newUserMarker = L.marker(
      [currentPosition.latitude, currentPosition.longitude],
      { icon, zIndexOffset: 1000 }
    ).addTo(map);
    
    // Add tooltip showing accuracy
    if (currentPosition.accuracy) {
      newUserMarker.bindTooltip(`You are here (±${Math.round(currentPosition.accuracy)}m)`, {
        permanent: false,
        direction: 'top',
        offset: [0, -16]
      });
    }
    
    setUserMarker(newUserMarker);
    
    // Fly to user location if this is the first time we're getting it
    if (!userMarker) {
      map.flyTo(
        [currentPosition.latitude, currentPosition.longitude],
        16,
        {
          animate: true,
          duration: 1.5
        }
      );
    }
  }, [currentPosition, isMapInitialized]);

  // Handle map controls
  const handleZoomIn = useCallback(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  }, []);

  const handleCenterOnUser = useCallback(() => {
    if (!leafletMapRef.current) {
      console.warn("Map reference not available");
      return;
    }
    
    if (currentPosition) {
      console.log("MapView: Flying to user location:", [currentPosition.latitude, currentPosition.longitude]);
      // Use a more direct approach to access the map
      const map = leafletMapRef.current;
      map.flyTo(
        [currentPosition.latitude, currentPosition.longitude],
        16,
        {
          animate: true,
          duration: 1
        }
      );
      
      // Make the user marker pulse to highlight it
      const userMarkerElement = document.querySelector('.user-location-marker');
      if (userMarkerElement) {
        userMarkerElement.classList.add('highlight-pulse');
        setTimeout(() => {
          userMarkerElement.classList.remove('highlight-pulse');
        }, 2000);
      }
    } else {
      // If no position, try to request it
      console.log("MapView: Requesting location permission");
      handleRequestLocation();
    }
  }, [currentPosition, handleRequestLocation]);

  return (
    <div className="h-full w-full relative">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map controls - optimized for touch */}
      <div className="absolute bottom-6 right-4 flex flex-col space-y-3">
        <button 
          onClick={handleZoomIn}
          className="bg-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center touch-manipulation active:bg-gray-100 active:scale-95 transition-transform"
          aria-label="Zoom in"
        >
          <Plus className="h-7 w-7 text-neutral-dark" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center touch-manipulation active:bg-gray-100 active:scale-95 transition-transform"
          aria-label="Zoom out"
        >
          <Minus className="h-7 w-7 text-neutral-dark" />
        </button>
        <button 
          onClick={handleCenterOnUser}
          className={`bg-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center touch-manipulation active:bg-gray-100 active:scale-95 transition-transform ${
            currentPosition ? 'text-blue-500' : permissionStatus === 'denied' ? 'text-red-500' : 'text-gray-500'
          }`}
          aria-label="Center on my location"
        >
          <Navigation2 className="h-7 w-7" />
        </button>
      </div>
      
      {/* Location permission banner - when denied */}
      {permissionStatus === 'denied' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-lg text-sm text-red-500 flex items-center max-w-[90%]">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Location access denied</p>
            <p className="text-gray-600 text-xs mt-1">Please enable location services in your device settings to see your position on the map.</p>
          </div>
        </div>
      )}
      
      {/* Location error message - when error occurs */}
      {locationError && permissionStatus !== 'denied' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-red-500 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {locationError}
        </div>
      )}
      
      {/* Location request banner - when prompt and not dismissed */}
      {permissionStatus === 'prompt' && !currentPosition && !sessionStorage.getItem('locationPromptDismissed') && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-lg max-w-[90%]">
          <p className="text-sm font-medium">Show your location on the map?</p>
          <p className="text-xs text-gray-600 mb-2">See where you are in relation to tour stops</p>
          <div className="flex justify-end space-x-2">
            <button 
              className="px-3 py-1.5 text-xs text-gray-600 rounded-md"
              onClick={() => {
                // Set a session flag to avoid showing this prompt again
                sessionStorage.setItem('locationPromptDismissed', 'true');
                // Force component to update
                setIsMapInitialized(prev => prev);
              }}
            >
              Not now
            </button>
            <button 
              className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md font-medium"
              onClick={handleRequestLocation}
            >
              Allow location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

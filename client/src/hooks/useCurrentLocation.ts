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

  // Handle location errors - define this first to avoid reference errors
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
      timestamp: Date.now() // Use current timestamp
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
      
      // First try with high accuracy (GPS)
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
            timestamp: Date.now() // Use current timestamp
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
                maximumAge: 60000 // Accept positions up to 1 minute old
              }
            );
          } else {
            // If it's a permission error or other, just handle it
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

    // Options for geolocation
    const options = {
      enableHighAccuracy: true, // Use GPS if available
      maximumAge: 10000,        // Cache position for 10 seconds
      timeout: 15000            // Time to wait for position
    };

    // Start watching position
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
        // Still try to start watching even if initial request failed
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

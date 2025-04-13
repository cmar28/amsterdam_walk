import { useState, useEffect } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useCurrentLocation() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Start watching position when component mounts
  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    // Success handler for getting position
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentPosition({ latitude, longitude, accuracy });
      setLocationError(null);
    };

    // Error handler for getting position
    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError('Please allow location access to see your position on the map');
          break;
        case error.POSITION_UNAVAILABLE:
          setLocationError('Location information is unavailable');
          break;
        case error.TIMEOUT:
          setLocationError('Location request timed out');
          break;
        default:
          setLocationError('An unknown error occurred');
          break;
      }
      setCurrentPosition(null);
    };

    // Options for geolocation
    const options = {
      enableHighAccuracy: true, // Use GPS if available
      maximumAge: 30000,        // Cache position for 30 seconds
      timeout: 27000            // Time to wait for position
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Start watching position
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    setWatchId(id);
    setIsWatching(true);

    // Clean up by clearing the watch when component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setIsWatching(false);
        setWatchId(null);
      }
    };
  }, []);

  return { currentPosition, locationError, isWatching };
}

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { TourStop, RoutePath } from '@shared/schema';
import { cacheService } from '@/lib/cacheService';

export function useTourData() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [usingOfflineData, setUsingOfflineData] = useState<boolean>(false);
  
  // Update online status when it changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check if we should use cached data (offline mode)
  useEffect(() => {
    const checkCacheStatus = async () => {
      // If we're offline, check if we have cached data
      if (!isOnline) {
        const cached = await cacheService.isCached();
        setUsingOfflineData(cached);
      } else {
        setUsingOfflineData(false);
      }
    };
    
    checkCacheStatus();
  }, [isOnline]);
  
  // Function to fetch tour stops, with fallback to cache if offline
  const fetchTourStops = async (): Promise<TourStop[]> => {
    try {
      // First try the network request
      const response = await fetch('/api/tour-stops');
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    } catch (error) {
      // If network request fails, try to get cached data
      console.log('Using cached tour stops data');
      const cachedTourStops = await cacheService.getCachedTourStops();
      if (cachedTourStops) {
        setUsingOfflineData(true);
        return cachedTourStops;
      }
      // If no cached data, rethrow error
      throw error;
    }
  };
  
  // Function to fetch route paths, with fallback to cache if offline
  const fetchRoutePaths = async (): Promise<RoutePath[]> => {
    try {
      // First try the network request
      const response = await fetch('/api/route-paths');
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    } catch (error) {
      // If network request fails, try to get cached data
      console.log('Using cached route paths data');
      const cachedRoutePaths = await cacheService.getCachedRoutePaths();
      if (cachedRoutePaths) {
        setUsingOfflineData(true);
        return cachedRoutePaths;
      }
      // If no cached data, rethrow error
      throw error;
    }
  };

  // Fetch tour stops with cache fallback
  const { 
    data: tourStops = [], 
    isLoading: isLoadingStops,
    error: stopError
  } = useQuery<TourStop[]>({
    queryKey: ['/api/tour-stops', isOnline],
    queryFn: fetchTourStops,
    staleTime: isOnline ? 5000 : Infinity, // If offline, don't revalidate
    retry: isOnline ? 3 : 0, // Retry 3 times if online, 0 if offline
    retryDelay: 1000,
    refetchOnMount: isOnline, // Only refetch when online
    refetchOnWindowFocus: isOnline, // Only refetch when online
  });

  // Fetch route paths with cache fallback
  const { 
    data: routePaths = [], 
    isLoading: isLoadingPaths,
    error: pathError
  } = useQuery<RoutePath[]>({
    queryKey: ['/api/route-paths', isOnline],
    queryFn: fetchRoutePaths,
    staleTime: isOnline ? 5000 : Infinity, // If offline, don't revalidate
    retry: isOnline ? 3 : 0, // Retry 3 times if online, 0 if offline
    retryDelay: 1000,
    refetchOnMount: isOnline, // Only refetch when online
    refetchOnWindowFocus: isOnline, // Only refetch when online
  });

  // Sort tour stops by order number
  const sortedTourStops = [...tourStops].sort((a, b) => a.orderNumber - b.orderNumber);

  return {
    tourStops: sortedTourStops,
    routePaths,
    isLoading: isLoadingStops || isLoadingPaths,
    error: stopError || pathError,
    isOnline,
    usingOfflineData
  };
}

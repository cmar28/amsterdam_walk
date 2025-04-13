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
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  // Fetch route paths
  const { 
    data: routePaths = [], 
    isLoading: isLoadingPaths,
    error: pathError
  } = useQuery<RoutePath[]>({
    queryKey: ['/api/route-paths'],
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
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

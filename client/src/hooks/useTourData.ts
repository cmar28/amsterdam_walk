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
    staleTime: 5000, // Cache for just 5 seconds to ensure fresh data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gets focus
  });

  // Fetch route paths
  const { 
    data: routePaths = [], 
    isLoading: isLoadingPaths,
    error: pathError
  } = useQuery<RoutePath[]>({
    queryKey: ['/api/route-paths'],
    staleTime: 5000, // Cache for just 5 seconds
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gets focus
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

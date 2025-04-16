/**
 * Cache Service for offline tour data
 * Handles downloading and storing tour content for offline use
 */

import { TourStop, RoutePath } from '@shared/schema';

// Types for cached data
interface DownloadProgress {
  total: number;
  downloaded: number;
  completed: boolean;
  error?: string;
}

// Local storage keys
const STORAGE_KEYS = {
  TOUR_STOPS: 'offline:tour-stops',
  ROUTE_PATHS: 'offline:route-paths',
  AUDIO_FILES: 'offline:audio-files',
  IMAGES: 'offline:images',
  CACHE_TIMESTAMP: 'offline:cache-timestamp',
};

// Cache API for storing larger assets (audio, images)
class CacheService {
  private cacheName = 'amsterdam-tour-cache-v1';
  private progressListeners: Array<(progress: DownloadProgress) => void> = [];
  private currentProgress: DownloadProgress = {
    total: 0,
    downloaded: 0,
    completed: false,
  };

  constructor() {
    // Initialize progress
    this.currentProgress = {
      total: 0,
      downloaded: 0,
      completed: false,
    };
  }

  /**
   * Check if browser supports the necessary APIs for offline caching
   */
  isSupported(): boolean {
    return (
      'caches' in window &&
      'localStorage' in window &&
      'indexedDB' in window &&
      'serviceWorker' in navigator
    );
  }

  /**
   * Check if tour data is already cached and up-to-date
   */
  async isCached(): Promise<boolean> {
    try {
      // Check if we have tour stops cached
      const tourStopsJson = localStorage.getItem(STORAGE_KEYS.TOUR_STOPS);
      if (!tourStopsJson) return false;

      // Check if we have route paths cached
      const routePathsJson = localStorage.getItem(STORAGE_KEYS.ROUTE_PATHS);
      if (!routePathsJson) return false;

      // Check if caches exist
      const cache = await this.getCache();
      if (!cache) return false;

      // Check if audio files are cached (by checking keys in cache)
      const audioFilesJson = localStorage.getItem(STORAGE_KEYS.AUDIO_FILES);
      if (!audioFilesJson) return false;

      // Check if images are cached
      const imagesJson = localStorage.getItem(STORAGE_KEYS.IMAGES);
      if (!imagesJson) return false;

      return true;
    } catch (error) {
      console.error('Error checking cache status:', error);
      return false;
    }
  }

  /**
   * Get a reference to the cache
   */
  private async getCache(): Promise<Cache | null> {
    try {
      return await caches.open(this.cacheName);
    } catch (error) {
      console.error('Error opening cache:', error);
      return null;
    }
  }

  /**
   * Add a progress listener for download updates
   */
  addProgressListener(listener: (progress: DownloadProgress) => void): void {
    this.progressListeners.push(listener);
    // Immediately provide current progress to new listener
    listener(this.currentProgress);
  }

  /**
   * Remove a progress listener
   */
  removeProgressListener(listener: (progress: DownloadProgress) => void): void {
    this.progressListeners = this.progressListeners.filter(l => l !== listener);
  }

  /**
   * Update download progress and notify listeners
   */
  private updateProgress(update: Partial<DownloadProgress>): void {
    this.currentProgress = {
      ...this.currentProgress,
      ...update,
    };
    
    this.progressListeners.forEach(listener => {
      listener(this.currentProgress);
    });
  }

  /**
   * Download and cache audio files from tour stops
   */
  private async cacheAudioFiles(tourStops: TourStop[]): Promise<string[]> {
    const cache = await this.getCache();
    if (!cache) throw new Error('Cache not available');

    const audioUrls: string[] = [];
    for (const stop of tourStops) {
      if (stop.audioUrl) {
        audioUrls.push(stop.audioUrl);
      }
    }

    // Cache audio files
    const cachedAudioUrls: string[] = [];
    for (const url of audioUrls) {
      try {
        // Make a new fetch request for each URL
        const response = await fetch(url);
        if (response.ok) {
          // Create a clone before using the response
          const responseToCache = response.clone();
          await cache.put(url, responseToCache);
          cachedAudioUrls.push(url);
          this.updateProgress({
            downloaded: this.currentProgress.downloaded + 1,
          });
        } else {
          console.warn(`Failed to cache audio: ${url}, status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error caching audio ${url}:`, error);
      }
    }

    return cachedAudioUrls;
  }

  /**
   * Download and cache image files from tour stops
   */
  private async cacheImages(tourStops: TourStop[]): Promise<string[]> {
    const cache = await this.getCache();
    if (!cache) throw new Error('Cache not available');

    const imageUrls: string[] = [];
    for (const stop of tourStops) {
      if (stop.images && stop.images.length) {
        imageUrls.push(...stop.images);
      }
    }

    // Cache image files
    const cachedImageUrls: string[] = [];
    for (const url of imageUrls) {
      try {
        // Make a new fetch request for each URL
        const response = await fetch(url);
        if (response.ok) {
          // Create a clone before using the response
          const responseToCache = response.clone();
          await cache.put(url, responseToCache);
          cachedImageUrls.push(url);
          this.updateProgress({
            downloaded: this.currentProgress.downloaded + 1,
          });
        } else {
          console.warn(`Failed to cache image: ${url}, status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error caching image ${url}:`, error);
      }
    }

    return cachedImageUrls;
  }

  /**
   * Download all tour data for offline use
   */
  async downloadTourData(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Your browser does not support offline caching');
    }

    try {
      // Start download process
      this.updateProgress({
        total: 0,
        downloaded: 0,
        completed: false,
        error: undefined,
      });

      // Fetch tour stops
      const tourStopsResponse = await fetch('/api/tour-stops');
      if (!tourStopsResponse.ok) {
        throw new Error('Failed to fetch tour stops');
      }
      const tourStops: TourStop[] = await tourStopsResponse.json();

      // Fetch route paths
      const routePathsResponse = await fetch('/api/route-paths');
      if (!routePathsResponse.ok) {
        throw new Error('Failed to fetch route paths');
      }
      const routePaths: RoutePath[] = await routePathsResponse.json();

      // Calculate total items to download (tour data + audio files + images)
      let totalItems = 2; // Tour stops and route paths
      
      // Count audio files
      const audioUrls = tourStops
        .filter(stop => stop.audioUrl)
        .map(stop => stop.audioUrl as string);
      totalItems += audioUrls.length;
      
      // Count images
      const imageUrls = tourStops.flatMap(stop => stop.images || []);
      totalItems += imageUrls.length;

      this.updateProgress({
        total: totalItems,
        downloaded: 0,
      });

      // Cache API endpoints
      const cache = await this.getCache();
      if (!cache) throw new Error('Cache not available');

      try {
        // We need to make fresh requests to cache the API endpoints
        const tourStopsResponseForCache = await fetch('/api/tour-stops');
        if (tourStopsResponseForCache.ok) {
          await cache.put('/api/tour-stops', tourStopsResponseForCache.clone());
        }
        
        // Store the data in localStorage
        localStorage.setItem(STORAGE_KEYS.TOUR_STOPS, JSON.stringify(tourStops));
        this.updateProgress({
          downloaded: this.currentProgress.downloaded + 1,
        });

        // Same for route paths
        const routePathsResponseForCache = await fetch('/api/route-paths');
        if (routePathsResponseForCache.ok) {
          await cache.put('/api/route-paths', routePathsResponseForCache.clone());
        }
        
        // Store the data in localStorage
        localStorage.setItem(STORAGE_KEYS.ROUTE_PATHS, JSON.stringify(routePaths));
        this.updateProgress({
          downloaded: this.currentProgress.downloaded + 1,
        });
      } catch (error) {
        console.error('Error caching API responses:', error);
        throw error;
      }

      // Cache audio files
      const cachedAudioUrls = await this.cacheAudioFiles(tourStops);
      localStorage.setItem(STORAGE_KEYS.AUDIO_FILES, JSON.stringify(cachedAudioUrls));

      // Cache images
      const cachedImageUrls = await this.cacheImages(tourStops);
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(cachedImageUrls));

      // Store timestamp of last cache update
      localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, new Date().toISOString());

      // Mark download as complete
      this.updateProgress({
        completed: true,
      });

      return true;
    } catch (error) {
      console.error('Error downloading tour data:', error);
      this.updateProgress({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return false;
    }
  }

  /**
   * Get cached tour stops
   */
  async getCachedTourStops(): Promise<TourStop[] | null> {
    try {
      const cachedData = localStorage.getItem(STORAGE_KEYS.TOUR_STOPS);
      if (!cachedData) return null;
      return JSON.parse(cachedData) as TourStop[];
    } catch (error) {
      console.error('Error retrieving cached tour stops:', error);
      return null;
    }
  }

  /**
   * Get cached route paths
   */
  async getCachedRoutePaths(): Promise<RoutePath[] | null> {
    try {
      const cachedData = localStorage.getItem(STORAGE_KEYS.ROUTE_PATHS);
      if (!cachedData) return null;
      return JSON.parse(cachedData) as RoutePath[];
    } catch (error) {
      console.error('Error retrieving cached route paths:', error);
      return null;
    }
  }

  /**
   * Get the last cache timestamp
   */
  getCacheTimestamp(): Date | null {
    try {
      const timestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
      if (!timestamp) return null;
      return new Date(timestamp);
    } catch (error) {
      console.error('Error retrieving cache timestamp:', error);
      return null;
    }
  }

  /**
   * Clear all cached tour data
   */
  async clearCache(): Promise<boolean> {
    try {
      // Remove localStorage items
      localStorage.removeItem(STORAGE_KEYS.TOUR_STOPS);
      localStorage.removeItem(STORAGE_KEYS.ROUTE_PATHS);
      localStorage.removeItem(STORAGE_KEYS.AUDIO_FILES);
      localStorage.removeItem(STORAGE_KEYS.IMAGES);
      localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMP);

      // Delete cache
      await caches.delete(this.cacheName);

      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  /**
   * Get the estimated size of cached data in MB
   */
  async getCacheSize(): Promise<number> {
    try {
      const cache = await this.getCache();
      if (!cache) return 0;

      const keys = await cache.keys();
      let totalSize = 0;

      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      // Convert bytes to MB
      return totalSize / (1024 * 1024);
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();
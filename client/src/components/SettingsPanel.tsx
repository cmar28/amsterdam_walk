import React, { useState, useEffect } from 'react';
import { Download, Trash2, RefreshCw, CheckCircle, AlertCircle, WifiOff } from 'lucide-react';
import { cacheService } from '@/lib/cacheService';
import { useToast } from '@/hooks/use-toast';

const SettingsPanel: React.FC = () => {
  const { toast } = useToast();
  const [downloadProgress, setDownloadProgress] = useState<{ total: number; downloaded: number; completed: boolean; error?: string }>({
    total: 0,
    downloaded: 0,
    completed: false
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCacheAvailable, setIsCacheAvailable] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheDate, setCacheDate] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Check network status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if cache is supported
  const isCacheSupported = cacheService.isSupported();

  // Check cache status on mount
  useEffect(() => {
    const checkCacheStatus = async () => {
      const cached = await cacheService.isCached();
      setIsCacheAvailable(cached);
      
      if (cached) {
        const size = await cacheService.getCacheSize();
        setCacheSize(size);
        
        const timestamp = cacheService.getCacheTimestamp();
        setCacheDate(timestamp);
      }
    };
    
    checkCacheStatus();
  }, []);

  // Listen for download progress updates
  useEffect(() => {
    const handleProgressUpdate = (progress: typeof downloadProgress) => {
      setDownloadProgress(progress);
      
      if (progress.completed) {
        setIsDownloading(false);
        setIsCacheAvailable(true);
        
        // Update cache info
        const updateCacheInfo = async () => {
          const size = await cacheService.getCacheSize();
          setCacheSize(size);
          
          const timestamp = cacheService.getCacheTimestamp();
          setCacheDate(timestamp);
        };
        
        updateCacheInfo();
        
        toast({
          title: "Download completed",
          description: "All tour content is now available offline.",
        });
      }
      
      if (progress.error) {
        setIsDownloading(false);
        
        toast({
          title: "Download failed",
          description: progress.error,
          variant: "destructive",
        });
      }
    };
    
    // Register progress listener
    cacheService.addProgressListener(handleProgressUpdate);
    
    // Clean up listener on unmount
    return () => {
      cacheService.removeProgressListener(handleProgressUpdate);
    };
  }, [toast]);

  // Start downloading content
  const handleDownload = async () => {
    if (!isCacheSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support offline caching.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "You need to be online to download content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDownloading(true);
    
    try {
      await cacheService.downloadTourData();
    } catch (error) {
      setIsDownloading(false);
      console.error("Error downloading content:", error);
      
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download content.",
        variant: "destructive",
      });
    }
  };

  // Clear all cached content
  const handleClearCache = async () => {
    if (!isCacheAvailable) return;
    
    if (confirm("Are you sure you want to delete all cached content? You'll need to download it again to use offline.")) {
      try {
        await cacheService.clearCache();
        setIsCacheAvailable(false);
        setCacheSize(0);
        setCacheDate(null);
        
        toast({
          title: "Cache cleared",
          description: "All cached content has been removed.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error clearing cache:", error);
        
        toast({
          title: "Failed to clear cache",
          description: "There was an error clearing the cached content.",
          variant: "destructive",
        });
      }
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate download percentage
  const downloadPercentage = downloadProgress.total > 0
    ? Math.round((downloadProgress.downloaded / downloadProgress.total) * 100)
    : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold mb-2">Settings</h2>
        <p className="text-gray-600 text-sm">Manage your tour settings and offline content</p>
      </div>
      
      {/* Network status indicator */}
      <div className="mb-6 p-3 rounded-lg bg-gray-50 flex items-center">
        {isOnline ? (
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        ) : (
          <WifiOff className="h-5 w-5 text-orange-500 mr-2" />
        )}
        <div>
          <div className="font-medium">
            {isOnline ? "Online" : "Offline"}
          </div>
          <div className="text-sm text-gray-600">
            {isOnline 
              ? "You're connected to the internet" 
              : "No internet connection detected"}
          </div>
        </div>
      </div>
      
      {/* Offline content section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-lg">Offline Content</h3>
          <p className="text-gray-600 text-sm mt-1">
            Download tour content to use without internet
          </p>
        </div>
        
        {!isCacheSupported ? (
          <div className="p-4 bg-orange-50 border-orange-100">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium text-orange-700">Not Supported</span>
            </div>
            <p className="text-sm text-orange-700">
              Your browser doesn't support offline content caching. Try using a modern browser like Chrome, Firefox, or Safari.
            </p>
          </div>
        ) : !isCacheAvailable ? (
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Download all tour stops, maps, images, and audio for offline use.
              {!isOnline && (
                <span className="block mt-2 text-orange-600">
                  You need to be online to download content.
                </span>
              )}
            </p>
            
            {isDownloading ? (
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Downloading...</span>
                  <span>{downloadPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#FF6B35] h-2.5 rounded-full" 
                    style={{ width: `${downloadPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {downloadProgress.downloaded} of {downloadProgress.total} items
                </div>
              </div>
            ) : (
              <button
                onClick={handleDownload}
                disabled={!isOnline}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium text-sm ${
                  isOnline
                    ? 'bg-[#FF6B35] text-white active:bg-[#E85A24]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Offline Use
              </button>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Content available offline</span>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>Size:</div>
                <div>{cacheSize.toFixed(1)} MB</div>
                
                <div>Downloaded:</div>
                <div>{cacheDate ? formatDate(cacheDate) : 'Unknown'}</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                disabled={!isOnline || isDownloading}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm ${
                  isOnline && !isDownloading
                    ? 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Update
              </button>
              
              <button
                onClick={handleClearCache}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm active:bg-red-100"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Additional settings would go here */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-lg">App Settings</h3>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Distance units</span>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>Kilometers</option>
              <option>Miles</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">App theme</span>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Text size</span>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Amsterdam Walking Tour App v1.0.0</p>
        <p className="mt-1">© 2025 Amsterdam Tour Guide</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
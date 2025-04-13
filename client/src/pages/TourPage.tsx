import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import ViewToggle from '@/components/ViewToggle';
import MapView from '@/components/MapView';
import ListView from '@/components/ListView';
import StopPanel from '@/components/StopPanel';
import BottomNavigation from '@/components/BottomNavigation';
import { TourStop, RoutePath } from '@shared/schema';
import { useTourData } from '@/hooks/useTourData';

type NavigationTab = 'tour' | 'map' | 'gallery' | 'settings';
type ViewMode = 'map' | 'list';

const TourPage: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<NavigationTab>('tour');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [currentStopId, setCurrentStopId] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Get tour data
  const { tourStops, routePaths, isLoading, error } = useTourData();
  
  // Find current and next stop
  const currentStop = tourStops.find(stop => stop.id === currentStopId) || null;
  const currentStopIndex = tourStops.findIndex(stop => stop.id === currentStopId);
  const nextStop = currentStopIndex < tourStops.length - 1 
    ? tourStops[currentStopIndex + 1] 
    : null;
  
  // Handle selecting a stop
  const handleStopSelect = (stopId: number) => {
    setCurrentStopId(stopId);
    
    // If in list view, switch to map view when selecting a stop
    if (viewMode === 'list') {
      setViewMode('map');
    }
  };
  
  // Handle navigation to next stop
  const handleNextStop = () => {
    if (nextStop) {
      setCurrentStopId(nextStop.id);
    }
  };
  
  // Set first stop as default when data loads
  useEffect(() => {
    if (tourStops.length > 0 && !currentStopId) {
      setCurrentStopId(tourStops[0].id);
    }
  }, [tourStops]);
  
  // Handle tab changes
  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    
    // Update view mode based on tab
    if (tab === 'map') {
      setViewMode('map');
    } else if (tab === 'tour') {
      // Tour tab can show either view
    }
  };
  
  // Add/remove Leaflet script dynamically
  useEffect(() => {
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletScript.crossOrigin = '';
    document.body.appendChild(leafletScript);
    
    return () => {
      document.body.removeChild(leafletScript);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Header */}
      <Header 
        onMenuToggle={() => setMenuOpen(!menuOpen)} 
        onSearchToggle={() => setSearchOpen(!searchOpen)} 
      />
      
      {/* View toggle */}
      <ViewToggle 
        activeView={viewMode} 
        onViewChange={setViewMode} 
      />
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Map view */}
        <div className={viewMode === 'map' ? 'h-full' : 'hidden'}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-[#FF6B35] border-[#E5E5E5] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tour map...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center p-4">
              <div className="text-center text-red-500">
                <p>Error loading tour data. Please try again.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-[#FF6B35] text-white rounded-lg"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
              </div>
            </div>
          ) : (
            <MapView 
              tourStops={tourStops} 
              routePaths={routePaths}
              currentStopId={currentStopId}
              onStopSelect={handleStopSelect}
            />
          )}
        </div>
        
        {/* List view */}
        <div className={viewMode === 'list' ? 'h-full absolute inset-0' : 'hidden'}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-[#FF6B35] border-[#E5E5E5] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tour stops...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center p-4">
              <div className="text-center text-red-500">
                <p>Error loading tour data. Please try again.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-[#FF6B35] text-white rounded-lg"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
              </div>
            </div>
          ) : (
            <ListView 
              tourStops={tourStops}
              currentStopId={currentStopId}
              onStopSelect={handleStopSelect}
            />
          )}
        </div>
        
        {/* Stop details panel */}
        {!isLoading && !error && (
          <StopPanel 
            currentStop={currentStop}
            nextStop={nextStop}
            onNextStop={handleNextStop}
          />
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Menu overlay (would be implemented for a full app) */}
      {menuOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMenuOpen(false)}>
          <div className="bg-white h-full w-4/5 max-w-xs p-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading font-bold text-xl mb-4">Menu</h2>
            <ul className="space-y-4">
              <li className="font-medium">Tour Information</li>
              <li className="font-medium">Download Offline Content</li>
              <li className="font-medium">About Amsterdam</li>
              <li className="font-medium">Help & Support</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Search overlay (would be implemented for a full app) */}
      {searchOpen && (
        <div className="absolute inset-0 bg-white z-50 p-4" onClick={() => setSearchOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <input 
              type="text" 
              placeholder="Search stops or points of interest..." 
              className="w-full p-2 border border-gray-300 rounded-lg"
              autoFocus
            />
            <button 
              className="absolute right-2 top-2 text-gray-400"
              onClick={() => setSearchOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPage;

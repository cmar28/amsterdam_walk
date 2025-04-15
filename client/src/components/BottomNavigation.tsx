import React from 'react';
import { Home, Map, Image, Settings } from 'lucide-react';

type NavigationTab = 'tour' | 'map' | 'gallery' | 'settings';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-t border-[#E5E5E5] py-3 px-4 z-10 safe-bottom">
      <div className="flex justify-between max-w-md mx-auto">
        <button 
          onClick={() => onTabChange('tour')}
          className="flex flex-col items-center justify-center py-2 px-3 w-1/4 rounded-lg touch-manipulation active:bg-gray-50 transition-colors"
        >
          <Home className={`h-6 w-6 ${activeTab === 'tour' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className={`text-xs mt-1.5 font-medium ${activeTab === 'tour' ? 'text-[#FF6B35]' : 'text-gray-500'}`}>Tour</span>
        </button>
        
        <button 
          onClick={() => onTabChange('map')}
          className="flex flex-col items-center justify-center py-2 px-3 w-1/4 rounded-lg touch-manipulation active:bg-gray-50 transition-colors"
        >
          <Map className={`h-6 w-6 ${activeTab === 'map' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className={`text-xs mt-1.5 font-medium ${activeTab === 'map' ? 'text-[#FF6B35]' : 'text-gray-500'}`}>Map</span>
        </button>
        
        <button 
          onClick={() => onTabChange('gallery')}
          className="flex flex-col items-center justify-center py-2 px-3 w-1/4 rounded-lg touch-manipulation active:bg-gray-50 transition-colors"
        >
          <Image className={`h-6 w-6 ${activeTab === 'gallery' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className={`text-xs mt-1.5 font-medium ${activeTab === 'gallery' ? 'text-[#FF6B35]' : 'text-gray-500'}`}>Gallery</span>
        </button>
        
        <button 
          onClick={() => onTabChange('settings')}
          className="flex flex-col items-center justify-center py-2 px-3 w-1/4 rounded-lg touch-manipulation active:bg-gray-50 transition-colors"
        >
          <Settings className={`h-6 w-6 ${activeTab === 'settings' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className={`text-xs mt-1.5 font-medium ${activeTab === 'settings' ? 'text-[#FF6B35]' : 'text-gray-500'}`}>Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;

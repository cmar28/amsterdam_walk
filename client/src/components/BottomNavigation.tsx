import React from 'react';
import { Home, Map, Image, Settings } from 'lucide-react';

type NavigationTab = 'tour' | 'map' | 'gallery' | 'settings';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-t border-[#E5E5E5] py-2 px-6 z-10">
      <div className="flex justify-between">
        <button 
          onClick={() => onTabChange('tour')}
          className="flex flex-col items-center w-1/4"
        >
          <Home className={`h-6 w-6 ${activeTab === 'tour' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className="text-xs mt-1">Tour</span>
        </button>
        
        <button 
          onClick={() => onTabChange('map')}
          className="flex flex-col items-center w-1/4"
        >
          <Map className={`h-6 w-6 ${activeTab === 'map' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className="text-xs mt-1">Map</span>
        </button>
        
        <button 
          onClick={() => onTabChange('gallery')}
          className="flex flex-col items-center w-1/4"
        >
          <Image className={`h-6 w-6 ${activeTab === 'gallery' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className="text-xs mt-1">Gallery</span>
        </button>
        
        <button 
          onClick={() => onTabChange('settings')}
          className="flex flex-col items-center w-1/4"
        >
          <Settings className={`h-6 w-6 ${activeTab === 'settings' ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;

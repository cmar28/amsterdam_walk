import React from 'react';

type ViewToggleProps = {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
};

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="bg-white px-4 py-2 border-b border-gray-200">
      <div className="flex rounded-lg bg-[#E5E5E5] p-1 w-full max-w-xs mx-auto">
        <button 
          onClick={() => onViewChange('map')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeView === 'map' 
              ? 'bg-white shadow-sm text-[#004D7F]' 
              : 'text-gray-600'
          }`}
        >
          Map
        </button>
        <button 
          onClick={() => onViewChange('list')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeView === 'list' 
              ? 'bg-white shadow-sm text-[#004D7F]' 
              : 'text-gray-600'
          }`}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;

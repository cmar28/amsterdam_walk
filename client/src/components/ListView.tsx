import React from 'react';
import { TourStop } from '@shared/schema';
import { ChevronRight } from 'lucide-react';
import TourProgress from './TourProgress';

interface ListViewProps {
  tourStops: TourStop[];
  currentStopId: number;
  onStopSelect: (stopId: number, switchToMap?: boolean) => void;
}

const ListView: React.FC<ListViewProps> = ({ tourStops, currentStopId, onStopSelect }) => {
  const [showAllStops, setShowAllStops] = React.useState(false);
  
  // Calculate current progress
  const currentStopIndex = tourStops.findIndex(stop => stop.id === currentStopId);
  const currentProgress = tourStops.length > 0 
    ? Math.max(0, ((currentStopIndex + 1) / tourStops.length) * 100)
    : 0;
  
  // Display only first 3 stops if not showing all
  const displayedStops = showAllStops 
    ? tourStops 
    : tourStops.slice(0, 3);

  return (
    <div className="h-full w-full overflow-auto bg-[#F7F7F7]">
      {/* Tour Progress component */}
      <TourProgress 
        currentStop={currentStopIndex + 1}
        totalStops={tourStops.length}
        progressPercentage={currentProgress}
        totalDistance="3 km (1.8 miles)"
      />
      
      {/* Tour stops list */}
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow mx-4 mb-32">
        {displayedStops.map(stop => {
          const isCurrentStop = stop.id === currentStopId;
          
          return (
            <li 
              key={stop.id}
              className={`p-4 border-l-4 ${
                isCurrentStop ? 'border-[#FF6B35]' : 'border-gray-200'
              } ${isCurrentStop ? 'bg-orange-50' : ''} active:bg-gray-50 transition-colors`}
              onClick={() => onStopSelect(stop.id, false)}
            >
              <div className="flex justify-between">
                <div className="font-heading font-bold text-lg">{stop.title}</div>
                <div className={`rounded-full ${
                  isCurrentStop 
                    ? 'bg-[#FF6B35] text-white shadow-sm' 
                    : 'bg-gray-300 text-gray-700'
                } w-9 h-9 flex items-center justify-center flex-shrink-0`}>
                  <span className="font-bold">{stop.orderNumber}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mt-1">{stop.subtitle.split(' - ')[0]}</div>
              
              <div className="mt-2 flex justify-between items-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStopSelect(stop.id, false);
                  }}
                  className="text-[#004D7F] font-medium text-sm flex items-center touch-manipulation p-1 -m-1 rounded active:bg-blue-50"
                >
                  <span>View details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
                
                {isCurrentStop && (
                  <span className="inline-flex items-center text-xs text-[#FF6B35] font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B35] mr-1.5 animate-pulse"></span>
                    Current Stop
                  </span>
                )}
              </div>
            </li>
          );
        })}
        
        {/* Show/hide all stops button */}
        {!showAllStops && tourStops.length > 3 && (
          <li className="p-4 text-center">
            <button 
              onClick={() => setShowAllStops(true)}
              className="text-[#004D7F] font-medium flex items-center justify-center w-full py-2 px-4 rounded-lg touch-manipulation active:bg-blue-50 transition-colors"
            >
              <span>Show all {tourStops.length} stops</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Show less button when expanded */}
        {showAllStops && tourStops.length > 3 && (
          <li className="p-4 text-center">
            <button 
              onClick={() => setShowAllStops(false)}
              className="text-[#004D7F] font-medium flex items-center justify-center w-full py-2 px-4 rounded-lg touch-manipulation active:bg-blue-50 transition-colors"
            >
              <span>Show less</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ListView;

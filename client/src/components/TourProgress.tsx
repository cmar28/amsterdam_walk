import React from 'react';

interface TourProgressProps {
  currentStop: number;
  totalStops: number;
  progressPercentage: number;
  totalDistance: string;
}

const TourProgress: React.FC<TourProgressProps> = ({
  currentStop,
  totalStops,
  progressPercentage,
  totalDistance
}) => {
  return (
    <div className="bg-white px-4 py-5 shadow-sm mb-4 rounded-b-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-heading font-bold text-lg text-neutral-dark">Tour Progress</h2>
        <div className="text-[#FF6B35] font-medium px-2.5 py-1 bg-orange-50 rounded-lg text-sm">
          {currentStop} of {totalStops} stops
        </div>
      </div>
      
      <div className="w-full bg-[#E5E5E5] rounded-full h-2.5 mb-1">
        <div 
          className="bg-[#FF6B35] rounded-full h-2.5 transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
          role="progressbar" 
          aria-valuenow={progressPercentage} 
          aria-valuemin={0} 
          aria-valuemax={100}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="mt-2 text-sm text-gray-600">
          <span>Total distance: {totalDistance}</span>
        </div>
        <div className="text-sm font-medium">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
    </div>
  );
};

export default TourProgress;

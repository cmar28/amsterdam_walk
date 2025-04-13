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
    <div className="bg-white p-4 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-heading font-bold text-neutral-dark">Tour Progress</h2>
        <span className="text-sm text-[#FF6B35] font-medium">
          {currentStop} of {totalStops} stops
        </span>
      </div>
      
      <div className="w-full bg-[#E5E5E5] rounded-full h-2">
        <div 
          className="bg-[#FF6B35] rounded-full h-2" 
          style={{ width: `${progressPercentage}%` }}
          role="progressbar" 
          aria-valuenow={progressPercentage} 
          aria-valuemin={0} 
          aria-valuemax={100}
        ></div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        <span>Total distance: {totalDistance}</span>
      </div>
    </div>
  );
};

export default TourProgress;

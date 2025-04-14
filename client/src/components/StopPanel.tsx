import React, { useState, useRef, useEffect } from 'react';
import { TourStop } from '@shared/schema';
import { ChevronRight, Clock, TrendingUp, Image } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface StopPanelProps {
  currentStop: TourStop | null;
  nextStop: TourStop | null;
  onNextStop: () => void;
}

const StopPanel: React.FC<StopPanelProps> = ({ currentStop, nextStop, onNextStop }) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Check the current view mode by checking if any element with the class "map-container" exists
  // This is a way to determine if we're in map or list view without props
  const isInListView = () => {
    return document.querySelector('[class*="h-full absolute inset-0"]:not(.hidden)') !== null;
  };

  // Reset the expanded state and image index when the stop changes
  useEffect(() => {
    // If we're in list view, always expand the panel
    if (isInListView()) {
      setIsPanelExpanded(true);
      if (panelRef.current) {
        panelRef.current.style.transform = 'translateY(20%)';
      }
    } else {
      setIsPanelExpanded(false);
    }
    
    setCurrentImageIndex(0);
    setShowTranscript(false);
  }, [currentStop?.id]);

  // Handle touch or mouse events for dragging
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
  };

  const handleDrag = (e: TouchEvent | MouseEvent) => {
    if (!startY) return;
    
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const deltaY = clientY - startY;
    
    let newTranslate;
    if (isPanelExpanded) {
      // If panel is expanded, calculate from top position
      newTranslate = Math.max(0, Math.min(deltaY, window.innerHeight * 0.8));
    } else {
      // If panel is collapsed, calculate from bottom position
      newTranslate = Math.max(-window.innerHeight * 0.8, Math.min(deltaY, 0));
    }
    
    setCurrentTranslate(newTranslate);
    
    if (panelRef.current) {
      if (isPanelExpanded) {
        panelRef.current.style.transform = `translateY(${newTranslate}px)`;
      } else {
        panelRef.current.style.transform = `translateY(calc(100% - 130px + ${newTranslate}px))`;
      }
    }
  };

  const handleDragEnd = () => {
    setStartY(0);
    
    // Determine whether to expand or collapse based on the drag distance
    if (Math.abs(currentTranslate) > window.innerHeight * 0.2) {
      setIsPanelExpanded(!isPanelExpanded);
    }
    
    // Reset to the proper position
    if (panelRef.current) {
      if (isPanelExpanded) {
        if (currentTranslate > window.innerHeight * 0.2) {
          // Collapse
          panelRef.current.style.transform = 'translateY(calc(100% - 130px))';
          setIsPanelExpanded(false);
        } else {
          // Stay expanded
          panelRef.current.style.transform = 'translateY(20%)';
        }
      } else {
        if (currentTranslate < -window.innerHeight * 0.2) {
          // Expand
          panelRef.current.style.transform = 'translateY(20%)';
          setIsPanelExpanded(true);
        } else {
          // Stay collapsed
          panelRef.current.style.transform = 'translateY(calc(100% - 130px))';
        }
      }
    }
    
    setCurrentTranslate(0);
  };

  // Set up event listeners for mouse/touch events
  useEffect(() => {
    const handleDragListener = (e: TouchEvent | MouseEvent) => handleDrag(e);
    const handleDragEndListener = () => handleDragEnd();
    
    if (startY) {
      window.addEventListener('touchmove', handleDragListener);
      window.addEventListener('mousemove', handleDragListener);
      window.addEventListener('touchend', handleDragEndListener);
      window.addEventListener('mouseup', handleDragEndListener);
    }
    
    return () => {
      window.removeEventListener('touchmove', handleDragListener);
      window.removeEventListener('mousemove', handleDragListener);
      window.removeEventListener('touchend', handleDragEndListener);
      window.removeEventListener('mouseup', handleDragEndListener);
    };
  }, [startY, currentTranslate, isPanelExpanded]);

  // Set initial panel position
  useEffect(() => {
    if (panelRef.current) {
      // Check if we're in list view on initial render
      if (isInListView()) {
        setIsPanelExpanded(true);
        panelRef.current.style.transform = 'translateY(20%)';
      } else {
        panelRef.current.style.transform = 'translateY(calc(100% - 130px))';
      }
    }
  }, []);

  // Toggle panel expanded state when preview is clicked
  const handlePreviewClick = () => {
    setIsPanelExpanded(!isPanelExpanded);
    
    if (panelRef.current) {
      if (isPanelExpanded) {
        panelRef.current.style.transform = 'translateY(calc(100% - 130px))';
      } else {
        panelRef.current.style.transform = 'translateY(20%)';
      }
    }
  };

  // Handle image navigation
  const nextImage = () => {
    if (!currentStop?.images || currentStop.images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentStop.images.length);
  };

  if (!currentStop) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transition-transform transform"
      style={{ transitionDuration: startY ? '0s' : '0.3s' }}
    >
      {/* Drag handle */}
      <div 
        ref={dragHandleRef}
        className="w-full flex justify-center py-2"
        onTouchStart={handleDragStart}
        onMouseDown={handleDragStart}
      >
        <div className="w-10 h-1 rounded-full bg-[#E5E5E5]"></div>
      </div>

      {/* Preview/collapsed content */}
      <div 
        className="px-4 py-2" 
        onClick={handlePreviewClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-heading font-bold text-lg">{currentStop.title}</h2>
          <div className="rounded-full bg-[#FF6B35] text-white w-8 h-8 flex items-center justify-center">
            {currentStop.orderNumber}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="text-gray-600">
            {currentStop.subtitle.split(' - ')[0]}
          </div>
          <div className="text-[#FF6B35] font-medium">Now Playing</div>
        </div>
      </div>

      {/* Full content (revealed on drag up) */}
      <div className="px-4 pb-32 pt-4 overflow-y-auto max-h-[80vh]">
        {/* Image gallery */}
        {currentStop.images && currentStop.images.length > 0 && (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-[#E5E5E5] aspect-[4/3]">
            <img 
              src={currentStop.images[currentImageIndex]} 
              alt={`${currentStop.title} - image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                // Fallback for image loading errors
                console.error(`Failed to load image: ${currentStop.images[currentImageIndex]}`);
                e.currentTarget.src = `/api/images/${currentStop.title.toLowerCase().replace(/\s+/g, '')}.jpg`;
              }}
            />
            
            <div className="absolute bottom-3 right-3 flex space-x-2">
              {currentStop.images.length > 1 && (
                <button 
                  className="bg-white bg-opacity-80 rounded-full p-2"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <Image className="h-5 w-5" />
                </button>
              )}
              
              <div className="bg-black bg-opacity-70 text-white text-xs rounded-full px-2 py-1">
                {currentImageIndex + 1}/{currentStop.images.length}
              </div>
            </div>
          </div>
        )}

        {/* Audio player or transcript */}
        {!showTranscript ? (
          currentStop.audioUrl && (
            <AudioPlayer 
              audioUrl={currentStop.audioUrl} 
              title={currentStop.title}
              onToggleTranscript={() => setShowTranscript(true)}
            />
          )
        ) : (
          <div className="bg-[#F7F7F7] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-heading font-semibold">Audio Transcript</h3>
              <button 
                onClick={() => setShowTranscript(false)}
                className="text-[#004D7F] text-sm font-medium"
              >
                Back to Audio
              </button>
            </div>
            <div className="prose text-sm">
              {/* This would normally contain the transcript text */}
              <p>
                {currentStop.description}
              </p>
            </div>
          </div>
        )}

        {/* Stop content */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-lg mb-3">About {currentStop.title.split(' ')[0]}</h3>
          <div className="prose text-gray-800">
            <p>{currentStop.description}</p>
          </div>
        </div>

        {/* Pacing & Tips */}
        {(currentStop.duration || currentStop.walkingTip) && (
          <div className="mb-6">
            <h3 className="font-heading font-bold text-lg mb-3">Pacing & Tips</h3>
            <div className="bg-[#FFB563] bg-opacity-20 p-4 rounded-lg border border-[#FFB563]">
              {currentStop.duration && (
                <>
                  <div className="flex mb-2">
                    <Clock className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mr-2" />
                    <span className="font-semibold">{currentStop.duration}</span>
                  </div>
                  <p className="text-sm">
                    We'll spend about {currentStop.duration.toLowerCase()} here to enjoy the view.
                  </p>
                </>
              )}
              
              {currentStop.walkingTip && (
                <>
                  <div className="flex mt-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mr-2" />
                    <span className="font-semibold">Walking Tip</span>
                  </div>
                  <p className="text-sm">{currentStop.walkingTip}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* For Kids section */}
        {currentStop.kidsContent && (
          <div className="mb-6">
            <h3 className="font-heading font-bold text-lg mb-3">For Kids</h3>
            <div className="bg-[#004D7F] bg-opacity-10 p-4 rounded-lg border border-[#004D7F] border-opacity-20">
              <p className="text-sm">{currentStop.kidsContent}</p>
            </div>
          </div>
        )}

        {/* Next stop preview */}
        {nextStop && (
          <div className="border-t border-[#E5E5E5] pt-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">
                  Next stop ({nextStop.nextStopWalkingTime} walk)
                </div>
                <div className="font-heading font-semibold">{nextStop.title}</div>
              </div>
              <button 
                onClick={onNextStop}
                className="flex items-center justify-center bg-[#004D7F] text-white rounded-full w-10 h-10" 
                aria-label="Navigate to next stop"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StopPanel;

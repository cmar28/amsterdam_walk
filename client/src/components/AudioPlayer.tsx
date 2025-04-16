import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, File, AlertTriangle } from 'lucide-react';
import { Howl } from 'howler';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onToggleTranscript: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, onToggleTranscript }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [howl, setHowl] = useState<Howl | null>(null);
  const [howlId, setHowlId] = useState<number | undefined>(undefined);
  const [audioError, setAudioError] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Howl with the audio URL
    if (audioUrl) {
      setAudioError(null);
      
      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        preload: true,
        onload: () => {
          setDuration(sound.duration());
          setAudioError(null);
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          setAudioError('Failed to load audio. Try downloading for offline use.');
          toast({
            title: "Audio load error",
            description: "Try downloading content for offline use in Settings.",
            variant: "destructive",
          });
        },
        onplayerror: (id, error) => {
          console.error('Audio play error:', error);
          setIsPlaying(false);
          setAudioError('Error playing audio. Check your network connection.');
          toast({
            title: "Audio playback error",
            description: "Try downloading content for offline use in Settings.",
            variant: "destructive",
          });
        },
        onplay: () => {
          setIsPlaying(true);
          // Start updating currentTime at regular intervals
          progressIntervalRef.current = window.setInterval(() => {
            setCurrentTime(sound.seek());
          }, 100);
        },
        onpause: () => {
          setIsPlaying(false);
          // Clear the interval when paused
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        },
        onstop: () => {
          setIsPlaying(false);
          setCurrentTime(0);
          // Clear the interval when stopped
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        },
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
          // Clear the interval when ended
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
      });
      
      setHowl(sound);
      
      // Cleanup on unmount or when audioUrl changes
      return () => {
        if (sound) {
          sound.stop();
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      };
    }
  }, [audioUrl, toast]);

  const togglePlayPause = () => {
    if (!howl) return;
    
    if (isPlaying) {
      howl.pause();
    } else {
      const id = howl.play();
      setHowlId(id);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!howl || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * duration;
    
    howl.seek(seekTime);
    setCurrentTime(seekTime);
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#F7F7F7] rounded-xl p-4 mb-6 shadow-sm">
      {audioError ? (
        <div className="flex flex-col items-center text-center p-2">
          <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
          <div className="text-sm text-orange-700 font-medium mb-1">{audioError}</div>
          <p className="text-xs text-gray-600 mb-3">
            The audio file might not be available offline. Try downloading content in Settings.
          </p>
          <button 
            onClick={onToggleTranscript}
            className="text-[#004D7F] bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
          >
            <File className="h-4 w-4 mr-1.5" />
            Read Transcript Instead
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <button 
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-md touch-manipulation"
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={!howl}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-0.5" />
                )}
              </button>
              <div className="ml-3">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
            <button 
              onClick={onToggleTranscript}
              className="text-[#004D7F] font-medium text-sm flex items-center p-2 touch-manipulation rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              <File className="h-5 w-5 mr-1" />
              Transcript
            </button>
          </div>
          
          {/* Progress bar - with larger touch area */}
          <div className="pt-2 pb-4 px-1 -mx-1 touch-manipulation">
            <div 
              className="relative w-full h-2 bg-[#E5E5E5] rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute left-0 top-0 h-full bg-[#FF6B35] rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div 
                className="absolute top-0 transform -translate-y-1/4 w-4 h-4 bg-[#FF6B35] rounded-full shadow-md"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;

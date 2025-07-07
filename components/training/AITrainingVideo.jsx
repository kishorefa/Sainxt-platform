"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react';
import { TrainingVideo } from './TrainingVideo';

// Function to generate a consistent color based on the title
const stringToColor = (str) => {
  // Return a default color if str is undefined or empty
  if (!str) return 'hsl(210, 70%, 50%)';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export const AITrainingVideo = forwardRef(({ videoSrc, title, onVideoComplete, autoplay = false, className = '' }, ref) => {
  const videoRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    scrollIntoView: (options) => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView(options);
      }
    }
  }));

  // Handle autoplay when component mounts or videoSrc changes
  useEffect(() => {
    if (autoplay && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.error('Autoplay was prevented:', err);
          // Autoplay was prevented, show play button
        }
      };
      
      playVideo();
    }
  }, [videoSrc, autoplay]);

  const handleVideoEnded = () => {
    if (onVideoComplete) {
      onVideoComplete();
    }
  };

  const handlePlay = () => {
    setShowThumbnail(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate a consistent color based on the video title
  const bgColor = stringToColor(title);

  return (
    <div className={`relative ${className}`}>
      {/* Thumbnail Placeholder */}
      {showThumbnail && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ backgroundColor: bgColor }}
        >
          <div className="text-center p-4">
            <div className="text-4xl mb-2">
              {title ? 
                title.split(' ').map(word => word[0]).join('').toUpperCase() :
                'AI'
              }
            </div>
            <p className="text-sm opacity-80">{title || 'AI Training Video'}</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <TrainingVideo
        ref={videoRef}
        videoSrc={videoSrc}
        onVideoComplete={handleVideoEnded}
        className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
        controls
        controlsList="nodownload" 
        onPlay={handlePlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
        onTimeUpdate={(e) => {
          // Mark as watched when reaching 90% of the video
          const video = e.target;
          if (video.currentTime > video.duration * 0.9) {
            handleVideoEnded();
          }
        }}
        preload="metadata"
        poster=""
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </TrainingVideo>

      {/* Loading State */}
      {isLoading && !showThumbnail && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 p-4">
          <div className="text-center">
            <p className="font-medium">⚠️ Failed to load video</p>
            <p className="text-sm text-gray-600 mt-1">Please check your connection and try again</p>
          </div>
        </div>
      )}
      
      {/* Custom controls overlay if needed */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
    </div>
  );
});

AITrainingVideo.displayName = 'AITrainingVideo';

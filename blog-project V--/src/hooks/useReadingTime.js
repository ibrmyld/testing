import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';

const useReadingTime = (postId, contentRef) => {
  const { trackReadingTime, trackScrollDepth } = useAnalytics();
  const [readingTime, setReadingTime] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const startTimeRef = useRef(null);
  const lastScrollDepthRef = useRef(0);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!postId || !contentRef?.current) return;

    startTimeRef.current = Date.now();
    
    // Track when user becomes active/inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false;
      } else {
        isActiveRef.current = true;
        startTimeRef.current = Date.now(); // Reset start time when user returns
      }
    };

    // Track scroll depth
    const handleScroll = () => {
      if (!contentRef.current || !isActiveRef.current) return;

      const element = contentRef.current;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = element.scrollHeight - window.innerHeight;
      const percentage = Math.round((scrollTop / scrollHeight) * 100);
      
      setScrollPercentage(Math.min(percentage, 100));

      // Track scroll depth milestones (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      const currentMilestone = milestones.find(
        milestone => percentage >= milestone && lastScrollDepthRef.current < milestone
      );

      if (currentMilestone) {
        trackScrollDepth(postId, currentMilestone);
        lastScrollDepthRef.current = currentMilestone;
      }
    };

    // Update reading time every second
    const updateReadingTime = () => {
      if (isActiveRef.current && startTimeRef.current) {
        setReadingTime(prev => prev + 1);
      }
    };

    // Set up intervals and event listeners
    const readingInterval = setInterval(updateReadingTime, 1000);
    const scrollThrottle = throttle(handleScroll, 100);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', scrollThrottle);

    // Cleanup function
    return () => {
      clearInterval(readingInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', scrollThrottle);

      // Track final reading time when component unmounts
      if (readingTime > 0) {
        trackReadingTime(postId, readingTime);
      }
    };
  }, [postId, contentRef, trackReadingTime, trackScrollDepth]);

  // Track reading time when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (readingTime > 0) {
        trackReadingTime(postId, readingTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [postId, readingTime, trackReadingTime]);

  return {
    readingTime,
    scrollPercentage,
    formattedReadingTime: formatTime(readingTime)
  };
};

// Utility function to throttle scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Format time in MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default useReadingTime;
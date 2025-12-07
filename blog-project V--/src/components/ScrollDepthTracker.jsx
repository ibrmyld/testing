import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import useReadingTime from '../hooks/useReadingTime';

const ScrollDepthTracker = ({ postId, contentRef, showProgress = true }) => {
  const { scrollPercentage, formattedReadingTime } = useReadingTime(postId, contentRef);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show tracker after user starts scrolling
    const timer = setTimeout(() => {
      if (scrollPercentage > 5) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [scrollPercentage]);

  if (!showProgress || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]">
        {/* Reading Progress */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reading Progress
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.min(scrollPercentage, 100)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(scrollPercentage, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Reading Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formattedReadingTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>Reading</span>
          </div>
        </div>

        {/* Completion Message */}
        {scrollPercentage >= 95 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <p className="text-xs font-medium text-green-700 dark:text-green-300 text-center">
              🎉 Article completed!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ScrollDepthTracker;
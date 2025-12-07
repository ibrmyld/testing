import React from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <AnalyticsDashboard />
    </motion.div>
  );
};

export default Analytics;
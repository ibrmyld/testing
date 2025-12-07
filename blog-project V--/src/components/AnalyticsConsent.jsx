import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Shield, Settings } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

const AnalyticsConsent = () => {
  const { enableAnalytics, disableAnalytics } = useAnalytics();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('analytics_consent');
    if (hasConsent === null) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    enableAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    disableAnalytics();
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowBanner(false)}
          />

          {/* Consent Banner */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Help us improve your experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      We use Google Analytics to understand how you interact with our blog and to improve our content. 
                      This helps us create better articles and enhance your reading experience.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Performance Analytics</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Track page views and popular content</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Privacy Protected</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">IP addresses are anonymized</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Settings className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Full Control</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Change preferences anytime</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleAccept}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Accept Analytics
                      </button>
                      <button
                        onClick={handleDecline}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Decline
                      </button>
                      <button
                        onClick={handleCustomize}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm underline"
                      >
                        Customize Settings
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Detailed Settings Modal */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-60 flex items-center justify-center p-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Analytics Settings
                      </h2>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          What data do we collect?
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Page Views</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Which pages you visit and how long you spend reading
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">User Interactions</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Clicks, shares, comments, and search queries
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Device Information</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Browser type, device type, and screen resolution
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Traffic Sources</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                How you found our blog (search engines, social media, etc.)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Privacy Protection
                        </h3>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                                Your privacy is protected
                              </p>
                              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li>• IP addresses are automatically anonymized</li>
                                <li>• No personal information is collected</li>
                                <li>• Data is used only for improving our content</li>
                                <li>• You can opt out at any time</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            handleAccept();
                            setShowDetails(false);
                          }}
                          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Accept All Analytics
                        </button>
                        <button
                          onClick={() => {
                            handleDecline();
                            setShowDetails(false);
                          }}
                          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                          Decline All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsConsent;
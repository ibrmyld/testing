import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const BackendStatus = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/');
        if (response.ok) {
          setIsBackendAvailable(true);
        } else {
          setIsBackendAvailable(false);
          setShowNotification(true);
        }
      } catch (error) {
        setIsBackendAvailable(false);
        setShowNotification(true);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // 30 saniyede bir kontrol

    return () => clearInterval(interval);
  }, []);

  if (!showNotification || isBackendAvailable) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Backend Offline
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              API sunucusu çalışmıyor. Yerel veriler kullanılıyor.
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-yellow-400 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus; 
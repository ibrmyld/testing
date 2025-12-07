import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initGA, 
  trackPageView, 
  blogAnalytics, 
  privacyAnalytics,
  dashboardAnalytics 
} from '../utils/analytics';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    pageViews: 0,
    topPages: [],
    topReferrers: []
  });

  // Initialize analytics on mount
  useEffect(() => {
    const hasConsent = privacyAnalytics.hasAnalyticsConsent();
    if (hasConsent) {
      initGA();
      setAnalyticsEnabled(true);
    }
  }, []);

  // Track page views on route changes
  const trackPage = (path, title) => {
    if (analyticsEnabled) {
      trackPageView(path, title);
    }
  };

  // Enable analytics with user consent
  const enableAnalytics = () => {
    privacyAnalytics.setAnalyticsConsent(true);
    setAnalyticsEnabled(true);
    initGA();
  };

  // Disable analytics
  const disableAnalytics = () => {
    privacyAnalytics.setAnalyticsConsent(false);
    setAnalyticsEnabled(false);
  };

  // Blog-specific tracking methods
  const trackBlogPost = (postId, postTitle, category) => {
    if (analyticsEnabled) {
      blogAnalytics.trackBlogView(postId, postTitle, category);
    }
  };

  const trackSearch = (searchTerm, resultsCount) => {
    if (analyticsEnabled) {
      blogAnalytics.trackSearch(searchTerm, resultsCount);
    }
  };

  const trackShare = (postId, platform) => {
    if (analyticsEnabled) {
      blogAnalytics.trackShare(postId, platform);
    }
  };

  const trackCategoryFilter = (category) => {
    if (analyticsEnabled) {
      blogAnalytics.trackCategoryFilter(category);
    }
  };

  const trackNewsletterSignup = (source) => {
    if (analyticsEnabled) {
      blogAnalytics.trackNewsletterSignup(source);
    }
  };

  const trackComment = (postId, action) => {
    if (analyticsEnabled) {
      blogAnalytics.trackComment(postId, action);
    }
  };

  const trackEngagement = (action, element, value) => {
    if (analyticsEnabled) {
      blogAnalytics.trackEngagement(action, element, value);
    }
  };

  const trackScrollDepth = (postId, percentage) => {
    if (analyticsEnabled) {
      blogAnalytics.trackScrollDepth(postId, percentage);
    }
  };

  const trackExternalLink = (url, context) => {
    if (analyticsEnabled) {
      blogAnalytics.trackExternalLink(url, context);
    }
  };

  const trackReadingTime = (postId, timeSpent) => {
    if (analyticsEnabled) {
      blogAnalytics.trackReadingTime(postId, timeSpent);
    }
  };

  // Get dashboard data
  const getDashboardData = async () => {
    if (analyticsEnabled) {
      try {
        const data = await dashboardAnalytics.getRealTimeMetrics();
        setRealTimeData(data);
        return data;
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        return null;
      }
    }
    return null;
  };

  const value = {
    // State
    analyticsEnabled,
    realTimeData,
    
    // Control methods
    enableAnalytics,
    disableAnalytics,
    
    // Tracking methods
    trackPage,
    trackBlogPost,
    trackSearch,
    trackShare,
    trackCategoryFilter,
    trackNewsletterSignup,
    trackComment,
    trackEngagement,
    trackScrollDepth,
    trackExternalLink,
    trackReadingTime,
    
    // Dashboard methods
    getDashboardData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContext;
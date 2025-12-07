// Google Analytics 4 (GA4) Integration
// This utility provides comprehensive analytics tracking for the blog platform

// GA4 Measurement ID - Replace with your actual GA4 Measurement ID
export const GA_MEASUREMENT_ID = 'G-KKWC2R4GPY'; // Replace with your actual GA4 ID

// Initialize Google Analytics
export const initGA = () => {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  console.log('Google Analytics initialized');
};

// Track page views
export const trackPageView = (path, title) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Blog-specific tracking events
export const blogAnalytics = {
  // Track blog post views
  trackBlogView: (postId, postTitle, category) => {
    trackEvent('view_blog_post', 'Blog', `${postTitle} (${postId})`, 1);
    trackEvent('view_content', 'Blog', category, 1);
  },

  // Track blog post reading time
  trackReadingTime: (postId, timeSpent) => {
    trackEvent('reading_time', 'Blog', postId, timeSpent);
  },

  // Track blog post shares
  trackShare: (postId, platform) => {
    trackEvent('share', 'Social', `${postId}_${platform}`, 1);
  },

  // Track search usage
  trackSearch: (searchTerm, resultsCount) => {
    trackEvent('search', 'Blog', searchTerm, resultsCount);
  },

  // Track category filtering
  trackCategoryFilter: (category) => {
    trackEvent('filter_category', 'Blog', category, 1);
  },

  // Track newsletter subscription
  trackNewsletterSignup: (source) => {
    trackEvent('newsletter_signup', 'Engagement', source, 1);
  },

  // Track comment interactions
  trackComment: (postId, action) => {
    trackEvent(action, 'Comments', postId, 1);
  },

  // Track user engagement
  trackEngagement: (action, element, value = 1) => {
    trackEvent(action, 'Engagement', element, value);
  },

  // Track scroll depth
  trackScrollDepth: (postId, percentage) => {
    trackEvent('scroll_depth', 'Blog', postId, percentage);
  },

  // Track external link clicks
  trackExternalLink: (url, context) => {
    trackEvent('click_external_link', 'Navigation', `${context}_${url}`, 1);
  },

  // Track download events
  trackDownload: (fileName, fileType) => {
    trackEvent('download', 'Files', `${fileType}_${fileName}`, 1);
  },

  // Track form submissions
  trackFormSubmission: (formName, success) => {
    trackEvent('form_submit', 'Forms', formName, success ? 1 : 0);
  },

  // Track user journey
  trackUserJourney: (fromPage, toPage) => {
    trackEvent('page_navigation', 'Journey', `${fromPage}_to_${toPage}`, 1);
  },

  // Track performance metrics
  trackPerformance: (metric, value) => {
    trackEvent('performance', 'Technical', metric, value);
  },

  // Track error events
  trackError: (errorType, errorMessage) => {
    trackEvent('error', 'Technical', `${errorType}_${errorMessage}`, 1);
  }
};

// Enhanced ecommerce tracking (for future monetization)
export const ecommerceAnalytics = {
  // Track product views (for future products/courses)
  trackProductView: (productId, productName, category, price) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: price,
        items: [{
          item_id: productId,
          item_name: productName,
          item_category: category,
          price: price,
          quantity: 1
        }]
      });
    }
  },

  // Track purchases
  trackPurchase: (transactionId, items, value) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'USD',
        items: items
      });
    }
  }
};

// User demographics and interests (with privacy compliance)
export const userAnalytics = {
  // Track user preferences
  trackUserPreference: (preferenceType, preferenceValue) => {
    trackEvent('user_preference', 'Profile', `${preferenceType}_${preferenceValue}`, 1);
  },

  // Track user session duration
  trackSessionDuration: (duration) => {
    trackEvent('session_duration', 'Engagement', 'session_time', duration);
  },

  // Track returning vs new users (handled automatically by GA4)
  trackUserType: (userType) => {
    trackEvent('user_type', 'Profile', userType, 1);
  }
};

// Privacy-compliant analytics
export const privacyAnalytics = {
  // Check if user has consented to analytics
  hasAnalyticsConsent: () => {
    return localStorage.getItem('analytics_consent') === 'true';
  },

  // Set analytics consent
  setAnalyticsConsent: (consent) => {
    localStorage.setItem('analytics_consent', consent.toString());
    if (consent) {
      initGA();
    }
  },

  // Anonymize IP (enabled by default in GA4)
  enableAnonymization: () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true
      });
    }
  }
};

// Real-time analytics dashboard data
export const dashboardAnalytics = {
  // Get real-time metrics (would typically come from GA4 Reporting API)
  getRealTimeMetrics: async () => {
    // This would integrate with GA4 Reporting API
    // For now, return mock data structure
    return {
      activeUsers: 0,
      pageViews: 0,
      topPages: [],
      topReferrers: [],
      deviceTypes: {},
      locations: {}
    };
  },

  // Get popular content
  getPopularContent: async (timeRange = '7d') => {
    // This would integrate with GA4 Reporting API
    // timeRange parameter will be used when API is implemented
    console.log(`Fetching popular content for ${timeRange}`);
    return {
      topPosts: [],
      topCategories: [],
      engagementMetrics: {}
    };
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  blogAnalytics,
  ecommerceAnalytics,
  userAnalytics,
  privacyAnalytics,
  dashboardAnalytics
};
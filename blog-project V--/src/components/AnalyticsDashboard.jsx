import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor,
  RefreshCw,
  Clock,
  Share2,
  MessageCircle,
  Search
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

const AnalyticsDashboard = () => {
  const { analyticsEnabled, getDashboardData } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalViews: 12543,
      uniqueVisitors: 8921,
      avgSessionDuration: '3:42',
      bounceRate: '32%'
    },
    topPosts: [
      { id: 1, title: 'Getting Started with React Hooks', views: 2341, engagement: '85%' },
      { id: 2, title: 'Advanced JavaScript Patterns', views: 1987, engagement: '78%' },
      { id: 3, title: 'CSS Grid vs Flexbox', views: 1654, engagement: '82%' },
      { id: 4, title: 'Building Modern APIs', views: 1432, engagement: '76%' },
      { id: 5, title: 'State Management in React', views: 1298, engagement: '88%' }
    ],
    topCategories: [
      { name: 'React', views: 4521, percentage: 35 },
      { name: 'JavaScript', views: 3876, percentage: 30 },
      { name: 'CSS', views: 2234, percentage: 17 },
      { name: 'Node.js', views: 1543, percentage: 12 },
      { name: 'Other', views: 769, percentage: 6 }
    ],
    deviceTypes: {
      desktop: 65,
      mobile: 28,
      tablet: 7
    },
    topReferrers: [
      { source: 'Google', visits: 5432, percentage: 42 },
      { source: 'Direct', visits: 3210, percentage: 25 },
      { source: 'Twitter', visits: 1876, percentage: 14 },
      { source: 'LinkedIn', visits: 1234, percentage: 10 },
      { source: 'Other', visits: 1191, percentage: 9 }
    ],
    recentActivity: [
      { type: 'view', content: 'React Hooks Guide', time: '2 minutes ago' },
      { type: 'share', content: 'JavaScript Patterns', time: '5 minutes ago' },
      { type: 'comment', content: 'CSS Grid Tutorial', time: '8 minutes ago' },
      { type: 'search', content: 'react state management', time: '12 minutes ago' }
    ]
  });

  useEffect(() => {
    if (analyticsEnabled) {
      refreshData();
    }
  }, [analyticsEnabled, timeRange]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      if (data) {
        setDashboardData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, action }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );

  if (!analyticsEnabled) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Not Enabled
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enable analytics to view detailed insights about your blog performance.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Enable Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your blog's performance and user engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Eye}
          title="Total Views"
          value={dashboardData.overview.totalViews.toLocaleString()}
          change="+12.5%"
          color="blue"
        />
        <StatCard
          icon={Users}
          title="Unique Visitors"
          value={dashboardData.overview.uniqueVisitors.toLocaleString()}
          change="+8.3%"
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Avg. Session Duration"
          value={dashboardData.overview.avgSessionDuration}
          change="+5.2%"
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          title="Bounce Rate"
          value={dashboardData.overview.bounceRate}
          change="-2.1%"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Posts */}
        <ChartCard title="Top Performing Posts">
          <div className="space-y-4">
            {dashboardData.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {post.engagement}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Categories */}
        <ChartCard title="Popular Categories">
          <div className="space-y-4">
            {dashboardData.topCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.views.toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Types */}
        <ChartCard title="Device Types">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {dashboardData.deviceTypes.desktop}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {dashboardData.deviceTypes.mobile}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Tablet</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {dashboardData.deviceTypes.tablet}%
              </span>
            </div>
          </div>
        </ChartCard>

        {/* Top Referrers */}
        <ChartCard title="Traffic Sources">
          <div className="space-y-3">
            {dashboardData.topReferrers.map((referrer) => (
              <div key={referrer.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {referrer.source}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {referrer.visits.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {referrer.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Recent Activity">
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'view' && <Eye className="w-4 h-4 text-blue-500" />}
                  {activity.type === 'share' && <Share2 className="w-4 h-4 text-green-500" />}
                  {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-purple-500" />}
                  {activity.type === 'search' && <Search className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
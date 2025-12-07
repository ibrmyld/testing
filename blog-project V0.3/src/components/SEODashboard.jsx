import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, AlertCircle, CheckCircle, Info, Download } from 'lucide-react';
import { calculateSEOScore, generateSitemap, generateRobotsTxt } from '../utils/seoUtils';
import { blogPosts } from '../data/blogData';

const SEODashboard = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [overallStats, setOverallStats] = useState({});

  useEffect(() => {
    // Calculate overall SEO stats
    const stats = {
      totalPosts: blogPosts.length,
      avgScore: 0,
      goodPosts: 0,
      needsImprovement: 0
    };

    let totalScore = 0;
    blogPosts.forEach(post => {
      const score = calculateSEOScore({
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        content: post.content,
        image: post.image,
        hasInternalLinks: true,
        readTime: post.readTime
      });
      
      totalScore += score.score;
      if (score.score >= 70) {
        stats.goodPosts++;
      } else {
        stats.needsImprovement++;
      }
    });

    stats.avgScore = Math.round(totalScore / blogPosts.length);
    setOverallStats(stats);
  }, []);

  const analyzePage = (post) => {
    setSelectedPost(post);
    const analysis = calculateSEOScore({
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      content: post.content,
      image: post.image,
      hasInternalLinks: true,
      readTime: post.readTime
    });
    setSeoAnalysis(analysis);
  };

  const downloadSitemap = () => {
    const sitemap = generateSitemap();
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadRobots = () => {
    const robots = generateRobotsTxt();
    const blob = new Blob([robots], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            SEO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and optimize your website's SEO performance
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {overallStats.totalPosts}
                </p>
              </div>
              <Search className="text-primary-500" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg SEO Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(overallStats.avgScore)}`}>
                  {overallStats.avgScore}%
                </p>
              </div>
              <TrendingUp className="text-primary-500" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Good Posts</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {overallStats.goodPosts}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Needs Work</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {overallStats.needsImprovement}
                </p>
              </div>
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Blog Posts Analysis
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {blogPosts.map((post, index) => {
                  const score = calculateSEOScore({
                    title: post.title,
                    description: post.excerpt,
                    keywords: post.tags,
                    content: post.content,
                    image: post.image,
                    hasInternalLinks: true,
                    readTime: post.readTime
                  });

                  return (
                    <div
                      key={post.id}
                      onClick={() => analyzePage(post)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {post.category} • {post.readTime}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(score.score)} ${getScoreColor(score.score)}`}>
                        {score.score}% ({score.grade})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* SEO Tools */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                SEO Tools
              </h2>
              <div className="space-y-3">
                <button
                  onClick={downloadSitemap}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Download size={16} />
                  <span>Download Sitemap</span>
                </button>
                <button
                  onClick={downloadRobots}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Download size={16} />
                  <span>Download Robots.txt</span>
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                SEO Tips
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span className="text-gray-600 dark:text-gray-400">
                    Keep titles between 30-60 characters
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span className="text-gray-600 dark:text-gray-400">
                    Meta descriptions should be 120-160 characters
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span className="text-gray-600 dark:text-gray-400">
                    Use relevant keywords naturally
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span className="text-gray-600 dark:text-gray-400">
                    Include internal and external links
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Analysis */}
        {selectedPost && seoAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                SEO Analysis: {selectedPost.title}
              </h2>
              <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(seoAnalysis.score)} ${getScoreColor(seoAnalysis.score)}`}>
                {seoAnalysis.score}% (Grade {seoAnalysis.grade})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  SEO Checks
                </h3>
                <div className="space-y-2">
                  {seoAnalysis.checks.map((check, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      {check.type === 'success' && <CheckCircle className="text-green-500 mt-0.5" size={16} />}
                      {check.type === 'warning' && <AlertCircle className="text-yellow-500 mt-0.5" size={16} />}
                      {check.type === 'error' && <AlertCircle className="text-red-500 mt-0.5" size={16} />}
                      {check.type === 'info' && <Info className="text-blue-500 mt-0.5" size={16} />}
                      <span className={`text-sm ${
                        check.type === 'success' ? 'text-green-700 dark:text-green-300' :
                        check.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                        check.type === 'error' ? 'text-red-700 dark:text-red-300' :
                        'text-blue-700 dark:text-blue-300'
                      }`}>
                        {check.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Post Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Title Length: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedPost.title.length} characters</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Description Length: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedPost.excerpt.length} characters</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Keywords: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedPost.tags.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Category: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedPost.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Reading Time: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SEODashboard;
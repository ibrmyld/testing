import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import CategoryFilter from '../components/CategoryFilter';
import Newsletter from '../components/Newsletter';
import SEOHead from '../components/SEOHead';
import { useAnalytics } from '../context/AnalyticsContext';
import { blogPosts, categories } from '../data/blogData';

const Blog = () => {
  const { trackSearch, trackCategoryFilter } = useAnalytics();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  // Track search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        trackSearch(searchTerm, filteredPosts.length);
      }, 500); // Debounce search tracking

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, filteredPosts.length, trackSearch]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      trackCategoryFilter(category);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <SEOHead
        title="Blog"
        description="Teknoloji, web geliştirme, yapay zeka ve siber güvenlik hakkında güncel blog yazıları. Uzman görüşleri ve derinlemesine analizler."
        keywords={['blog yazıları', 'teknoloji blog', 'web geliştirme', 'yapay zeka', 'siber güvenlik', 'programlama', 'yazılım']}
        type="website"
        url="/blog"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Teknoloji dünyasından en güncel haberler, derinlemesine analizler ve uzman görüşleri
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredPosts.length} makale bulundu
                {selectedCategory !== 'All' && ` "${selectedCategory}" kategorisinde`}
                {searchTerm && ` "${searchTerm}" araması için`}
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sonuç bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Arama kriterlerinizi değiştirmeyi deneyin
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="btn-primary"
                >
                  Filtreleri Temizle
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />

              {/* Popular Posts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {blogPosts
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((post) => (
                      <div key={post.id} className="card p-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {post.views} views
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Newsletter */}
              <Newsletter variant="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
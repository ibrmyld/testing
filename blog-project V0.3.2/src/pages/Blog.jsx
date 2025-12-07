import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import CategoryFilter from '../components/CategoryFilter';
import Newsletter from '../components/Newsletter';
import SEOHead from '../components/SEOHead';
import ApiService from '../services/api';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          ApiService.getPosts(),
          ApiService.getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

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
  }, [posts, selectedCategory, searchTerm]);

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
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Insights, tutorials, and thoughts on modern technology, AI, and development
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                onCategoryChange={setSelectedCategory}
              />

              {/* Popular Posts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {posts
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((post) => (
                      <div key={post.id} className="card p-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>{post.views} views</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Results Info */}
            {!loading && !error && (
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredPosts.length === 0 ? (
                    'No articles found'
                  ) : (
                    `Showing ${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''}`
                  )}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Blog Posts Grid */}
            {!loading && !error && (
              filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your search terms or category filter
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter variant="inline" />
        </div>
      </section>
    </div>
  );
};

export default Blog;
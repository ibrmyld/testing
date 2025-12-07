import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState(['AI', 'React', 'JavaScript', 'Cybersecurity', '3D']);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    if (term.trim()) {
      // Add to recent searches
      const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      setSearchTerm(term);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-start justify-center p-4 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-dark-700">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles, tags, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg"
              />
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Content */}
            <div className="max-h-96 overflow-y-auto">
              {searchTerm.trim() ? (
                // Search Results
                <div className="p-4">
                  {searchResults.length > 0 ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Results ({searchResults.length})
                      </h3>
                      <div className="space-y-3">
                        {searchResults.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            onClick={onClose}
                            className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                  {highlightText(post.title, searchTerm)}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {highlightText(post.excerpt, searchTerm)}
                                </p>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                                    {post.category}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {post.readTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="mx-auto text-gray-400 mb-3" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Try searching with different keywords
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Default State
                <div className="p-4 space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                          <Clock size={16} className="mr-2" />
                          Recent Searches
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center">
                      <TrendingUp size={16} className="mr-2" />
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Search Tips
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Search by title, content, or tags</li>
                      <li>• Use specific keywords for better results</li>
                      <li>• Try category names like "AI" or "Security"</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
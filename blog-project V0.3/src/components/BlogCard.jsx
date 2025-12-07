import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogCard = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              By {post.author}
            </span>
            <Link
              to={`/blog/${post.slug}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm transition-colors duration-200"
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
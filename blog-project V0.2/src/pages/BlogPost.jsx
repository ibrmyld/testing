import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import CommentSection from '../components/CommentSection';
import SocialShare from '../components/SocialShare';
import { blogPosts } from '../data/blogData';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments || []);
    }
  }, [slug]);

  const handleAddComment = (newComment) => {
    const comment = {
      id: comments.length + 1,
      ...newComment
    };
    setComments([...comments, comment]);
  };



  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          {/* Featured Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Article Meta */}
          <div className="p-8 border-b border-gray-200 dark:border-dark-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{post.views} views</span>
                </div>
              </div>

              {/* Share Buttons */}
              <SocialShare 
                url={window.location.href}
                title={post.title}
                description={post.excerpt}
              />
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Author
                </p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
                      {paragraph.substring(2)}
                    </h1>
                  );
                } else if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      {paragraph.substring(3)}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                      {paragraph.substring(4)}
                    </h3>
                  );
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="text-gray-700 dark:text-gray-300 mb-1">
                      {paragraph.substring(2)}
                    </li>
                  );
                } else if (paragraph.startsWith('```')) {
                  return (
                    <pre key={index} className="bg-gray-100 dark:bg-dark-800 p-4 rounded-lg overflow-x-auto my-4">
                      <code className="text-sm">{paragraph.replace(/```\w*\n?/, '').replace(/```$/, '')}</code>
                    </pre>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <CommentSection comments={comments} onAddComment={handleAddComment} />
      </div>
    </div>
  );
};

export default BlogPost;
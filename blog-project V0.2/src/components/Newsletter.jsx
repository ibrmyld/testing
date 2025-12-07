import React, { useState } from 'react';
import { Mail, Send, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Newsletter = ({ variant = 'default', className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo purposes
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      
      setStatus('success');
      setMessage('Welcome to our newsletter! 🎉');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white ${className}`}>
        <div className="flex items-center mb-4">
          <Mail className="mr-3" size={24} />
          <div>
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-primary-100 text-sm">Get the latest articles delivered to your inbox</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={status === 'loading'}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </form>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-3 text-sm flex items-center ${
                status === 'success' ? 'text-green-100' : 'text-red-100'
              }`}
            >
              {status === 'success' ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`card p-8 text-center ${className}`}>
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-primary-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Never Miss an Update
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Subscribe to our newsletter and get the latest articles, tutorials, and insights delivered straight to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 input-field"
            disabled={status === 'loading'}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span>Subscribe</span>
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm flex items-center justify-center ${
                status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {status === 'success' ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        <p>
          By subscribing, you agree to our{' '}
          <a href="#" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
            Privacy Policy
          </a>{' '}
          and consent to receive updates from our blog.
        </p>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <span>Weekly Updates</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <span>No Spam</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
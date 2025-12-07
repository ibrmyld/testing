import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Instagram, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialShare = ({ url, title, description, onShare, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: url || window.location.href,
    title: title || document.title,
    description: description || "Check out this amazing article!"
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'hover:bg-blue-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}&hashtags=BlogX,Tech,AI`
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: 'hover:bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      color: 'hover:bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.description)}`
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      color: 'hover:bg-pink-500',
      action: () => {
        // Instagram doesn't support direct URL sharing, so we copy the link
        handleCopyLink();
        alert('Link copied! You can now share it on Instagram Stories or posts.');
      }
    }
  ];

  const handleShare = (platform) => {    // Call the onShare callback if provided
    if (onShare) {
      onShare(platform.name.toLowerCase());
    }
        if (platform.action) {
      platform.action();
    } else {
      window.open(platform.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
      >
        <Share2 size={18} />
        <span>Share</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 p-4 z-50 min-w-[280px]"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Share this article
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {socialPlatforms.map((platform) => (
                <motion.button
                  key={platform.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare(platform)}
                  className={`flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:text-white transition-all duration-200 ${platform.color}`}
                >
                  {platform.icon}
                  <span className="text-sm font-medium">{platform.name}</span>
                </motion.button>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-dark-700 pt-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-sm text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-sm">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SocialShare;
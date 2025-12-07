import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const CommentSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && authorName.trim()) {
      onAddComment({
        author: authorName,
        content: newComment,
        publishedAt: new Date().toISOString().split('T')[0]
      });
      setNewComment('');
      setAuthorName('');
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="text-primary-500" size={24} />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card p-6 mb-8"
      >
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Leave a Comment
        </h4>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="input-field resize-none"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary flex items-center space-x-2"
        >
          <Send size={16} />
          <span>Post Comment</span>
        </button>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                      {comment.author}
                    </h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
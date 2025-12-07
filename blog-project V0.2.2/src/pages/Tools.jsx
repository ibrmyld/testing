import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Shield, Search, Code } from 'lucide-react';

const Tools = () => {
  const tools = [
    {
      id: 1,
      name: "File Scanner",
      description: "Free virus scanner and file analyzer",
      icon: <Shield className="w-8 h-8" />,
      type: "Security",
      status: "Available",
      link: "#"
    },
    {
      id: 2,
      name: "Code Formatter",
      description: "Format and beautify your code",
      icon: <Code className="w-8 h-8" />,
      type: "Development",
      status: "Available",
      link: "#"
    },
    {
      id: 3,
      name: "Search Tool",
      description: "Advanced search and indexing utility",
      icon: <Search className="w-8 h-8" />,
      type: "Utility",
      status: "Coming Soon",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            Free Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Useful tools and utilities for developers and security professionals
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-primary-500 mb-4">
                {tool.icon}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {tool.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tool.status === 'Available' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tool.type}
                </span>
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    tool.status === 'Available'
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-300 dark:bg-dark-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={tool.status !== 'Available'}
                >
                  {tool.status === 'Available' ? (
                    <>
                      <ExternalLink size={16} />
                      <span>Use Tool</span>
                    </>
                  ) : (
                    <span>Coming Soon</span>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
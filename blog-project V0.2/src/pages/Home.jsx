import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import HeroSection from '../components/HeroSection';
import { blogPosts } from '../data/blogData';

const Home = () => {
  const featuredPosts = blogPosts.slice(0, 3);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Web Development",
      description: "Modern frameworks, best practices, and cutting-edge techniques"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI & Machine Learning",
      description: "Exploring the future of artificial intelligence and automation"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cybersecurity",
      description: "Security best practices and threat analysis"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description: "Optimization techniques for faster, better applications"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What I Focus On
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Exploring the intersection of technology, creativity, and innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on modern technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/blog" className="btn-primary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join me on this journey of innovation and discovery. Let's create the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Get in Touch
              </Link>
              <Link to="/products" className="btn-secondary">
                Explore Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </div>
  );
};

export default Home;
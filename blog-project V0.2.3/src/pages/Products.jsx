import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Products = () => {
  const products = [
    {
      id: 1,
      name: "React Template Pack",
      description: "Modern React templates with Tailwind CSS",
      price: "$29",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      rating: 4.8,
      downloads: 1250,
      type: "Template"
    },
    {
      id: 2,
      name: "3D Model Collection",
      description: "High-quality 3D models for games and apps",
      price: "$49",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
      rating: 4.9,
      downloads: 890,
      type: "3D Model"
    },
    {
      id: 3,
      name: "Security Scripts",
      description: "Cybersecurity automation scripts",
      price: "$39",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
      rating: 4.7,
      downloads: 654,
      type: "Script"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <SEOHead
        title="Ürünler"
        description="Geliştiriciler için premium React şablonları, 3D modeller ve scriptler. Modern tasarım ve yüksek kalite garantisi."
        keywords={['React şablonları', 'premium ürünler', '3D modeller', 'web şablonları', 'geliştirici ürünleri', 'Tailwind CSS']}
        type="website"
        url="/products"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Premium templates, 3D models, and scripts for developers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-lg font-bold">
                    {product.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.downloads} downloads)
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 btn-primary flex items-center justify-center space-x-2">
                    <ExternalLink size={16} />
                    <span>Buy Now</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            More products coming soon! Follow for updates.
          </p>
          <button className="btn-secondary">
            View on Gumroad
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
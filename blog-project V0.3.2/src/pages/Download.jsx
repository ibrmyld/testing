import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const DownloadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  const { product, txHash } = location.state || {};

  useEffect(() => {
    if (!product || !txHash) {
      navigate('/products');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product, txHash, navigate]);

  const startDownload = () => {
    // Simulated download - in real app this would be actual file download
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual download URL
    link.download = `${product.name.replace(/\s+/g, '_')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!product || !txHash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Geçersiz Erişim
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bu sayfaya erişim yetkiniz bulunmuyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <SEOHead
        title="İndirme Sayfası"
        description="Satın alınan ürünlerin indirme sayfası"
        robots="noindex,nofollow"
      />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ödeme Başarılı!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {product.name} için ödemeniz onaylandı. İndirilme otomatik olarak başlayacak.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ürün
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {product.name}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ödenen Miktar
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {product.price} ETH
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Transaction Hash
              </span>
              <span className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
                {txHash}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Download size={24} className="text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                İndirme {countdown > 0 ? `${countdown} saniye` : 'başlıyor...'}
              </span>
            </div>
            
            {countdown > 0 && (
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={startDownload}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Download size={18} />
              <span>Şimdi İndir</span>
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary w-full"
            >
              Ürünlere Geri Dön
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Sorun yaşıyorsanız, lütfen bizimle iletişime geçin.
              Transaction hash'i saklayın - destek talepleri için gerekli olacaktır.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadPage; 
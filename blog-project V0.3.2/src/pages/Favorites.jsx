import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';

const Favorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        setError(''); // Hata temizle
      } else {
        const errorText = await response.text();
        console.error('Favoriler yükleme hatası:', response.status, errorText);
        setError(`Favoriler yüklenirken hata oluştu. (${response.status})`);
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error);
      setError('Bağlantı hatası. Backend server çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-8">
            <Heart className="mx-auto mb-4 text-gray-400" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Favori Yazılarınız
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Favori yazılarınızı görüntülemek için giriş yapmanız gerekiyor.
            </p>
            <Link
              to="/blog"
              className="btn-primary inline-flex items-center"
            >
              <BookOpen className="mr-2" size={20} />
              Blog'a Gözat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Favoriler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Heart className="mr-3 text-red-500" size={40} fill="currentColor" />
            Favori Yazılarım
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Beğendiğiniz ve daha sonra okumak istediğiniz yazılar
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Blog'a Geri Dön
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-8 max-w-md mx-auto">
              <Heart className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Henüz favori yazınız yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Blog yazılarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
              </p>
              <Link
                to="/blog"
                className="btn-primary inline-flex items-center"
              >
                <BookOpen className="mr-2" size={20} />
                Yazılara Göz At
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Toplam {favorites.length} favori yazı
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    En son eklenen favorileriniz
                  </p>
                </div>
                <Heart className="text-red-500" size={32} fill="currentColor" />
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites; 
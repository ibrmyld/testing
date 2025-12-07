import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ postId, size = 20, className = "" }) => {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Favori durumunu kontrol et
  useEffect(() => {
    if (isAuthenticated && postId) {
      console.log('Checking favorite status for post:', postId);
      checkFavoriteStatus();
    }
  }, [isAuthenticated, postId]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token bulunamadı');
        return;
      }

      console.log('Making request to check favorite status...');
      const response = await fetch(`http://localhost:8000/api/favorites/check/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Favorite status response:', data);
        setIsFavorite(data.is_favorite);
      } else {
        const errorText = await response.text();
        console.error('Favori kontrol hatası:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('⚠️ Favorilere eklemek için giriş yapın!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('⚠️ Giriş yapmanız gerekiyor!');
      return;
    }

    setIsLoading(true);
    console.log('Toggling favorite for post:', postId);

    try {
      const response = await fetch('http://localhost:8000/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ post_id: postId })
      });

      console.log('Toggle response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Toggle response data:', data);
        setIsFavorite(data.is_favorite);
        
        // Kısa bir toast mesajı göster
        const message = data.is_favorite ? '❤️ Favorilere eklendi!' : '💔 Favorilerden çıkarıldı!';
        showToast(message);
      } else {
        const errorText = await response.text();
        console.error('Favori toggle hatası:', response.status, errorText);
        showToast('❌ Favori işlemi başarısız!');
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
      showToast('❌ Bağlantı hatası!');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    // Basit toast mesajı
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  if (!isAuthenticated) {
    return null; // Giriş yapmamış kullanıcılara gösterme
  }

  console.log('Rendering FavoriteButton - postId:', postId, 'isFavorite:', isFavorite, 'isAuthenticated:', isAuthenticated);

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
        isFavorite 
          ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${className}`}
      title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart 
        size={size} 
        fill={isFavorite ? 'currentColor' : 'none'}
        className={`transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default FavoriteButton; 
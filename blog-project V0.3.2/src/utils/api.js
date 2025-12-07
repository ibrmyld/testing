const API_BASE_URL = 'http://localhost:8000';

// API isteği için yardımcı fonksiyon
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Token varsa Authorization header'ını ekle
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Token süresi dolmuşsa logout yap
    if (response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return response;
  } catch (error) {
    console.error('API isteği hatası:', error);
    throw error;
  }
};

// Kullanıcı bilgilerini getir
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest('/api/auth/me');
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Kullanıcı bilgileri alınırken hata:', error);
    return null;
  }
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock data kullanıyoruz
      
      // Demo hesap kontrolü
      if (email === 'demo@blogx.com' && password === 'demo123') {
        const mockUser = {
          id: 1,
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          phone: '+90 555 123 45 67',
          avatar: null,
          joinDate: new Date().toISOString()
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      
      // Geçersiz giriş
      return { success: false, error: 'E-posta veya şifre hatalı.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock data kullanıyoruz
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        avatar: null,
        joinDate: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kyc_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('kyc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('kyc_token');
      if (storedToken) {
        try {
          // In a real app, we might verify the token or fetch user profile
          // For now, we'll decode or assume valid if stored
          const userData = JSON.parse(localStorage.getItem('kyc_user') || '{}');
          setUser(userData);
          setRole(userData.role || 'Customer');
          setIsAuthenticated(true);
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/token/', { username, password });
      const { access, role: userRole, user: userInfo } = res.data;
      
      let detectedRole = userRole;
      if (!detectedRole) {
        if (username === 'admin' || username === 'ops_user') detectedRole = 'Operations Manager';
        else if (username === 'cxo_user') detectedRole = 'CXO';
        else if (username === 'compliance_user') detectedRole = 'Compliance Officer';
        else if (username === 'field_agent') detectedRole = 'Field Agent';
        else detectedRole = 'Customer';
      }
      
      localStorage.setItem('kyc_token', access);
      localStorage.setItem('kyc_user', JSON.stringify({ ...userInfo, role: detectedRole }));
      
      setToken(access);
      setUser(userInfo);
      setRole(detectedRole);
      setIsAuthenticated(true);

      return detectedRole;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('kyc_token');
    localStorage.removeItem('kyc_user');
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

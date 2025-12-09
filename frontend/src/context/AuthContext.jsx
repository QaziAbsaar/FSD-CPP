// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Setup axios default with credentials to send cookies
  axios.defaults.withCredentials = true;

  // Check if user is already logged in on app startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        console.log('User authenticated:', response.data);
        setUser(response.data);
      } catch (err) {
        console.log('User not authenticated or session expired');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (username, email, password, role = 'student') => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        role,
      });
      // Auto-login on register
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      console.log('Attempting login for user:', username);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      console.log('Login successful:', response.data.user);
      setUser(response.data.user);
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      console.error('Login error:', errorMsg);
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      console.log('User data refreshed:', response.data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.warn('Failed to refresh user data:', err);
      if (err.response?.status === 401) {
        setUser(null);
      }
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

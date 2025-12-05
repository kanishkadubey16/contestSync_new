import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) {
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        email: email.trim(), 
        password 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Login successful:', user);
      return user;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/api/auth/register`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        email: email.trim(), 
        password, 
        username: username.trim() 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Registration successful:', user);
      return user;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('User logged out');
  };

  const value = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
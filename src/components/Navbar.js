import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="navbar-gradient shadow-xl">
      <div className="max-w-7xl px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white transition-colors">
              ContestSync
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-white transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {user ? (
              <>
                <span className="text-white font-medium">Hello, {user.name}</span>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-warning text-sm">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="btn btn-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

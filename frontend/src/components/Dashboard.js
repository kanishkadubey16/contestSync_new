import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestCard from './ContestCard';
import ContestHistory from './ContestHistory';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [filters, setFilters] = useState({ platform: '', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('contests');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'history') {
      setActiveTab('history');
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [filters, currentPage]);

  const fetchContests = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filters.platform && { platform: filters.platform }),
        ...(filters.search && { search: filters.search })
      });
      
      const response = await axios.get(`${API_BASE_URL}/api/contests?${params}`);
      setContests(response.data.contests);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            🏆 Contest Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discover and track competitive programming contests</p>
        </div>
        
        <div className="flex justify-center space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('contests')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'contests' 
              ? 'btn btn-primary shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}
          >
            🏆 Contests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'history' 
              ? 'btn btn-primary shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}
          >
            📈 History
          </button>
        </div>

        {activeTab === 'contests' && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Platforms</option>
                <option value="Codeforces">Codeforces</option>
                <option value="LeetCode">LeetCode</option>
                <option value="AtCoder">AtCoder</option>
                <option value="HackerRank">HackerRank</option>
              </select>
              
              <input
                type="text"
                name="search"
                placeholder="Search contests..."
                value={filters.search}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contests.map(contest => (
                <ContestCard key={contest.id} contest={contest} onUpdate={fetchContests} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${page === currentPage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && <ContestHistory />}
      </div>
    </div>
  );
};

export default Dashboard;
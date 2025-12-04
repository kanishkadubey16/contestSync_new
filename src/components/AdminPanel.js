import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [overview, setOverview] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [contests, setContests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    startTime: '',
    duration: '',
    url: ''
  });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reminders') fetchReminders();
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'leaderboard') fetchLeaderboard();
    if (activeTab === 'contests') fetchContests();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/reminders`);
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/overview`);
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchContests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contests?limit=100`);
      setContests(response.data.contests);
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  const handleAddContest = async (e) => {
    e.preventDefault();
    try {
      if (editingContest) {
        await axios.put(`${API_BASE_URL}/api/contests/${editingContest.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/contests`, formData);
      }
      setFormData({ name: '', platform: '', startTime: '', duration: '', url: '' });
      setShowAddForm(false);
      setEditingContest(null);
      fetchContests();
    } catch (error) {
      console.error('Error saving contest:', error);
    }
  };

  const handleEditContest = (contest) => {
    setFormData({
      name: contest.name,
      platform: contest.platform,
      startTime: new Date(contest.startTime).toISOString().slice(0, 16),
      duration: contest.duration.toString(),
      url: contest.url
    });
    setEditingContest(contest);
    setShowAddForm(true);
  };

  const handleDeleteContest = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/contests/${contestId}`);
        fetchContests();
      } catch (error) {
        console.error('Error deleting contest:', error);
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>
      
      <div className="flex space-x-4 mb-6">
        {['overview', 'contests', 'users', 'reminders', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded capitalize ${activeTab === tab 
              ? 'btn btn-primary' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{overview.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Reminders</h3>
            <p className="text-3xl font-bold text-green-600">{overview.totalReminders}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Questions</h3>
            <p className="text-3xl font-bold text-purple-600">{overview.totalQuestions}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {overview.lastSync ? new Date(overview.lastSync).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'contests' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contest Management</h2>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingContest(null);
                setFormData({ name: '', platform: '', startTime: '', duration: '', url: '' });
              }}
              className="btn btn-primary"
            >
              ➕ Add Contest
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {editingContest ? 'Edit Contest' : 'Add New Contest'}
              </h3>
              <form onSubmit={handleAddContest} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Contest Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="AtCoder">AtCoder</option>
                  <option value="HackerRank">HackerRank</option>
                </select>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="Contest URL"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="col-span-2"
                  required
                />
                <div className="col-span-2 flex space-x-2">
                  <button type="submit" className="btn btn-success">
                    {editingContest ? 'Update' : 'Add'} Contest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingContest(null);
                    }}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th>Contest Name</th>
                  <th>Platform</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map(contest => (
                  <tr key={contest.id}>
                    <td className="text-gray-900 dark:text-white">{contest.name}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        contest.platform === 'Codeforces' ? 'badge-codeforces' :
                        contest.platform === 'LeetCode' ? 'badge-leetcode' :
                        contest.platform === 'AtCoder' ? 'badge-atcoder' :
                        'badge-hackerrank'
                      }`}>
                        {contest.platform}
                      </span>
                    </td>
                    <td className="text-gray-900 dark:text-white">
                      {new Date(contest.startTime).toLocaleString()}
                    </td>
                    <td className="text-gray-900 dark:text-white">{contest.duration} min</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditContest(contest)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteContest(contest.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {leaderboard.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user._count.history}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user._count.reminders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
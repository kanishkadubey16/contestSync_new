import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    startTime: '',
    duration: '',
    url: ''
  });

  useEffect(() => {
    fetchOverview();
    fetchUsers();
    fetchLeaderboard();
    if (activeTab === 'contests') {
      fetchContests();
    }
  }, [activeTab]);

  const fetchOverview = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/overview`);
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      const response = await axios.get(`${API_BASE_URL}/api/admin/contests`);
      setContests(response.data);
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContest) {
        await axios.put(`${API_BASE_URL}/api/admin/contests/${editingContest.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/contests`, formData);
      }
      setFormData({ name: '', platform: '', startTime: '', duration: '', url: '' });
      setShowForm(false);
      setEditingContest(null);
      fetchContests();
    } catch (error) {
      console.error('Error saving contest:', error);
    }
  };

  const handleEdit = (contest) => {
    setFormData({
      name: contest.name,
      platform: contest.platform,
      startTime: new Date(contest.startTime).toISOString().slice(0, 16),
      duration: contest.duration.toString(),
      url: contest.url || ''
    });
    setEditingContest(contest);
    setShowForm(true);
  };

  const handleDelete = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/contests/${contestId}`);
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
        fetchOverview();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('contests')}
          className={`px-4 py-2 rounded ${activeTab === 'contests' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Contests
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded ${activeTab === 'leaderboard' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{overview.users || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Contests</h3>
            <p className="text-3xl font-bold text-green-600">{overview.contests || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Reminders</h3>
            <p className="text-3xl font-bold text-yellow-600">{overview.reminders || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Participations</h3>
            <p className="text-3xl font-bold text-purple-600">{overview.participations || 0}</p>
          </div>
        </div>
      )}

      {activeTab === 'contests' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contest Management</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingContest(null);
                setFormData({ name: '', platform: '', startTime: '', duration: '', url: '' });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Contest
            </button>
          </div>

          {showForm && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {editingContest ? 'Edit Contest' : 'Add New Contest'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Contest Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="AtCoder">AtCoder</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="CodeChef">CodeChef</option>
                </select>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <input
                  type="url"
                  placeholder="Contest URL"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="col-span-2 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="col-span-2 flex space-x-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    {editingContest ? 'Update' : 'Add'} Contest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingContest(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {contests.map(contest => (
                  <tr key={contest.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contest.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contest.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(contest.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contest.duration} min</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(contest)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contest.id)}
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
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reminders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user._count.contestHistory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user._count.reminders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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

      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {leaderboard.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user._count.contestHistory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user._count.reminders}</td>
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
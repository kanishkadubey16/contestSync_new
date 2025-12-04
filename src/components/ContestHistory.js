import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ContestHistory = () => {
  const [history, setHistory] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contestName: '',
    platform: '',
    date: '',
    questions: ''
  });

  useEffect(() => {
    fetchHistory();
    fetchTotalQuestions();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchTotalQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/history/questions`);
      setTotalQuestions(response.data.totalQuestions);
    } catch (error) {
      console.error('Error fetching total questions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/user/history/add`, formData);
      setFormData({ contestName: '', platform: '', date: '', questions: '' });
      setShowForm(false);
      fetchHistory();
      fetchTotalQuestions();
    } catch (error) {
      console.error('Error adding history:', error);
    }
  };

  const chartData = {
    labels: history.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Questions Solved',
        data: history.map(h => h.questions),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Contest Performance Over Time' },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contest History</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total Questions Solved: <span className="font-semibold">{totalQuestions}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Contest
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Contest Name"
              value={formData.contestName}
              onChange={(e) => setFormData({ ...formData, contestName: e.target.value })}
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
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Questions Solved"
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <div className="col-span-2 flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Questions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {history.map((contest, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contest.contestName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contest.platform}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(contest.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contest.questions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestHistory;
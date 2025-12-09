import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

const ContestCard = ({ contest, onUpdate }) => {
  const [hasReminder, setHasReminder] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const contestTime = new Date(contest.startTime).getTime();
      const difference = contestTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Started");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.startTime]);

  const toggleReminder = async () => {
    if (hasReminder) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/contests/${contest.id}/reminder`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHasReminder(false);
        alert('Reminder removed!');
        onUpdate();
      } catch (error) {
        console.error("Error toggling reminder:", error);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    } else {
      setShowEmailModal(true);
    }
  };

  const handleSendReminder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to set reminders!');
        setShowEmailModal(false);
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/api/contests/${contest.id}/reminder`, 
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasReminder(true);
      setShowEmailModal(false);
      setEmail("");
      alert(response.data.message || 'Reminder set and email sent!');
      onUpdate();
    } catch (error) {
      console.error("Error setting reminder:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Please login first to set reminders!');
      } else {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
    {showEmailModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📧 Set Reminder</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Enter your email to receive a reminder for this contest</p>
          <form onSubmit={handleSendReminder}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Send Reminder
              </button>
              <button
                type="button"
                onClick={() => { setShowEmailModal(false); setEmail(""); }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{contest.name}</h3>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {contest.platform}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Start:</span>
          <span className="ml-1 text-gray-600 dark:text-gray-400">{formatDate(contest.startTime)}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Duration:</span>
          <span className="ml-1 text-gray-600 dark:text-gray-400">{contest.duration} min</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-2">⏰</span>
          <span className={`text-lg font-bold ${
            timeLeft === "Started" 
              ? "text-green-600 dark:text-green-400" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {contest.url && (
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow transition-all duration-200 flex items-center"
          >
            🚀 Join
          </a>
        )}
        <button
          onClick={toggleReminder}
          className={`px-6 py-3 rounded-lg font-semibold text-sm shadow transition-all duration-200 flex items-center ${
            hasReminder
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
          }`}
        >
          {hasReminder ? "❌ Remove" : "🔔 Remind Me"}
        </button>
      </div>
    </div>
    </>
  );
};

export default ContestCard;
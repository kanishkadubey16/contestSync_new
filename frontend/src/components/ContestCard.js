import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestCard = ({ contest, onUpdate }) => {
  const [hasReminder, setHasReminder] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

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
        setTimeLeft('Started');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.startTime]);

  const toggleReminder = async () => {
    try {
      if (hasReminder) {
        await axios.delete(`http://localhost:5001/api/contests/${contest.id}/reminder`);
        setHasReminder(false);
      } else {
        await axios.post(`http://localhost:5001/api/contests/${contest.id}/reminder`);
        setHasReminder(true);
      }
      onUpdate();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="contest-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {contest.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          contest.platform === 'Codeforces' ? 'badge-codeforces' :
          contest.platform === 'LeetCode' ? 'badge-leetcode' :
          contest.platform === 'AtCoder' ? 'badge-atcoder' :
          'badge-hackerrank'
        }`}>
          {contest.platform}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">Start:</span> {formatDate(contest.startTime)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">Duration:</span> {contest.duration} minutes
        </p>
        <div className="time-highlight">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">⏰ Time Left:</span> 
            <span className="text-red-600 font-bold ml-1 text-lg">{timeLeft}</span>
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-2">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success text-sm"
        >
          🚀 Join
        </a>
        
        <button
          onClick={toggleReminder}
          className={`btn text-sm ${hasReminder ? 'btn-danger' : 'btn-warning'}`}
        >
          {hasReminder ? '❌ Remove' : '🔔 Remind'}
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
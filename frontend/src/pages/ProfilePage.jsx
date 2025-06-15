import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function ProfilePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    games_played: 0,
    best_score: 0,
    lessons_completed: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/user/stats/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post('http://localhost:8000/api/logout/', {
        refresh: refreshToken,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex m-0 p-0">
      <aside className="w-64 bg-[#f9f7e5] p-6 flex flex-col space-y-4 border-r">
        <button
          onClick={() => navigate('/profile/edit')} // example route for edit page
          className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-medium py-2 px-4 rounded-lg shadow-sm"
        >
          Edit
        </button>
        <button
          onClick={handleLogout}
          className="text-red-600 bg-white border border-red-300 hover:bg-red-50 transition-colors duration-200 font-medium py-2 px-4 rounded-lg shadow-sm"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-[#f9f7e5]">
        <h1 className="text-2xl font-semibold mb-8">Your Profile</h1>

        <div className="flex justify-center space-x-10">
          {/* Circle 1 */}
          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#6B4226] text-white shadow-lg">
            <span className="text-4xl font-bold">{stats.games_played}</span>
            <span className="mt-1 text-sm font-semibold">Games Played</span>
          </div>

          {/* Circle 2 */}
          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#A67C00] text-white shadow-lg">
            <span className="text-4xl font-bold">{stats.best_score}</span>
            <span className="mt-1 text-sm font-semibold">Best Score</span>
          </div>

          {/* Circle 3 */}
          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#CC7A00] text-white shadow-lg">
            <span className="text-4xl font-bold">{stats.lessons_completed}</span>
            <span className="mt-1 text-sm font-semibold">Lessons Completed</span>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function ProfilePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    games_played: 0,
    best_score: 0,
    lessons_completed: 0,
    level: 0,
  });

  const [userLevel, setUserLevel] = useState(0);
  const maxLevel = 10;

  useEffect(() => {
    async function fetchStats() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/user/stats/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        setStats(response.data);
        if (response.data.level !== undefined) {
          setUserLevel(Math.floor(response.data.level / 100));
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(
        'http://localhost:8000/api/logout/',
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex m-0 p-0">
      <aside className="w-64 bg-[#f9f7e5] p-6 flex flex-col space-y-4 border-r">
        <button
          onClick={() => navigate('/profile/edit')}
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

      <main className="flex-1 p-8 bg-[#f9f7e5] flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Your Profile</h1>

        <div className="flex justify-center space-x-14 mb-12">
          <div
            className="flex flex-col items-center justify-center w-36 h-36 rounded-full text-center gap-y-1"
            style={{
              border: '5px solid #6B4226',
              backgroundColor: 'transparent',
              color: '#6B4226',
            }}
          >
            <span className="text-5xl font-bold leading-none">{stats.games_played}</span>
            <span className="text-lg font-semibold leading-tight">Games Played</span>
          </div>

          <div
            className="flex flex-col items-center justify-center w-36 h-36 rounded-full text-center gap-y-1"
            style={{
              border: '5px solid #A67C00',
              backgroundColor: 'transparent',
              color: '#A67C00',
            }}
          >
            <span className="text-5xl font-bold leading-none">{stats.best_score}</span>
            <span className="text-lg font-semibold leading-tight">Best Score</span>
          </div>

          <div
            className="flex flex-col items-center justify-center w-36 h-36 rounded-full text-center gap-y-1"
            style={{
              border: '5px solid #CC7A00',
              backgroundColor: 'transparent',
              color: '#CC7A00',
            }}
          >
            <span className="text-5xl font-bold leading-none">{stats.lessons_completed}</span>
            <span className="text-lg font-semibold leading-tight">Lessons Completed</span>
          </div>
        </div>

        <div className="flex items-center space-x-10 w-full max-w-4xl">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 140,
              height: 140,
              border: '7px solid #4a90e2',
              color: '#4a90e2',
              fontSize: 48,
              fontWeight: '700',
              backgroundColor: 'transparent',
            }}
          >
            {userLevel}
          </div>

          <div className="flex flex-col flex-grow">
            <div
              className="flex rounded-lg overflow-hidden border border-gray-300"
              style={{ height: 36 }}
            >
              {[...Array(maxLevel)].map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    borderRight: idx < maxLevel - 1 ? '1px solid #ccc' : 'none',
                    backgroundColor: idx < userLevel ? '#4a90e2' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-700 font-semibold">
              {[...Array(maxLevel)].map((_, idx) => (
                <span key={idx} className="flex-1 text-center">
                  Reward {idx + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

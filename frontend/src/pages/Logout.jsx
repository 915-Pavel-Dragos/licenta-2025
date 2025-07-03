import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7e5] text-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#6B4226] mb-4">You’ve been logged out</h1>
        <p className="text-gray-600 mb-6">
          Your session has ended. Click below to sign in again.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6B4226] hover:bg-[#5a3922] text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

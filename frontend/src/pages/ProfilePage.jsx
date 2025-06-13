import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export function ProfilePage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await axios.post('http://localhost:8000/api/logout/', {
                refresh: refreshToken,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
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
            <button className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-medium py-2 px-4 rounded-lg shadow-sm">
                Edit
            </button>
            <button onClick={handleLogout} className="text-red-600 bg-white border border-red-300 hover:bg-red-50 transition-colors duration-200 font-medium py-2 px-4 rounded-lg shadow-sm">
                Logout
            </button>
        </aside>
            <main className="flex-1 p-8 bg-[#f9f7e5]">
                <h1 className="text-2xl font-semibold">Your Profile</h1>
                <p className="mt-2 text-gray-700">Welcome to your profile page.</p>
            </main>
        </div>
    );
}

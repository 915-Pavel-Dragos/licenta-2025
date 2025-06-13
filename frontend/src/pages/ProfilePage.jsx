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
            <aside className="w-64 bg-gray-100 p-6 flex flex-col space-y-4 border-r">
                <button className="text-left font-medium text-gray-700 hover:bg-gray-200 p-2 rounded">
                    Edit
                </button>
                <button
                    onClick={handleLogout}
                    className="text-left font-medium text-red-600 hover:bg-red-100 p-2 rounded"
                >
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

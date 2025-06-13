import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export function Header({ toggleSidebar }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                const res = await axios.get('http://localhost:8000/api/user/', config);
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    return (
        <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white z-50 relative">
            <button onClick={toggleSidebar} className="p-2 rounded hover:bg-black/5 transition">
                <Menu size={24} />
            </button>

            <div className="flex items-center space-x-2">
                {user && <span className="font-medium">{user.username}</span>}
                <button onClick={() => navigate('/profile')} className="p-2 rounded hover:bg-black/5 transition">
                    <User size={24} />
                </button>
            </div>
        </header>
    );
}

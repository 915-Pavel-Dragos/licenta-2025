import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get('http://localhost:8000/api/user/', config);
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          password1: '',
          password2: ''
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to load user data.');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password1 !== formData.password2) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const updateData = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password1) {
        updateData.password = formData.password1;
      }

      await axios.put('http://localhost:8000/api/user/', updateData, config);

      navigate('/profile');
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7e5] p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <label className="block mb-2 font-medium">Username:</label>
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2 font-medium">Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2 font-medium">New Password (leave blank to keep current):</label>
        <input 
          type="password" 
          name="password1" 
          value={formData.password1} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-4" 
        />

        <label className="block mb-2 font-medium">Confirm New Password:</label>
        <input 
          type="password" 
          name="password2" 
          value={formData.password2} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-6" 
        />

        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={() => navigate('/profile')} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="bg-[#6B4226] hover:bg-[#5a3922] text-white font-semibold py-2 px-4 rounded"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

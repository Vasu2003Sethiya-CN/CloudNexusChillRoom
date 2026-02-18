import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAdminToken } from '../../services/auth';

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    setAdminToken(apiKey);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-secondary p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 text-center">CloudNexus</h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6">Admin Login</p>
        
        <div className="mb-4">
          <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Admin API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 text-sm sm:text-base"
            placeholder="Enter admin key"
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base mb-4">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 sm:py-3 rounded font-medium hover:bg-secondary transition min-h-[44px] text-sm sm:text-base active:scale-95 sm:active:scale-100"
        >
          Login
        </button>
      </form>
    </div>
  );
}
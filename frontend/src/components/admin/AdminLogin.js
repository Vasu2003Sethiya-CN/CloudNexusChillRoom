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
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Admin API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-accent rounded focus:outline-none focus:border-secondary"
            placeholder="Enter admin key"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
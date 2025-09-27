// src/pages/ResetPassword.jsx

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    toast.promise(
      api.post('/api/auth/reset-password', { token, new_password: password }),
      {
        loading: 'Resetting password...',
        success: () => {
          navigate('/login');
          return "Password reset successfully! Please log in.";
        },
        error: "Failed to reset password. The link may have expired.",
      }
    );
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Set a New Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
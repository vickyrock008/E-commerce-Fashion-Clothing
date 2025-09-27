// src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      api.post('/api/auth/forgot-password', { email }),
      {
        loading: 'Sending request...',
        success: () => {
          setSubmitted(true);
          return "Request sent!";
        },
        error: "An error occurred.",
      }
    );
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Request Sent</h1>
        <p className="mt-4 text-gray-600">If an account with that email exists, a password reset link has been sent.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">Enter your email to receive a reset link.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
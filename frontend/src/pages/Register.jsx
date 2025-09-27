// src/pages/Register.jsx

import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { UserContext } from '../context/UserContext';
import api from '../api/axiosConfig';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✨ FIX: Add client-side validation for password length.
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return; // Stop the function if validation fails
    }

    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      // ✨ FIX: Provide more specific error feedback from the backend.
      if (error.response && error.response.data && error.response.data.detail) {
        // If the backend provides a specific error message, show it.
        toast.error(error.response.data.detail);
      } else {
        // Otherwise, show a generic message.
        toast.error('Failed to register. The email might already be in use.');
      }
      console.error("Registration error:", error.response || error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post(
        `/api/auth/google-login`,
        { token: credentialResponse.credential }
      );
      const { access_token, user } = response.data;
      login(user, access_token);
      toast.success('Sign up successful!');
      navigate('/');
    } catch (error) {
      toast.error('Google sign up failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign up failed. Please try again.');
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              // ✨ FIX: Add minLength attribute for browser-level validation and accessibility.
              minLength="8"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900"
          >
            Register
          </button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
      </div>
    </div>
  );
}


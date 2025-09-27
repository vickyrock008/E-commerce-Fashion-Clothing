import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data from local storage", error);
        // If data is corrupt, log out to clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // ✨ THE FIX IS HERE: Redirect to the home page instead of just reloading.
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
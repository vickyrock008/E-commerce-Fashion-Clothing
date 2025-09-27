// src/pages/Admin/AdminCustomers.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/users/')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(() => {
        toast.error("Could not fetch customers.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-8 text-gray-500">No customers found.</td></tr>
            ) : customers.map(customer => (
              <tr key={customer.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">#{customer.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
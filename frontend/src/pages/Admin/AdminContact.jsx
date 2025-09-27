// src/pages/Admin/AdminContact.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

export default function AdminContact() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/contact/')
      .then(response => {
        setSubmissions(response.data);
      })
      .catch(() => {
        toast.error("Could not fetch contact submissions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading contact messages...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>
      {submissions.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{sub.name}</p>
                  <a href={`mailto:${sub.email}`} className="text-sm text-blue-600 hover:underline">{sub.email}</a>
                  {sub.phone && <p className="text-sm text-gray-600 mt-1">Phone: {sub.phone}</p>}
                </div>
                <span className="text-xs text-gray-500">{new Date(sub.submitted_at).toLocaleString()}</span>
              </div>
              <p className="mt-4 border-t pt-4 text-gray-800">{sub.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
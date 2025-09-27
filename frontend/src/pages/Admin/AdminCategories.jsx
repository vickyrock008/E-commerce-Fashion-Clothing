import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = () => {
    api.get('/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Could not fetch categories."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    toast.promise(
      api.post('/api/categories/', { name: newCategoryName, slug }),
      {
        loading: 'Creating category...',
        success: () => {
          setNewCategoryName('');
          fetchCategories();
          return 'Category created successfully!';
        },
        error: 'Failed to create category.',
      }
    );
  };

  const handleDelete = (categoryId) => {
    // ✨ FIX: Updated the confirmation message to be more accurate.
    if (window.confirm("Are you sure? Deleting this category will also delete all products within it. This action cannot be undone.")) {
      toast.promise(api.delete(`/api/categories/${categoryId}`), {
        loading: 'Deleting category...',
        success: () => {
          fetchCategories();
          return 'Category deleted successfully!';
        },
        // ✨ FIX: Updated the error message.
        error: 'Failed to delete category.',
      });
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., shirt"
              className="flex-grow border-gray-300 rounded-md shadow-sm p-2"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700">
              <PlusCircle className="mr-2 h-5 w-5" /> Add
            </button>
          </form>
        </div>
        
        {/* Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex justify-between items-center p-2 border rounded">
                <span>{cat.name}</span>
                <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

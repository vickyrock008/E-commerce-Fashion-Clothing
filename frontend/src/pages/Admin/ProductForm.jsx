import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ProductForm() {
  // State to hold form text fields
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '0',
    category_id: ''
  });
  
  // ✨ Separate state specifically for the image file
  const [imageFile, setImageFile] = useState(null);
  // ✨ State to show a preview of the existing image while editing
  const [imagePreview, setImagePreview] = useState('');

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    // Fetch categories for the dropdown
    api.get(`/api/categories/`)
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Could not load categories."));

    // If we are editing, fetch the existing product data
    if (isEditing) {
      api.get(`/api/products/${id}`)
        .then(res => {
          // Populate the form fields with existing data
          setProductData({
            name: res.data.name,
            price: res.data.price,
            description: res.data.description,
            stock: res.data.stock,
            category_id: res.data.category_id
          });
          // Set the image preview URL
          setImagePreview(res.data.image);
        })
        .catch(() => toast.error("Could not find product to edit."));
    }
  }, [id, isEditing]);

  // Handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // ✨ Handler for the image file input
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a temporary URL for the new image preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✨ Use FormData because we are sending a file
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', parseFloat(productData.price));
    formData.append('stock', parseInt(productData.stock, 10));
    formData.append('description', productData.description);
    formData.append('category_id', parseInt(productData.category_id));
    
    // ✨ Only append the image file if a new one has been selected
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Determine the correct API request (POST for create, PUT for update)
    // Note: For PUT with FormData, the backend setup might need adjustment.
    // This example assumes the POST endpoint is the primary target for file uploads.
    const request = isEditing
      ? api.put(`/api/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/api/products/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    toast.promise(request, {
      loading: isEditing ? 'Updating product...' : 'Creating product...',
      success: () => {
        navigate('/admin/products');
        return `Product ${isEditing ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => {
        console.error("API Error:", err.response?.data || err);
        return `Failed to ${isEditing ? 'update' : 'create'} product.`;
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" value={productData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" name="price" value={productData.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" name="stock" value={productData.stock} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={productData.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        
        {/* ✨ Image Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input 
            type="file" 
            name="image" 
            onChange={handleImageChange} 
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
            accept="image/png, image/jpeg, image/webp"
          />
          {/* ✨ Image preview */}
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded-md shadow-sm" />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category_id" value={productData.category_id} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" required>
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {isEditing ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
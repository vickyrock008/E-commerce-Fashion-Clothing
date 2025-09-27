import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusCircle, Edit, Trash2, PackagePlus, X } from 'lucide-react';

// ✨ New Modal for Adding Stock
const AddStockModal = ({ product, onClose, onStockAdded }) => {
  const [amount, setAmount] = useState('');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid, positive number.");
      return;
    }

    toast.promise(api.post(`/api/products/${product.id}/add_stock`, { amount: amountNum }), {
      loading: 'Adding stock...',
      success: () => {
        onStockAdded(); // This tells the main page to refresh its data
        onClose();      // This closes the modal
        return 'Stock added successfully!';
      },
      error: 'Failed to add stock.',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Add Stock for: {product.name}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="stock-amount" className="block text-sm font-medium text-gray-700">Amount to Add</label>
          <input
            id="stock-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 10"
            required
            min="1"
          />
          <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
};


// ✨ New Modal for Confirming Deletion
const ConfirmDeleteModal = ({ product, onClose, onProductDeleted }) => {
    if (!product) return null;
  
    const handleDelete = () => {
      toast.promise(api.delete(`/api/products/${product.id}`), {
        loading: 'Deleting product...',
        success: () => {
          onProductDeleted();
          onClose();
          return 'Product deleted successfully!';
        },
        error: 'Failed to delete product.',
      });
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
          <p className="mb-6">Do you really want to delete the product "{product.name}"? This action cannot be undone.</p>
          <div className="flex justify-center gap-4">
            <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button onClick={handleDelete} className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    );
};


// ✨ Main Component to List All Products
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);

  // Function to fetch products from the backend
  const fetchProducts = () => {
    setLoading(true);
    api.get('/api/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        toast.error('Could not fetch products.');
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect hook to run fetchProducts when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">₹{product.price.toFixed(2)}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center font-semibold">{product.stock}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => setStockModalProduct(product)} className="text-green-600 hover:text-green-900 mr-4" title="Add Stock"><PackagePlus/></button>
                  <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit"><Edit/></Link>
                  <button onClick={() => setDeleteModalProduct(product)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the modals when they are needed */}
      <AddStockModal 
        product={stockModalProduct} 
        onClose={() => setStockModalProduct(null)} 
        onStockAdded={fetchProducts} 
      />
      <ConfirmDeleteModal 
        product={deleteModalProduct} 
        onClose={() => setDeleteModalProduct(null)} 
        onProductDeleted={fetchProducts} 
      />
    </div>
  );
}
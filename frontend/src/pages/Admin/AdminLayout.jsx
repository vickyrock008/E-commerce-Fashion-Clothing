// src/pages/Admin/AdminLayout.jsx

import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Layers, MessageSquare } from 'lucide-react'; // ✨ Import MessageSquare icon

export default function AdminLayout() {
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        toast.error("You don't have permission to access this page.");
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div>Loading admin dashboard...</div>;
  }

  const getLinkClass = (path) => {
    return location.pathname.startsWith(path)
      ? 'flex items-center p-3 rounded bg-gray-700'
      : 'flex items-center p-3 rounded hover:bg-gray-700';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-grow p-4">
          <Link to="/admin/products" className={getLinkClass('/admin/products')}>
            <Package className="mr-3" /> Products
          </Link>
          <Link to="/admin/categories" className={getLinkClass('/admin/categories')}>
            <Layers className="mr-3" /> Categories
          </Link>
          <Link to="/admin/orders" className={getLinkClass('/admin/orders')}>
            <ShoppingCart className="mr-3" /> Orders
          </Link>
          <Link to="/admin/contact" className={getLinkClass('/admin/contact')}>
            <MessageSquare className="mr-3" /> Contact
          </Link>
          <Link to="/admin/customers" className={getLinkClass('/admin/customers')}>
            <Users className="mr-3" /> Customers
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="flex items-center w-full p-3 rounded hover:bg-red-700">
            <LogOut className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
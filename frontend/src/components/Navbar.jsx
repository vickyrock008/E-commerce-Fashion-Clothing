import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Corrected import paths to resolve compilation errors
import CartPopup from './CartPopup';
import logoImage from '../assets/images/beef_images/logo.png';
import { UserContext } from '../context/UserContext';

import { ShoppingCart, User, LogOut, ShieldCheck, Search } from 'lucide-react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';

export default function Navbar({ cartItems, removeFromCart, updateQuantity }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { user, logout, token } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery(""); // Clear search bar after searching
    }
  };
  
  const mainLinks = (
    <>
        <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
        <Link to="/shop" className="text-gray-700 hover:text-red-600">Shop</Link>
        <Link to="/about" className="text-gray-700 hover:text-red-600">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-red-600">Contact</Link>
        <Link to="/lookbook" className="text-gray-700 hover:text-red-600">Lookbook</Link>
    </>
  );

  const mobileNavLinks = (
    <>
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</Link>
        <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Shop</Link>
        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">About</Link>
        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Contact</Link>
        <Link to="/lookbook" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Lookbook</Link>
    </>
  );


  return (
    <nav className="bg-white shadow-sm  top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
  {/* Increased logo size for better visibility */}
  <img src={logoImage} alt="Outfit Oracle Logo" className="h-12 w-auto object-contain" />
</Link>

        {/* --- Main Links and Search Bar --- */}
        <div className="flex-grow flex justify-center items-center">
            <div className="hidden md:flex space-x-8 items-center">
                {mainLinks}
            </div>
            <form onSubmit={handleSearch} className="relative ml-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="border rounded-full py-2 pl-4 pr-10"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Search className="text-gray-500" />
                </button>
            </form>
        </div>

        {/* --- User and Cart Links --- */}
        <div className="flex space-x-4 items-center">
          {user && token ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden lg:flex items-center text-blue-600 hover:text-blue-800">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className="hidden lg:flex items-center text-gray-700 hover:text-red-600">
                <User className="h-5 w-5 mr-2" />
                <span>Orders</span>
              </Link>
              <button onClick={logout} className="hidden lg:flex items-center text-gray-700 hover:text-red-600">
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-red-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-red-600">Register</Link>
            </>
          )}

          <button onClick={() => setCartOpen(true)} className="relative flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
         <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </div>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Classic Meat & Products</span>
              <img
                alt="Classic Meat Logo"
                src={logoImage}
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {mobileNavLinks}
              </div>
              <div className="py-6">
                 {user && token ? (
                    <div className="space-y-2">
                        {user.role === 'admin' && (
                             <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-blue-600 hover:bg-gray-50">Admin Panel</Link>
                        )}
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">My Orders</Link>
                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left w-full">Logout</button>
                    </div>
                 ) : (
                    <>
                    <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                        Register
                    </Link>
                    </>
                 )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <CartPopup
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
    </nav>
  );
}
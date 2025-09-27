// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; 

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Lookbook from './pages/Lookbook.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchResults from './pages/SearchResults.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import AdminOrderDetailComponent from './components/AdminOrderDetail';
// ✨ 1. Import the two new pages we created for the password reset flow
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Import Admin components
import AdminLayout from './pages/Admin/AdminLayout.jsx';
import AdminProducts from './pages/Admin/AdminProducts.jsx';
import ProductForm from './pages/Admin/ProductForm.jsx';
import AdminOrders from './pages/Admin/AdminOrders.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';
import AdminContact from './pages/Admin/AdminContact.jsx';
import AdminCustomers from './pages/Admin/AdminCustomers.jsx';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  const addToCart = (productToAdd) => {
    if (productToAdd.stock <= 0) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }

    const existingItem = cartItems.find(item => item.id === productToAdd.id);
    
    if (existingItem && existingItem.qty >= productToAdd.stock) {
      toast.error(`You cannot add more, only ${productToAdd.stock} units are available.`);
      return;
    }
    
    setCartItems(currentItems => {
      if (existingItem) {
        return currentItems.map(item =>
          item.id === productToAdd.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentItems, { ...productToAdd, qty: 1 }];
    });
    toast.success(`${productToAdd.name} added to cart!`);
  };

  const removeFromCart = (productIdToRemove) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== productIdToRemove)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    const productInCart = cartItems.find(item => item.id === productId);
    
    if (productInCart && newQuantity > productInCart.stock) {
      toast.error(`Only ${productInCart.stock} units are available.`);
      return;
    }
    
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === productId ? { ...item, qty: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Toaster position="bottom-center" />
      
      {!isAdminRoute && 
        <Navbar 
          cartItems={cartItems} 
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      }

      {/* Added some bottom padding to ensure content isn't hidden by the floating footer */}
      <main className={`flex-grow ${!isAdminRoute ? 'container mx-auto p-4 pb-40' : ''}`}>
        <Routes>
            <Route path='/' element={<Home addToCart={addToCart} />} />
            <Route path='/shop' element={<Shop addToCart={addToCart} />} />
            <Route path='/product/:id' element={<ProductDetail addToCart={addToCart} />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/lookbook' element={<Lookbook />} />
            <Route path='/checkout' element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/search' element={<SearchResults addToCart={addToCart} />} />
            <Route path='/order-confirmation' element={<OrderConfirmation />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetailComponent />} />
            {/* ✨ 2. Add the routes for our new pages */}
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            
            <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<AdminProducts />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="customers" element={<AdminCustomers />} />
                
            </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}


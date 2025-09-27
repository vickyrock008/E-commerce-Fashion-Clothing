// src/pages/Checkout.jsx

import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import placeholderImage from '../assets/images/bg_images/about.png';
import checkoutBg from '../assets/images/bg_images/check.png';

export default function Checkout({ cartItems, clearCart }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setCustomerInfo(prevInfo => ({...prevInfo, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!user) {
        toast.error("Please log in to place an order.");
        navigate('/login');
        return;
    }

    const orderData = {
      user_id: user.id,
      items: cartItems.map(item => ({
        product_id: item.id,
        qty: item.qty,
      })),
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
    };
    
    toast.promise(
      api.post(`/api/checkout/`, orderData),
      {
        loading: 'Placing your order...',
        success: (response) => {
          clearCart();
          navigate('/order-confirmation', { state: { orderId: response.data.order_uid } }); 
          return `Order placed successfully!`;
        },
        error: 'Failed to place order. An item in your cart may be out of stock.',
      }
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 50.00 : 0;
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + taxes;

  return (
    <div 
        className="relative bg-cover bg-center bg-fixed min-h-screen -m-4 py-16 sm:py-24 rounded-xl overflow-hidden"
        style={{ backgroundImage: `url(${checkoutBg})` }}
    >
      <div className="relative container mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center p-12 bg-white/70  rounded-lg shadow-lg max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
              <p className="mt-2 text-gray-600">Please add some products to your cart before checking out.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto rounded-xl shadow-2xl p-8 grid lg:grid-cols-2 gap-12 bg-white/70 backdrop-blur-sm">
            
            {/* Billing Details Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-black-800">Billing Details</h2>
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black-700">Full Name *</label>
                      <input type="text" name="name" id="name" required value={customerInfo.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black-700">Email Address *</label>
                      <input type="email" name="email" id="email" required value={user?.email || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 bg-gray-200 cursor-not-allowed" />
                  </div>
                  <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-black-700">Phone Number *</label>
                      <input type="tel" name="phone" id="phone" required value={customerInfo.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
                  </div>
                  <div>
                      <label htmlFor="address" className="block text-sm font-medium text-black-700">Street Address *</label>
                      <textarea name="address" id="address" required value={customerInfo.address} onChange={handleInputChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-red-700 transition-colors duration-300 font-semibold mt-6 text-lg">
                      Place Order (Cash on Delivery)
                  </button>
              </form>
            </div>

            {/* Order Summary Section */}
            <div className="p-8 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">Order Summary</h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map(item => {
                    // ✨ FIX: Construct the full, absolute image URL for each item in the cart
                    const imageUrl = item.image
                      ? `${import.meta.env.VITE_API_URL}${item.image}`
                      : placeholderImage;
                      
                    return (
                      <li key={item.id} className="flex py-6 items-center">
                        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img 
                            src={imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-6 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-lg font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">₹{(item.price * item.qty).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-md mt-2">
                            <p className="text-gray-600">Qty {item.qty}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                    <div className="flex justify-between text-lg font-medium text-gray-800">
                        <p>Subtotal</p>
                        <p>₹{subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-md font-medium text-gray-600 mt-2">
                        <p>Shipping</p>
                        <p>₹{shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-md font-medium text-gray-600 mt-2">
                        <p>Taxes (5%)</p>
                        <p>₹{taxes.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 border-t-2 pt-4">
                        <p>Total</p>
                        <p>₹{total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

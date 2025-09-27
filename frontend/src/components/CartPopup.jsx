import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CartPopup({ open, onClose, cartItems, removeFromCart, updateQuantity }) {
  if (!open) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* This is the dim overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      
      {/* This is the white cart panel. We added relative and z-10 here. */}
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full md:w-1/3 rounded-t-lg p-4 relative z-10"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-black-600 font-medium hover:underline">Close</button>
        </div>
        <div className="mt-4">
          {cartItems.length === 0 ? (
            <p class="text-xl font-bold">Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="font-bold border w-6 h-6 rounded">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="font-bold border w-6 h-6 rounded">+</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={onClose} className="block w-full text-center mt-4 px-4 py-2 bg-black text-white rounded">
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
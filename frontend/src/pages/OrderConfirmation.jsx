import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Import the background image
import thankYouBg from '../assets/images/bg_images/thankyou.png';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img 
        src={thankYouBg} 
        alt="Thank you" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl"
        >
          <CheckCircle className="h-20 w-20 mx-auto text-green-400 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Thank You!
          </h1>
          <p className="mt-4 text-lg text-black">
            Your order has been placed successfully.
          </p>
          {orderId && (
            <p className="mt-2 text-sm text-black">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <Link
            to="/shop"
            className="mt-10 inline-block px-10 py-4 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


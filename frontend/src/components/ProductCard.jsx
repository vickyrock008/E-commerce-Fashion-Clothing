import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';
import placeholderImage from '../assets/images/beef_images/img1.jpg'; // A fallback image
import { motion } from 'framer-motion';

export default function ProductCard({ product, addToCart }) {
  if (!product) return null;

  // ✨ FIX: Construct the full, absolute URL for the product image.
  // This combines the backend URL (from environment variables) with the image path from the database.
  const imageUrl = product.image 
    ? `${import.meta.env.VITE_API_URL}${product.image}` 
    : placeholderImage;

  return (
    <motion.div 
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm h-full border border-gray-200"
      whileHover={{ y: -8, boxShadow: "0px 15px 25px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      
      <div className="relative aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
        <img
          alt={product.name || "Product Image"}
          src={imageUrl}
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback if image fails to load
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <Link to={`/product/${product.id}`} className="absolute inset-0" aria-label={`View details for ${product.name}`}></Link>
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-4 text-left">
        <h3 className="text-sm font-medium text-gray-800">
          <Link to={`/product/${product.id}`} className="hover:text-red-600 transition-colors">
            <span className="absolute inset-0" />
            {product.name || "Unnamed Product"}
          </Link>
        </h3>
        
        <div className="flex flex-1 flex-col justify-end">
            <p className="text-md font-semibold text-gray-900">{product.price ? `₹${product.price.toFixed(2)}` : "N/A"}</p>
        </div>
      </div>
      
      {product.stock > 0 ? (
        <div className="p-4 pt-0">
            <motion.button
                onClick={(e) => {
                e.stopPropagation(); 
                addToCart(product);
                }}
                className="w-full bg-black text-white py-2.5 px-4 text-sm font-semibold flex items-center justify-center rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </motion.button>
        </div>
      ) : (
         <div className="p-4 pt-0">
            <p className="text-center text-sm font-semibold text-red-600 bg-red-100 py-2.5 rounded-md">Out of Stock</p>
         </div>
      )}
    </motion.div>
  );
}

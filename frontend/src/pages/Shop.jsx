import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import shopBg from "../assets/images/bg_images/shop3.png";
import { motion } from "framer-motion";

export default function Shop({ addToCart }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/api/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Animation variant for each category section to fade and slide in
  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div 
      className="relative bg-cover bg-center bg-fixed min-h-screen -m-4 py-16 sm:py-24 rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${shopBg})` }}
    >
      
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24">
          <motion.h2 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-4xl font-extrabold mb-20 text-center text-gray-800 drop-shadow-lg"
          >
            Our Collections
          </motion.h2>
          
          <div className="space-y-24">
              {categories.map(category => (
                  <motion.div 
                    key={category.id} 
                    className="p-6 sm:p-8 rounded-2xl  shadow-xl  backdrop-blur-sm"
                    variants={categoryVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.3)"}}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                      <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-800 pb-3 inline-block drop-shadow-md">
                        {category.name}
                      </h3>
                      
                      {category.products && category.products.length > 0 ? (
                          <ProductCarousel products={category.products} addToCart={addToCart} />
                      ) : (
                          <div className="flex justify-center items-center h-48 bg-white/10 rounded-lg">
                            <p className="text-center text-gray-300">No products in this category yet.</p>
                          </div>
                      )}
                  </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}


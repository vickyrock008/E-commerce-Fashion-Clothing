import React from "react";
import { motion } from "framer-motion";
import { Gem, Leaf, Palette } from 'lucide-react';
import aboutLogo from '../assets/images/bg_images/about_logo.png';
import aboutBg from '../assets/images/bg_images/about.png';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function About() {
  return (
    <div
      className="relative bg-cover bg-center bg-fixed min-h-screen -m-4 py-16 sm:py-24 rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${aboutBg})` }}
    >
      
      <div className="relative container mx-auto px-6 md:px-12 py-12">
        
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-black tracking-tighter leading-tight drop-shadow-md">
            Defining Style, Redefining Fashion.
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-xl text-black max-w-3xl mx-auto">
            Outfit Oracle is not just about clothing; it's about a statement. We craft pieces that blend timeless elegance with contemporary design, empowering you to express your unique identity.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row items-center gap-12 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8 md:p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-black">The Art of Creation</h2>
            <p className="mt-4 text-black leading-relaxed text-lg">
              Our philosophy is rooted in the belief that fashion is an art form. Each collection begins with a story, brought to life through meticulous design, premium materials, and an unwavering attention to detail. We don't follow trends; we set them, creating garments that are both of the moment and timeless.
            </p>
          </motion.div>
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <img
              src={aboutLogo}
              alt="Outfit Oracle Logo"
              className="rounded-lg w-full h-auto object-contain"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 text-center mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <motion.div variants={itemVariants} className="bg-white/90 p-8 rounded-2xl shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm">
            <Gem className="h-12 w-12 mx-auto text-black mb-4" />
            <h3 className="text-2xl font-semibold text-black">Exceptional Quality</h3>
            <p className="mt-2 text-black">
              We source only the finest materials from around the world to ensure every piece feels as good as it looks, promising durability and comfort.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/90 p-8 rounded-2xl shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm">
            <Leaf className="h-12 w-12 mx-auto text-black mb-4" />
            <h3 className="text-2xl font-semibold text-black">Sustainable Vision</h3>
            <p className="mt-2 text-black">
              Style should not come at the cost of our planet. We are committed to ethical production, sustainable fabrics, and mindful practices in every step.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/90 p-8 rounded-2xl shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm">
            <Palette className="h-12 w-12 mx-auto text-black mb-4" />
            <h3 className="text-2xl font-semibold text-black">Modern Craftsmanship</h3>
            <p className="mt-2 text-black">
              Our designs honor traditional techniques while embracing modern innovation, resulting in unique, impeccably crafted garments for the contemporary wardrobe.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

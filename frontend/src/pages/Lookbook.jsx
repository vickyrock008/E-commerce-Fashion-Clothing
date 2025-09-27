import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Import images using the correct path alias
import heroImage from '@/assets/images/bg_images/lookbook.png';
import lookbookImage1 from '@/assets/images/bg_images/shop1.png';
import lookbookImage2 from '@/assets/images/bg_images/shop2.png';
import lookbookImage3 from '@/assets/images/bg_images/lookbook3.png';
import lookbookImage4 from '@/assets/images/bg_images/shop4.png';

// Section component for animations
const LookbookSection = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Lookbook() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <img src={heroImage} alt="Autumn Lookbook" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center text-white p-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tighter uppercase"
          >
            The Lookbook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4 text-lg md:text-xl max-w-2xl"
          >
            Curated styles for the season. Discover the inspiration behind our latest collection.
          </motion.p>
        </div>
      </div>

      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* --- Collection 1: Urban Explorer --- */}
          <LookbookSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
              <div className="relative">
                <div className="overflow-hidden rounded-lg">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src={lookbookImage1}
                    alt="Urban Explorer Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Urban Explorer</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Monochrome essentials for the modern cityscape. Sharp, versatile, and effortlessly cool, this collection is defined by its clean lines and premium fabrics.
                </p>
                <Link to="/shop" className="mt-8 inline-flex items-center gap-x-2 text-md font-semibold text-gray-900 hover:text-red-600 transition-colors">
                  Shop The Look <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </LookbookSection>

          {/* --- Collection 2: Autumn Chill --- */}
          <LookbookSection>
            <div className="mt-24 sm:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
              <div className="lg:order-last relative">
                 <div className="overflow-hidden rounded-lg">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src={lookbookImage2}
                    alt="Autumn Chill Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Autumn Chill</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Embrace the season with bold colors and cozy layers. A collection that's as vibrant as autumn itself, featuring statement outerwear and soft knits.
                </p>
                 <Link to="/shop" className="mt-8 inline-flex items-center gap-x-2 text-md font-semibold text-gray-900 hover:text-red-600 transition-colors">
                  Shop The Look <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </LookbookSection>
          
           {/* --- Interstitial Full-Width Image --- */}
          <LookbookSection> 
  <div className="mt-24 sm:mt-32 relative aspect-[16/9] lg:aspect-[2/1] overflow-hidden rounded-lg">
    <motion.img
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      src={lookbookImage3}
      alt="Desert Rose Mood"
      className="w-full h-full object-cover"
    />
  </div>
</LookbookSection>



          {/* --- Collection 3: Future Forward --- */}
          <LookbookSection>
            <div className="mt-24 sm:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16">
                <div className="lg:col-span-4 text-center lg:text-left self-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Future Forward</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Edgy, innovative designs that push the boundaries. This is the future of fashion, today.
                    </p>
                    <Link to="/shop" className="mt-8 inline-flex items-center gap-x-2 text-md font-semibold text-gray-900 hover:text-red-600 transition-colors">
                        Shop The Look <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="lg:col-span-8">
                     <div className="overflow-hidden rounded-lg">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            src={lookbookImage4}
                            alt="Future Forward Collection"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
          </LookbookSection>
        </div>
      </div>
    </div>
  );
}


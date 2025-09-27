'use client'

import { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ProductCarousel from '../components/ProductCarousel.jsx';
import lookbookImage from '../assets/images/bg_images/lookbook.png';
import promoVideo from '../assets/videos/promo.mp4';
import promoVideoPoster from '../assets/images/promo-poster.png';

// --- SVG Icons for Mute/Unmute ---

const MutedIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
  </svg>
);

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

const UnmutedIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

// --- Main Home Component ---

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [isMuted, setIsMuted] = useState(true); // 争 Start in a muted state
  const videoRef = useRef(null);

  // This IntersectionObserver correctly handles play/pause on scroll. No changes needed here.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current.play().catch(error => {
            console.error("Video play interrupted:", error);
          });
        } else {
          videoRef.current.pause();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    api
      .get('/api/products/')
      .then((r) => {
        if (Array.isArray(r.data)) {
          setProducts(r.data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const currentMutedState = !videoRef.current.muted;
      videoRef.current.muted = currentMutedState;
      setIsMuted(currentMutedState);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                    <div className="w-full md:w-3/4 p-4 rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-100 shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.03]">
                        <div className="relative w-full aspect-[9/16] overflow-hidden rounded-[1.7rem] bg-black border border-gray-200 shadow-inner">
                            <video
                                ref={videoRef}
                                src={promoVideo}
                                poster={promoVideoPoster}
                                loop
                                playsInline
                                autoPlay
                                muted    // ✨ CHANGE 1: Ensure muted is active for autoplay
                                preload="auto" // ✨ CHANGE 2: Tell the browser to preload the video
                                className="absolute w-full h-full top-0 left-0 object-cover"
                            >
                                Your browser does not support the video tag.
                            </video>
                            <button
                                onClick={toggleMute}
                                className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                            >
                                {isMuted ? <MutedIcon /> : <UnmutedIcon />}
                            </button>
                        </div>
                    </div>
                </div>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center md:text-left"
                >
                    <motion.h1 
                        variants={itemVariants} 
                        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
                    >
                        The Outfit Oracle
                    </motion.h1>
                    <motion.p 
                        variants={itemVariants} 
                        className="mt-6 text-lg leading-8 text-gray-600"
                    >
                        Quality you can feel, style you'll love.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center md:justify-start">
                        <Link
                        to="/shop"
                        className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
                        >
                        Shop Our Premium Selection
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="overflow-hidden rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300">
      <Link to="/Lookbook">
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        src={lookbookImage}
        alt="Autumn Lookbook banner featuring a model in seasonal attire"
        className="w-full h-auto object-cover"
      />
    </Link>
  </div>
</div>


      {/* Featured Products */}
      <div className="mx-auto max-w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-gray-800 mb-8">Featured Products</h2>
        {products.length > 0 ? (
            <ProductCarousel products={products} addToCart={addToCart} />
        ) : (
            <p className="text-center text-gray-500">Loading products...</p>
        )}
      </div>
    </div>
  )
}
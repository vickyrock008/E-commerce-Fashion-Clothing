import React from 'react';
import ProductCard from '@/components/ProductCard.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCarousel({ products, addToCart }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={2}
        // ✨ FIX: Added loop={true} to enable infinite scrolling
        loop={true} 
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }}
        className="!py-2 !px-12 !pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto !flex">
            <ProductCard product={product} addToCart={addToCart} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Navigation Buttons */}
      <div className="swiper-button-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 p-2 cursor-pointer bg-white rounded-full shadow-md transition-transform duration-300 hover:scale-110 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </div>
      <div className="swiper-button-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 cursor-pointer bg-white rounded-full shadow-md transition-transform duration-300 hover:scale-110 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>
  );
}

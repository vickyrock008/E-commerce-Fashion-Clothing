import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axiosConfig.jsx' 
import ProductCarousel from '../components/ProductCarousel.jsx' 

export default function ProductDetail({ addToCart }){
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([]) 
  
  useEffect(()=>{
    const fetchProductData = async () => {
        try {
            const [productResponse, allProductsResponse] = await Promise.all([
                api.get(`/api/products/${id}/`),
                api.get('/api/products/')
            ]);
            
            const mainProduct = productResponse.data;
            setP(mainProduct);

            if (allProductsResponse.data && Array.isArray(allProductsResponse.data)) {
                const related = allProductsResponse.data.filter(
                    prod => prod.category_id === mainProduct.category_id && prod.id !== mainProduct.id
                );
                setRelatedProducts(related);
            }
        } catch (error) {
            console.error("Failed to fetch product data:", error);
        }
    };

    fetchProductData();
  },[id])

  if(!p) return <div>Loading...</div>

  // ✨ FIX: Construct the full image URL for the main product image
  const imageUrl = p.image ? `${import.meta.env.VITE_API_URL}${p.image}` : '';

  return (
    <div>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
        <div className="w-full h-auto aspect-square bg-gray-100 rounded-lg shadow-lg overflow-hidden">
            <img 
              // ✨ Use the corrected full URL here
              src={imageUrl} 
              alt={p.name} 
              className="w-full h-full object-cover"
            />
        </div>
        <div>
            <h1 className='text-4xl font-extrabold tracking-tight'>{p.name}</h1>
            <p className='mt-4 text-gray-600 leading-relaxed'>{p.description}</p>
            <div className='mt-6 text-3xl font-bold text-gray-700'>₹{p.price}</div>
            
            <div className="mt-6">
                {p.stock > 0 ? (
                    <>
                        <p className="text-lg text-black-700 font-semibold mb-3">{p.stock} in stock</p>
                        <button 
                            onClick={() => addToCart(p)}
                            className='w-full px-8 py-3 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105'>
                            Add to Cart
                        </button>
                    </>
                ) : (
                    <div className="text-center font-bold text-xl text-red-700 bg-red-100 py-4 rounded-lg">
                        Currently Out of Stock
                    </div>
                )}
            </div>
        </div>
        </div>

        {relatedProducts.length > 0 && (
            <div className="mt-24">
                <h2 className="text-3xl font-bold text-center mb-8">You Might Also Like</h2>
                <ProductCarousel products={relatedProducts} addToCart={addToCart} />
            </div>
        )}
    </div>
  )
}
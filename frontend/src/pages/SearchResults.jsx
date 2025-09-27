// src/pages/SearchResults.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';
// ✨ 1. Import the ProductCard component
import ProductCard from '../components/ProductCard.jsx'; 

export default function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/api/products/search?query=${query}`)
        .then(response => {
          setResults(response.data);
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
          toast.error("Could not perform search.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [query]);

  if (loading) {
    return <div className="text-center p-12">Searching for products...</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for: <span className="text-red-600">"{query}"</span>
        </h1>
        <p className="text-gray-600 mb-8">{results.length} products found.</p>
        
        {results.length > 0 ? (
          // ✨ 2. Replace the carousel with a professional grid layout
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {results.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-800">No products found</h2>
            <p className="mt-2 text-gray-600">We couldn't find any products matching your search. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
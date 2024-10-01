'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

const ProductsToReviewPage = () => {
  const { data: session } = useSession();
  const [productsToReview, setProductsToReview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsToReview = async () => {
      try {
        const response = await fetch('/api/user/products-to-review');
        if (response.ok) {
          const data = await response.json();
          setProductsToReview(data.productsToReview);
        } else {
          console.error('Failed to fetch products to review');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProductsToReview();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!session) return <p className="text-center text-xl text-gray-700">Please log in to see products you can review.</p>;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Products to Review</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {productsToReview.length > 0 ? (
          <ul className="space-y-4">
            {productsToReview.map((product: any) => (
              <li key={product._id} className="flex justify-between items-center bg-gray-100  p-4 rounded-lg shadow">
                <span className="text-lg font-semibold text-gray-800 ">{product.name}</span>
                <Link href={`/product/${product.slug}`}>
                  <div className="relative inline-block px-4 py-2 text-white bg-gray-800 rounded-lg transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                    <span className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out hover:opacity-20 rounded-lg"></span>
                    <span className="relative">Review Now</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-700 ">No products available for review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsToReviewPage;

import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';
import React from 'react';
import {Rating} from './SearchRating';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="p-4 w-[100%] sm:w-1/2 md:w-[100%] lg:w-[95%] mx-auto md:mx-0 lg:mx-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="bg-white border border-gray-200 rounded-lg  shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-gray-400">
          <a href="#">
            <div className="bg-white p-8 rounded-t-lg">
              <img
                className="w-full h-48 object-cover transition-all duration-300 hover:opacity-90"
                src={product.images[0]?.url} // Assuming the main image is the first one in the array
                alt={product.name}
              />
            </div>
          </a>
          <div className="p-4">
            <a href="#">
              <h5 className="text-xl text-gray-900  transition-colors duration-300 hover:text-gray-600">{product.name}</h5>
            </a>
            <div className="flex items-center mt-2.5 mb-5">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Rating value={product.rating} caption={`(${product.numReviews})`} /> {/* Placeholder onChange handler */}
                
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-gray-900 ">${product.price}</span>
              <a href="#" className="text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-2 py-2 text-center transition-all duration-300">{product.brand}</a>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

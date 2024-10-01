import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';
import React from 'react';
import {Rating} from './SearchRating';

export default function ProductItem({ product }: { product: Product }) {
  return (
    <li className="relative w-full max-w-[475px] card pt-10 pb-10">
      <Link href={`/product/${product.slug}`} className="relative h-full w-full">
        <div className="sm:max-w-[15rem] md:w-full lg:w-full lg:max-w-sm md:max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg   transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
          <a href="#">
            <img 
              className="p-8 rounded-t-lg transition-all duration-300 hover:opacity-90" 
              src={product.images[0]?.url} // Assuming the main image is the first one in the array
              alt={product.name} 
            />
          </a>
          <div className="px-5 pb-5">
            <a href="#">
              <h5 className="text-xl tracking-tight text-gray-900 transition-colors duration-300 hover:text-gray-600 ">{product.name}</h5>
            </a>
            <div className="flex items-center mt-2.5 mb-5">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Rating value={product.rating} caption={`(${product.numReviews})`} /> {/* Placeholder onChange handler */}
               
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-gray-900 ">${product.price}</span>
              <a href="#" className="text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-2 py-2 text-center transition-all duration-300">{product.brand}</a>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

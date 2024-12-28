import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';
import React from 'react';
import { Rating } from './SearchRating';
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      {/* Outer Card Container */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col h-full cursor-pointer">
        
        {/* Image Wrapper (fixed height) */}
        <div className="relative w-full h-64 bg-gray-50">
          <Image
            src={product.images[0]?.url}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Text / Info Section */}
        <div className="flex flex-col p-5 flex-grow">
          {/* Title (optionally line-clamp to avoid huge blocks of text) */}
          <h5 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h5>

          {/* Rating */}
          <div className="flex items-center mt-3">
            <Rating value={product.rating} caption={`(${product.numReviews})`} />
          </div>

          {/* Price & Brand at the Bottom */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <span className="px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-full">
              {product.brand}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}


import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';
import Image from 'next/image';
import { Rating } from './SearchRating';

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg flex flex-col">
      {/* Image section */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full h-64 bg-gray-50 flex items-center justify-center overflow-hidden"
      >
        <Image
          src={product.images[0]?.url}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-300 hover:scale-110"
        />
      </Link>

      {/* Content section */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`}>
          <h5 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h5>
        </Link>

        <div className="flex items-center mt-2">
          <Rating value={product.rating} caption={`(${product.numReviews})`} />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <span className="px-2 py-1 bg-gray-800 text-white text-sm font-medium rounded-full">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
}

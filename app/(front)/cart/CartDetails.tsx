'use client';

import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartDetails() {
  const router = useRouter();
  const { items, itemsPrice, decrease, increase } = useCartService();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4">
      <h1 className="py-6 text-3xl font-semibold text-center text-gray-900 ">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-900 ">
          Your cart is empty. <Link href="/" className="text-blue-600  hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center bg-white  p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
              <div className="ml-6 flex-1">
                <Link href={`/product/${item.slug}`} className="text-xl font-medium text-gray-900  hover:underline">
                  {item.name}
                </Link>
                <div className="text-sm text-gray-500  mt-2">
                  <p>Color: <span className="font-semibold">{item.color}</span></p>
                  <p>Size: <span className="font-semibold">{item.size}</span></p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900  mb-4">
                  ${item.price.toFixed(2)}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200  rounded-full text-gray-900  hover:bg-gray-300 "
                    type="button"
                    onClick={() => decrease(item)}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900 ">{item.qty}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-900  hover:bg-gray-300 "
                    type="button"
                    onClick={() => increase(item)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-gray-100  p-6 rounded-lg shadow-md mt-10">
          <div className="text-lg font-semibold text-gray-900  mb-4">
            Subtotal ({items.reduce((a, c) => a + c.qty, 0)} items) : ${itemsPrice.toFixed(2)}
          </div>
          <button
            onClick={() => router.push('/shipping')}
            className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Proceed to Checkout
          </button>
          <Link href="/" className="block text-center text-blue-600  hover:underline mt-4">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

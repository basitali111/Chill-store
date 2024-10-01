'use client';

import { useEffect, useState } from 'react';
import useCartService from '@/lib/hooks/useCartStore';
import { OrderItem } from '@/lib/models/OrderModel';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

type AddToCartButtonProps = {
  product: OrderItem;
  selectedColors: string;
  selectedSizes: string;
  selectedImage: string;
  isDisabled: boolean;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedColors,
  selectedSizes,
  selectedImage,
  isDisabled,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, addItem, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<OrderItem | undefined>();

  useEffect(() => {
    setExistItem(
      items.find(
        (x) =>
          x.slug === product.slug &&
          x.color === selectedColors &&
          x.size === selectedSizes
      )
    );
  }, [product, items, selectedColors, selectedSizes]);

  const addToCartHandler = () => {
    if (isDisabled) {
      toast.error('Please select a color and size.');
      return;
    }

    if (existItem) {
      increase(existItem);
    } else {
      addItem({
        ...product,
        color: selectedColors,
        size: selectedSizes,
        image: selectedImage,
        qty: 1,
      });
    }
    toast.success('Product added to cart!');
  };

  const buyNowHandler = () => {
    if (isDisabled) {
      toast.error('Please select a color and size.');
      return;
    }

    if (!session) {
      router.push('/signin');
    } else {
      if (!existItem) {
        addItem({
          ...product,
          color: selectedColors,
          size: selectedSizes,
          image: selectedImage,
          qty: 1,
        });
      }
      router.push('/shipping');
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {existItem ? (
        <div className="flex items-center">
          <button
            className="btn bg-gray-800 text-white hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-600 font-medium rounded-lg text-sm px-2 py-2 text-center transition-all duration-300"
            type="button"
            onClick={() => decrease(existItem)}
          >
            -
          </button>
          <span className="px-2 text-gray-900 ">{existItem.qty}</span>
          <button
            className="btn bg-gray-800 text-white hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-600 font-medium rounded-lg text-sm px-2 py-2 text-center transition-all duration-300"
            type="button"
            onClick={() => increase(existItem)}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="flex items-center justify-center px-6 py-2 font-bold text-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-800 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={addToCartHandler}
          disabled={isDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 cursor-pointer fill-current inline mr-3"
            viewBox="0 0 512 512"
          >
            <path
              d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
              data-original="#000000"
            ></path>
          </svg>
          Add to Cart
        </button>
      )}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        type="button"
        onClick={buyNowHandler}
        disabled={isDisabled}
      >
        Buy Now
      </button>
    </div>
  );
};

export default AddToCartButton;

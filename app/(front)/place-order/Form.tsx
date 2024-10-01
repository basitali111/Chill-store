'use client';

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';
import Link from 'next/link';
import Image from 'next/image';

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = useCartService();

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully');
        if (paymentMethod === 'Bank Transfer') {
          return router.push(`/order/${data.order._id}?showBankTransferModal=true`);
        } else {
          return router.push(`/order/${data.order._id}`);
        }
      } else {
        toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/payment');
    }
    if (items.length === 0) {
      return router.push('/');
    }
  }, [paymentMethod, router, items.length]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div className="container mx-auto p-4 overflow-x-hidden">
      <CheckoutSteps current={4} />

      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="overflow-x-auto md:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 ">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Name', value: shippingAddress.fullName },
                { label: 'Address', value: shippingAddress.address },
                { label: 'City', value: shippingAddress.city },
                { label: 'Postal Code', value: shippingAddress.postalCode },
                { label: 'Country', value: shippingAddress.country },
                { label: 'Phone Number', value: shippingAddress.phoneNumber },
                {
                  label: 'Other Detail',
                  value: shippingAddress.description || 'No description provided.',
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-lg ">{label}</span>
                  <span className="text-lg font-medium text-gray-900 ">{value}</span>
                </div>
              ))}
              <div className="flex justify-end">
                <Link href="/shipping" className="inline-flex items-center justify-center px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300">
                  Edit Details
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 ">Payment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-600 text-lg ">Payment Method</span>
                <span className="text-lg font-medium text-gray-900 ">{paymentMethod}</span>
              </div>
              <div className="flex justify-end">
                <Link href="/payment" className="inline-flex items-center justify-center px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300">
                  Edit Payment
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 ">Products</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.slug} className="flex flex-col sm:flex-row items-center sm:space-x-4 bg-gray-50  rounded-lg p-4 hover:bg-gray-100  transition-all duration-300">
                  <Link href={`/product/${item.slug}`}>
                    <Image src={item.image} alt={item.name} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                  </Link>
                  <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                    <Link href={`/product/${item.slug}`}>
                      <p className="text-lg font-bold text-gray-900 ">{item.name}</p>
                    </Link>
                    <p className="text-gray-500  mt-2">
                      Color: <span style={{ backgroundColor: item.color }} className="inline-block w-4 h-4 rounded-full border border-gray-300 "></span>
                    </p>
                    <p className="text-gray-500 ">Size: {item.size}</p>
                  </div>
                  <div className="text-lg font-bold text-gray-900  text-center sm:text-right">
                    <span>Qty: {item.qty}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900  text-center sm:text-right">
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Link href="/cart" className="inline-flex items-center justify-center px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300">
                Edit Cart
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-gray-100  shadow-md rounded-lg p-6">
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 ">Order Summary</h2>
            <ul className="space-y-3">
              {[
                { label: 'Items', value: itemsPrice.toFixed(2) },
                { label: 'Tax', value: taxPrice.toFixed(2) },
                { label: 'Shipping', value: shippingPrice.toFixed(2) },
                { label: 'Total', value: totalPrice.toFixed(2) },
              ].map(({ label, value }) => (
                <li key={label} className="flex justify-between">
                  <span className="font-semibold text-gray-600 ">{label}</span>
                  <span className="text-lg font-medium text-gray-900 ">${value}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => placeOrder()}
              disabled={isPlacing}
              className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-700 transition-all duration-300 relative"
            >
              {isPlacing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                  <span>Placing Order...</span>
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
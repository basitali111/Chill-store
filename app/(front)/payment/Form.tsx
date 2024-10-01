'use client';

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Form = () => {
  const router = useRouter();
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || 'PayPal');
  }, [paymentMethod, router, shippingAddress.address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  return (
    <div>
      <CheckoutSteps current={2} />
      <div className="max-w-xl mx-auto bg-white  my-8 p-6 rounded-lg shadow-md">
        <div className="card-body">
          <h1 className="text-3xl font-extrabold text-gray-900  mb-6">
            Payment
            <span className="bg-gray-200 text-gray-900 text-xl font-semibold ml-2 px-2.5 py-0.5 rounded  ">
              Method
            </span>
          </h1>
          <form onSubmit={handleSubmit}>
            {['PayPal', 'Stripe', 'Cash On Delivery', 'Bank Transfer'].map((payment) => (
              <div key={payment} className="flex items-center mt-4 mb-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio h-5 w-5 text-gray-900  transition duration-150 ease-in-out"
                  value={payment}
                  checked={selectedPaymentMethod === payment}
                  onChange={() => setSelectedPaymentMethod(payment)}
                />
                <label className="ml-3 block text-lg font-medium leading-6 text-gray-900 ">
                  {payment}
                </label>
              </div>
            ))}
            <div className="my-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                Next
              </button>
            </div>
            <div className="my-6">
              <button
                type="button"
                className="w-full py-3 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
                onClick={() => router.back()}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;

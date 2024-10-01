'use client';

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { ShippingAddress } from '@/lib/models/OrderModel';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form';
import Map from '@/components/Map';

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phoneNumber: '', 
      description: '', 
    },
  });

  const [isTyping, setIsTyping] = useState(false);
  const addressInput = watch('address');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
    setValue('phoneNumber', shippingAddress.phoneNumber);
    setValue('description', shippingAddress.description);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push('/payment');
  };

  const handleLocationSelected = (address: string) => {
    setValue('address', address, { shouldValidate: true, shouldDirty: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: keyof ShippingAddress) => {
    const value = e.target.value;
    setValue(id, value, { shouldDirty: true });

    if (id === 'address') {
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
    asTextArea = false,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
    asTextArea?: boolean;
  }) => (
    <div className="mb-6">
      <label
        className="block text-xl font-semibold text-gray-800 mb-2"
        htmlFor={id}
      >
        {name} {id === 'description' && <span className="text-sm text-gray-500">(optional)</span>}
      </label>
      {asTextArea ? (
        <textarea
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
            onChange: (e) => handleInputChange(e, id),
          })}
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-4 text-lg text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 transition duration-150 ease-in-out placeholder-gray-400"
          placeholder={`Enter ${name.toLowerCase()}`}
          rows={4}
        />
      ) : (
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
            onChange: (e) => handleInputChange(e, id),
          })}
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-4 text-lg text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 transition duration-150 ease-in-out placeholder-gray-400"
          placeholder={`Enter ${name.toLowerCase()}`}
        />
      )}
      {errors[id]?.message && (
        <div className="mt-1 text-sm text-red-600">{errors[id]?.message}</div>
      )}
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <CheckoutSteps current={1} />
      <div className="mx-auto max-w-2xl lg:max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden my-10 p-8">
        <div className="px-6 py-4">
          <h1 className="flex items-center justify-center text-4xl font-bold text-gray-900 mb-8">
            Shipping Address
          </h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="Full Name" id="fullName" required />
              <FormInput name="Address" id="address" required />
              <FormInput name="City" id="city" required />
              <FormInput name="Postal Code" id="postalCode" required />
              <FormInput name="Country" id="country" required />
              <FormInput name="Phone Number" id="phoneNumber" required pattern={{ value: /^[0-9]+$/, message: 'Phone number is invalid' }} />
              <FormInput name="Other Detail" id="description" asTextArea />
            </div>
            <Map
              addressInput={addressInput}
              onLocationSelected={handleLocationSelected}
              isTyping={isTyping}
            />
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-8 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner mr-2"></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;

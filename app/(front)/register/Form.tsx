'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

type Inputs = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  image: FileList;
};

const Form = () => {
  const { data: session } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();
  let callbackUrl = params.get('callbackUrl') || '/';
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, username, password, image } = form;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (image && image[0]) {
      formData.append('image', image[0]);
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        );
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email is duplicate'
          : err.message;
      toast.error(error || 'error');
    }
  };

  return (
    <div className="container mx-auto my-14 p-4 max-w-lg">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="flex items-center text-5xl font-extrabold text-black">
          Sign
          <span className="bg-gray-100 text-gray-800 text-2xl font-semibold ml-2 px-2.5 py-0.5 rounded">
            Up
          </span>
        </h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="mb-4 mt-10">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.name?.message && (
              <p className="text-red-600 mt-2">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.email?.message && (
              <p className="text-red-600 mt-2">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register('username', {
                required: 'Username is required',
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.username?.message && (
              <p className="text-red-600 mt-2">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.password?.message && (
              <p className="text-red-600 mt-2">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || 'Passwords should match!';
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-600 mt-2">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="image">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              {...register('image')}
              className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={handleImageChange}
            />
          </div>
          {preview && (
            <div className="mb-4 flex justify-center">
              <img src={preview} alt="Image Preview" className="w-24 h-24 rounded-full object-cover" />
            </div>
          )}
          <div className="mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 relative"
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin text-white text-xl" />
                </div>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-black">
          Already have an account?{' '}
          <Link className="text-gray-800 font-medium hover:underline" href={`/signin?callbackUrl=${callbackUrl}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;

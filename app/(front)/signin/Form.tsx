"use client"
import { signIn, useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  let callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    setIsLoading(true);
    try {
      const { email, password } = form;
      const response = await signIn('credentials', {
        email,
        password,
      });

      if (response?.status && typeof response.status === 'string' && response.status === 'success') {
      
        router.push(callbackUrl);
      } else {
        console.error('Login error:', response?.error);
        setIsLoading(false);
        // Handle login errors here, e.g., display a specific error message
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      // Handle general errors here, e.g., display a generic error message
    }
  };

  return (
    <div className="w-full md:w-6/12 mx-auto my-14 bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h1 className="text-5xl font-extrabold text-black mb-8">
          Sign
          <span className="bg-gray-100 text-gray-800 text-2xl font-semibold ml-2 px-2.5 py-0.5 rounded">
            in
          </span>
        </h1>
        {params.get('error') && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {params.get('error') === 'CredentialsSignin'
              ? 'Invalid email or password'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {params.get('success')}
          </div>
        )}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-4">
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
              className="block w-full rounded-md py-2 px-3 text-black bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.email?.message && (
              <div className="text-red-600 mt-2">{errors.email.message}</div>
            )}
          </div>
          <div className="my-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="block w-full rounded-md py-2 px-3 text-black bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.password?.message && (
              <div className="text-red-600 mt-2">{errors.password.message}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300"
            >
              {isSubmitting && <span className="loading loading-spinner mr-2"></span>}
              Sign in
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center">
          <Link className="text-gray-700 hover:text-black transition duration-300 mb-2" href="/forgot-password">
            Forgot Password?
          </Link>
          <span className="text-gray-600">Need an account?{' '}
            <Link className="text-black font-medium hover:underline" href={`/register?callbackUrl=${callbackUrl}`}>
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
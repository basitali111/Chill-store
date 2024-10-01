'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  email: string;
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const formSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success('Password reset link sent to your email');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error');
    }
  };

  return (
    <div className="w-full md:w-6/12 mx-auto my-14 bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h1 className="flex items-center text-5xl font-extrabold text-black mb-8">
          Forgot
          <span className="bg-gray-100 text-gray-800 text-2xl font-semibold ml-2 px-2.5 py-0.5 rounded">
            Password
          </span>
        </h1>
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
              className="block w-full rounded-md py-3.5 px-2.5 text-black bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.email?.message && (
              <div className="text-red-600 mt-2">{errors.email.message}</div>
            )}
          </div>
          <div className="my-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative flex items-center justify-center px-5 py-3 overflow-hidden font-medium transition-all bg-black text-white rounded-md hover:bg-gray-800"
            >
              {isSubmitting && <span className="loading loading-spinner mr-2"></span>}
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

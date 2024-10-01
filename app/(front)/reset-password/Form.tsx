'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  password: string;
  confirmPassword: string;
};

const Form = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const userId = params.get('id');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const formSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token, password }),
      });

      if (res.ok) {
        toast.success('Password has been reset');
        router.push('/signin');
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
        <h1 className="flex items-center text-5xl font-extrabold text-black">
          Reset
          <span className="bg-gray-100 text-gray-800 text-2xl font-semibold ml-2 px-2.5 py-0.5 rounded">
            Password
          </span>
        </h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-4">
            <label className="block text-lg font-medium text-black mb-2" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="block w-full rounded-md py-3.5 px-2.5 text-black bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.password?.message && (
              <div className="text-red-600 mt-2">{errors.password.message}</div>
            )}
          </div>
          <div className="my-4">
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
              className="block w-full rounded-md py-3.5 px-2.5 text-black bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.confirmPassword?.message && (
              <div className="text-red-600 mt-2">{errors.confirmPassword.message}</div>
            )}
          </div>
          <div className="my-6">
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300">
              {isSubmitting ? (
                <span className="loader"></span>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

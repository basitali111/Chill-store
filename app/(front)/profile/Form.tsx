'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  image: FileList;
};

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
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
      setValue('name', session.user.name!);
      setValue('email', session.user.email!);
      setValue('username', session.user.username!);
      setPreview(session.user.image!);
    }
  }, [router, session, setValue]);

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
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        body: formData,
      });
      if (res.status === 200) {
        toast.success('Profile updated successfully');
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            name,
            email,
            username,
          },
        };
        await update(newSession);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error');
      }
    } catch (err: any) {
      const error =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto my-14 p-4 max-w-lg">
      <div className="bg-gray-900  p-6 rounded-lg shadow-lg">
        <h1 className="flex items-center text-5xl font-extrabold text-white">
          Profile
          <span className="bg-gray-300 text-gray-900 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded ms-2">
            Info
          </span>
        </h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="mb-4 mt-10">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
            {errors.name?.message && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="email">
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
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
            {errors.email?.message && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register('username', {
                required: 'Username is required',
              })}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
            {errors.username?.message && (
              <p className="text-red-600 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
            {errors.password?.message && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || 'Passwords should match!';
                },
              })}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="image">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              {...register('image')}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md"
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
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-white hover:text-gray-900 transition duration-300"
            >
              {isSubmitting ? (
                <span className="loader"></span>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

'use client';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ValidationRule, useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FormProduct extends Omit<Product, 'colors' | 'sizes' | 'rating' | 'numReviews'> {
  colors?: string;
  sizes?: string;
}

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`);
  const router = useRouter();
  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }: { arg: Product }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product updated successfully');
      router.push('/admin/products');
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm<FormProduct>();

  const [uploadedImages, setUploadedImages] = useState<{ url: string; color: string }[]>([]);

  const colors = useWatch({
    control,
    name: 'colors',
    defaultValue: '',
  }) as unknown as string;

  useEffect(() => {
    if (!product) return;
    setValue('name', product.name);
    setValue('slug', product.slug);
    setValue('price', product.price);
    setValue('category', product.category);
    setValue('brand', product.brand);
    setValue('countInStock', product.countInStock);
    setValue('description', product.description);
    setValue('colors', product.colors.join(', '));
    setValue('sizes', product.sizes.join(', '));
    setValue('images', product.images || []);
    setUploadedImages(Array.isArray(product.images) ? product.images : []);
  }, [product, setValue]);

  const formSubmit = async (formData: FormProduct) => {
    const updatedFormData: Product = {
      ...formData,
      colors: formData.colors ? formData.colors.split(',').map((color: string) => color.trim()) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map((size: string) => size.trim()) : [],
      images: uploadedImages,  // Ensure images field is set correctly
      rating: product?.rating || 0, // Set default value for rating
      numReviews: product?.numReviews || 0, // Set default value for numReviews
    };
    await updateProduct(updatedFormData);
  };

  if (error) return error.message;
  if (!product) return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-t-transparent align-[-0.125em] text-gray-800 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >
          Loading...
        </span>
      </div>
    </div>
  );

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof FormProduct;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="md:w-4/5">
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="input input-bordered w-full max-w-md"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      });
      const { signature, timestamp } = await resSign.json();
      const file = e.target.files?.[0];
      if (!file) throw new Error('No file selected');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      const newImage = { url: data.secure_url, color };
      setUploadedImages((prev) => [...(Array.isArray(prev) ? prev : []), newImage]);
      setValue('images', [...(Array.isArray(getValues('images')) ? getValues('images') : []), newImage]);
      toast.success('File uploaded successfully', { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div>
      <h1 className="text-2xl py-4">Edit Product {formatId(productId)}</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="name" required />
          <FormInput name="Slug" id="slug" required />
          <FormInput name="Price" id="price" required />
          <FormInput name="Category" id="category" required />
          <FormInput name="Brand" id="brand" required />
          <FormInput name="Description" id="description" required />
          <FormInput name="Count In Stock" id="countInStock" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="colors">
              Colors
            </label>
            <div className="md:w-4/5">
              <input
                type="text"
                id="colors"
                {...register('colors')}
                className="input input-bordered w-full max-w-md"
                placeholder="Comma separated values"
              />
            </div>
          </div>

          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="sizes">
              Sizes
            </label>
            <div className="md:w-4/5">
              <input
                type="text"
                id="sizes"
                {...register('sizes')}
                className="input input-bordered w-full max-w-md"
                placeholder="Comma separated values"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="imageUpload" className="block mb-2">
              Upload Image
            </label>
            {colors.split(',').map((color: string, index: number) => (
              <div key={index} className="mb-2">
                <input
                  type="file"
                  id={`imageUpload-${color.trim()}`}
                  onChange={(e) => uploadHandler(e, color.trim())}
                  className="file-input"
                />
                <label className="ml-2">{color.trim()}</label>
              </div>
            ))}
            <div className="mt-4 flex flex-wrap">
              {uploadedImages.map((img, index) => (
                <div key={index} className="mr-2">
                  <Image
                    src={img.url}
                    alt={`Color ${img.color}`}
                    width={100}
                    height={100}
                    className="border p-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn bg-gray-800 hover:bg-gray-500 text-white mb-8"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update
          </button>
          <Link className="btn ml-4 " href="/admin/products">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

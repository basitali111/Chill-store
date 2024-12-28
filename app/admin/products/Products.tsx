'use client';
import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function Products() {
  const { data: products, error } = useSWR(`/api/admin/products`);

  const router = useRouter();

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...');
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Product deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    }
  );

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product created successfully');
      router.push(`/admin/products/${data.product._id}`);
    }
  );

  if (error) return 'An error has occurred.';
  if (!products) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          Product
          <span className="ml-2 inline-block bg-gray-200 text-gray-800 text-xl font-semibold px-3 py-1 rounded">
            Details
          </span>
        </h1>
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 transition duration-200"
        >
          Create Product
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-4 text-left font-semibold">ID</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
              <th className="py-3 px-4 text-left font-semibold">Category</th>
              <th className="py-3 px-4 text-left font-semibold">Stock</th>
              <th className="py-3 px-4 text-left font-semibold">Rating</th>
              <th className="py-3 px-4 text-left font-semibold">Colors</th>
              <th className="py-3 px-4 text-left font-semibold">Sizes</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {products.map((product: Product, index: number) => (
              <tr
                key={product._id}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <td className="py-3 px-4">{formatId(product._id!)}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.countInStock}</td>
                <td className="py-3 px-4">{product.rating}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap space-x-2">
                    {product.colors?.map((color, idx) => (
                      <div
                        key={`${color}-${idx}`}
                        style={{ backgroundColor: color }}
                        className="w-6 h-6 rounded-full border border-gray-300 mb-1"
                      ></div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">{product.sizes?.join(', ')}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap space-x-2">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="mb-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct({ productId: product._id! })}
                      className="mb-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

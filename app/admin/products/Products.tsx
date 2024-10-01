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
  }

  return (
    <div className="py-5">
      <div className="flex justify-between items-center">
        <div className='pb-4'>
          <h1 className="flex items-center text-5xl font-extrabold ">Product<span className="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">Details</span></h1>
        </div>

        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className="relative inline-block px-5 py-3 overflow-hidden font-medium bg-gray-800 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-150"
        >
          <span className="relative">Create</span>
        </button>
      </div>

      <div className="relative w-full h-full mt-4 overflow-scroll text-gray-900 bg-gray-200 shadow-md rounded-xl bg-clip-border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-800 text-white ">
                <th className="p-4 border-b-2 border-gray-300">ID</th>
                <th className="p-4 border-b-2 border-gray-300">NAME</th>
                <th className="p-4 border-b-2 border-gray-300">PRICE</th>
                <th className="p-4 border-b-2 border-gray-300">CATEGORY</th>
                <th className="p-4 border-b-2 border-gray-300">COUNT IN STOCK</th>
                <th className="p-4 border-b-2 border-gray-300">RATING</th>
                <th className="p-4 border-b-2 border-gray-300">COLORS</th>
                <th className="p-4 border-b-2 border-gray-300">SIZES</th>
                <th className="p-4 border-b-2 border-gray-300">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product._id} className="even:bg-gray-150 odd:bg-white text-xl">
                  <td className="p-4 border border-gray-300">{formatId(product._id!)}</td>
                  <td className="p-4 border border-gray-300">{product.name}</td>
                  <td className="p-4 border border-gray-300">${product.price}</td>
                  <td className="p-4 border border-gray-300">{product.category}</td>
                  <td className="p-4 border border-gray-300">{product.countInStock}</td>
                  <td className="p-4 border border-gray-300">{product.rating}</td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex space-x-2">
                      {product.colors?.map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          style={{
                            backgroundColor: color,
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '1px solid #000',
                          }}
                        ></div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300">{product.sizes?.join(', ')}</td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/${product._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct({ productId: product._id! })}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
    </div>
  );
}

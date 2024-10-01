'use client';
import { Order } from '@/lib/models/OrderModel';
import Link from 'next/link';
import useSWR from 'swr';

export default function Orders() {
  const { data: orders, error } = useSWR(`/api/admin/orders`);
  if (error) return 'An error has occurred.';
  if (!orders) {
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
      <div className='pb-4'>
        <h1 className="flex items-center text-5xl font-extrabold ">
          Order
          <span className="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded ">
            Details
          </span>
        </h1>
      </div>
      <div className="relative w-full h-full overflow-scroll text-gray-900 bg-gray-200 shadow-md rounded-xl bg-clip-border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 border-b-2 border-gray-300">ID</th>
                <th className="p-4 border-b-2 border-gray-300">USER</th>
                <th className="p-4 border-b-2 border-gray-300">DATE</th>
                <th className="p-4 border-b-2 border-gray-300">TOTAL</th>
                <th className="p-4 border-b-2 border-gray-300">PAID</th>
                <th className="p-4 border-b-2 border-gray-300">DELIVERED</th>
                <th className="p-4 border-b-2 border-gray-300">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order._id} className="even:bg-gray-150 odd:bg-white text-xl">
                  <td className="p-4 border border-gray-300">..{order._id.substring(20, 24)}</td>
                  <td className="p-4 border border-gray-300">{order.user?.name || 'Deleted user'}</td>
                  <td className="p-4 border border-gray-300">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-4 border border-gray-300">${order.totalPrice}</td>
                  <td className="p-4 border border-gray-300">
                    {order.isPaid && order.paidAt ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        {order.paidAt.substring(0, 10)}
                      </span>
                    ) : (
                      <div className="py-1.5 px-2.5 bg-amber-200 rounded-full flex items-center justify-center w-20 gap-1">
                        <svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="2.5" cy="3" r="2.5" fill="#D97706"></circle>
                        </svg>
                        <span className="font-extrabold text-xs text-amber-600">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 border border-gray-300 whitespace-nowrap">
                    {order.isDelivered && order.deliveredAt ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        {order.deliveredAt.substring(0, 10)}
                      </span>
                    ) : (
                      <div className="py-2 px-8 bg-red-200 rounded-full flex w-24 justify-center items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="2.5" cy="3" r="2.5" fill="#DC2626"></circle>
                        </svg>
                        <span className="font-medium text-xs text-red-600">Not Delivered</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <Link href={`/order/${order._id}`} passHref className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group">
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-500 group-hover:translate-x-0 ease">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease text-base font-bold">Details</span>
                      <span className="relative invisible font-bold text-base">Details</span>
                    </Link>
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

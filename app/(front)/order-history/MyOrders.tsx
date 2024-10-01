'use client'

import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function MyOrders() {
  const router = useRouter()
  const { data: orders, error } = useSWR(`/api/orders/mine`)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  if (error) return 'An error has occurred.'
  if (!orders){
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
    <div className=" overflow-x-auto text-gray-700 bg-gray-300 shadow-md rounded-xl bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block text-lg antialiased font-semibold leading-none text-blue-gray-900 opacity-70">
                ID
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block text-lg antialiased font-semibold leading-none text-blue-gray-900 opacity-70">
                DATE
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block  text-lg antialiased font-semibold leading-none text-blue-gray-900 opacity-70">
                TOTAL
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block  text-lg antialiased font-semibold leading-none text-blue-gray-900 opacity-70">
                PAID
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block  text-lg antialiased font-semibold leading-none text-blue-gray-900 opacity-70">
                DELIVERED
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block  text-lg font-semibold  antialiased leading-none text-blue-gray-900 opacity-70">
                ACTION
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id} className="even:bg-blue-gray-50/50">
            <td className="p-6 border border-blue-gray-200">
              <p className="block p-10 text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                {order._id.substring(20, 24)}
              </p>
            </td>
            <td className="p-6 border border-blue-gray-200">
              <p className="block text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                {order.createdAt.substring(0, 10)}
              </p>
            </td>
            <td className="p-6 border border-blue-gray-200">
              <p className="block text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                ${order.totalPrice}
              </p>
            </td>
            <td className="p-6 border border-blue-gray-200">
              <p className="block text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                {order.isPaid && order.paidAt ? order.paidAt.substring(0, 10) : 'Not paid'}
              </p>
            </td>
            <td className="p-6 border border-blue-gray-200">
              <p className="block text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                {order.isDelivered && order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'Not delivered'}
              </p>
            </td>
            <td className="p-6 border border-blue-gray-200">
              <p className="block text-sm antialiased font-semibold leading-normal text-blue-gray-900">
                <Link href={`/order/${order._id}`} passHref>
                  Details
                </Link>
              </p>
            </td>
          </tr>
          
          ))}
        </tbody>
      </table>
    </div>
  )
}

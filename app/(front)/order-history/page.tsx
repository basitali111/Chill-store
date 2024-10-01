import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Order History',
}
export default function OrderHistory() {
  return (
    <>
    <div className='py-5'>
            <h1 className="flex items-center text-5xl font-extrabold ">Order<span className="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">History</span></h1>
      </div>
      <MyOrders />
    </>
  )
}

'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { OrderItem } from '@/lib/models/OrderModel';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BankTransferModal from '@/components/BankTransferModal';

interface OrderDetailsProps {
  orderId: string;
  paypalClientId: string;
}

export default function OrderDetails({ orderId, paypalClientId }: OrderDetailsProps) {
  const { trigger: toggleDeliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/admin/orders/${orderId}/deliver`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order status updated successfully');
      } else {
        toast.error(data.message);
      }
      return data;
    }
  );

  const { trigger: togglePayOrder, isMutating: isPaying } = useSWRMutation(
    `/api/admin/orders/${orderId}/pay`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order status updated successfully');
      } else {
        toast.error(data.message);
      }
      return data;
    }
  );

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [isBankTransferSubmitted, setIsBankTransferSubmitted] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('showBankTransferModal') === 'true') {
      setShowBankTransferModal(true);
    }
  }, [searchParams]);

  const { data, error, mutate } = useSWR(`/api/orders/${orderId}`, {
    onSuccess: (orderData) => {
      if (orderData.bankTransferDetails && orderData.bankTransferDetails.paymentScreenshot) {
        setIsBankTransferSubmitted(orderData.isBankTransferSubmitted);
      }
    },
  });

  if (error) return <div>{error.message}</div>;
  if (!data) return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-t-transparent align-[-0.125em] text-gray-900 motion-reduce:animate-[spin_1.5s_linear_infinite]"
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

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
    bankTransferDetails,
  } = data;

  const handleToggleDeliver = async () => {
    await toggleDeliverOrder();
    mutate({ ...data, isDelivered: !isDelivered, deliveredAt: !isDelivered ? new Date().toISOString() : null }, false);
  };

  const handleTogglePay = async () => {
    await togglePayOrder();
    mutate({ ...data, isPaid: !isPaid, paidAt: !isPaid ? new Date().toISOString() : null }, false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPpp'); // Example: Jul 20, 2024, 3:50 PM
  };

  const handlePaymentSubmitted = () => {
    mutate(); // Update the order details dynamically
  };

  const createPayPalOrder = () => {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  const onApprovePayPalOrder = (data: any) => {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully');
        mutate(); // Update the order details dynamically
      });
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
    setPreviewImage(null);
  };

  return (
    <div className="container mx-auto p-4 overflow-x-hidden">
      <div className="text-center p-4 border-2 border-gray-300 rounded-lg">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 ">
          <mark className="px-2 text-white bg-gray-900 rounded ">Thank You</mark> for Your Order!
        </h1>
        <p className="mb-4 text-xl font-extrabold text-gray-900 ">
          Hey <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">{shippingAddress.fullName}</span>
        </p>
        <p className="text-lg font-normal text-gray-500 ">
          We are thrilled to let you know that your fabulous new clothes are on their way! We can't wait for you to see them and strut your stuff.
        </p>
        <div className="md:flex justify-center mt-2">
          <p className="font-semibold text-gray-500 text-lg underline  decoration-gray-500 mt-1 decoration-double">
            Order Number:
          </p>
          <p>
            <span className="bg-gray-100 text-gray-800 text-base md:text-2xl lg:text-2xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">
              {orderId}
            </span>
          </p>
        </div>
        <p className="text-xl font-bold mt-4">Estimated Delivery: Order will deliver in the next two working days</p>
      </div>

      <div className="md:grid md:grid-cols-4 gap-5 my-4">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-xl font-extrabold text-gray-900 ">
              <mark className="px-4 py-2 text-white bg-gray-900 rounded ">Shipping</mark>
              <span className="bg-gray-100 text-gray-800 text-xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">Address</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {[
                { label: 'Name', value: shippingAddress.fullName },
                { label: 'Address', value: shippingAddress.address },
                { label: 'City', value: shippingAddress.city },
                { label: 'Postal Code', value: shippingAddress.postalCode },
                { label: 'Country', value: shippingAddress.country },
                { label: 'Phone Number', value: shippingAddress.phoneNumber },
                {
                  label: 'Other Detail',
                  value: shippingAddress.description || 'No description provided.',
                },
                {
                  label: 'Delivery Status',
                  value: isDelivered ? `Delivered at ${formatDate(deliveredAt)}` : 'Not Delivered',
                  color: isDelivered ? 'text-green-500' : 'text-red-500',
                },
              ].map(({ label, value, color = 'text-gray-900' }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-semibold text-gray-500 text-lg underline  decoration-gray-500 mt-1 decoration-double">
                    {label}
                  </span>
                  <span className={`text-xl font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-xl font-extrabold text-gray-900 ">
              <mark className="px-4 py-2 text-white bg-gray-900 rounded ">Payment</mark>
              <span className="bg-gray-100 text-gray-800 text-xl font-semibold me-2 px-2.5 py-0.5 rounded   ms-2">Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {[
                { label: 'Payment Method', value: paymentMethod },
                {
                  label: 'Paid Status',
                  value: isPaid
                    ? `Paid at ${formatDate(paidAt)}`
                    : isBankTransferSubmitted
                    ? 'Awaiting approval'
                    : 'Not Paid',
                  color: isPaid ? 'text-green-500' : 'text-red-500',
                },
              ].map(({ label, value, color = 'text-gray-900' }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-semibold text-gray-500 text-lg underline  decoration-gray-500 mt-1 decoration-double">
                    {label}
                  </span>
                  <span className={`text-xl font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
            {!isPaid && paymentMethod === 'Bank Transfer' && !isBankTransferSubmitted && (
              <div className="mt-4">
                <button
                  onClick={() => setShowBankTransferModal(true)}
                  className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Complete Bank Transfer
                </button>
              </div>
            )}
          </div>

          {session?.user.isAdmin && bankTransferDetails && (
            <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
              <h2 className="mb-4 text-xl font-extrabold text-gray-900 ">
                <mark className="px-4 py-2 text-white bg-gray-900 rounded ">Bank Transfer Details</mark>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                {[
                  { label: 'Bank Name', value: bankTransferDetails.bankName },
                  { label: 'Account Number', value: bankTransferDetails.accountNumber },
                  { label: 'Account Name', value: bankTransferDetails.accountName },
                  {
                    label: 'Payment Screenshot',
                    value: (
                      <img
                        src={bankTransferDetails.paymentScreenshot}
                        alt="Payment Screenshot"
                        className="rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(bankTransferDetails.paymentScreenshot)}
                      />
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-semibold text-gray-500 text-lg underline  decoration-gray-500 mt-1 decoration-double">
                      {label}
                    </span>
                    <span className="text-xl font-bold">{typeof value === 'string' ? value : ''}</span>
                    {typeof value !== 'string' && value}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg  border-2 border-gray-300 p-6">
            <h2 className="mb-4 text-xl font-extrabold text-gray-900 ">
              <mark className="px-4 py-2 text-white bg-gray-900 rounded ">Products</mark>
              <span className="bg-gray-100 text-gray-800 text-xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">Details</span>
            </h2>
            <div className="hidden sm:flex sm:items-center sm:justify-between font-semibold text-gray-500  mb-4">
              <div className="w-2/5">Item</div>
              <div className="w-1/5">Color</div>
              <div className="w-1/5">Size</div>
              <div className="w-1/5">Quantity</div>
              <div className="w-1/5">Price</div>
            </div>
            <div className="space-y-6">
              {items.map((item: OrderItem) => (
                <div key={item.slug} className="flex flex-col border-b pb-4 mb-4 sm:flex-row sm:items-center sm:space-x-4">
                  <div className="flex items-center sm:w-2/5">
                    <Link href={`/product/${item.slug}`}>
                      <Image src={item.image} alt={item.name} width={100} height={100} className="w-24 h-24 object-cover rounded-md" />
                    </Link>
                    <div className="ml-4">
                      <Link href={`/product/${item.slug}`}>
                        <p className="text-xl font-bold mt-2">{item.name}</p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0 sm:w-1/5">
                    <div
                      style={{
                        backgroundColor: item.color,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px solid #000',
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:w-1/5">
                    <span className="text-xl font-bold">{item.size}</span>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:w-1/5">
                    <span className="text-xl font-bold">X{item.qty}</span>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:w-1/5">
                    <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-100  shadow-md rounded-lg p-6">
            <h2 className="text-xl font-extrabold text-gray-900  mb-4">Order Summary</h2>
            <ul>
              {[
                { label: 'Items', value: itemsPrice.toFixed(2) },
                { label: 'Tax', value: taxPrice.toFixed(2) },
                { label: 'Shipping', value: shippingPrice.toFixed(2) },
                { label: 'Total', value: totalPrice.toFixed(2) },
              ].map(({ label, value }) => (
                <li key={label} className="mb-2 flex justify-between">
                  <div className="font-semibold text-gray-500 text-lg underline  decoration-gray-500 mt-1 decoration-double">
                    {label}
                  </div>
                  <div className="text-xl font-bold">${value}</div>
                </li>
              ))}
              {!isPaid && paymentMethod === 'PayPal' && (
                <li>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons createOrder={createPayPalOrder} onApprove={onApprovePayPalOrder} />
                  </PayPalScriptProvider>
                </li>
              )}
              {session?.user.isAdmin && (
                <>
                  <li>
                    <button
                      className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
                      onClick={handleTogglePay}
                      disabled={isPaying}
                    >
                      {isPaying ? 'Processing...' : isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full py-3 px-4 mt-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
                      onClick={handleToggleDeliver}
                      disabled={isDelivering}
                    >
                      {isDelivering ? 'Processing...' : isDelivered ? 'Mark as Not Delivered' : 'Mark as Delivered'}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {showBankTransferModal && (
        <BankTransferModal
          orderId={orderId}
          onClose={() => setShowBankTransferModal(false)}
          onPaymentSubmitted={handlePaymentSubmitted}
        />
      )}

      {isImagePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative">
            <button
              onClick={handleCloseImagePreview}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              ×
            </button>
            <img src={previewImage || ''} alt="Payment Screenshot Preview" className="max-w-full max-h-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
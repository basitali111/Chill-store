import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';

interface BankTransferModalProps {
  orderId: string;
  onClose: () => void;
  onPaymentSubmitted: () => void;
}

type Inputs = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  paymentScreenshotUrl: string; // Store Cloudinary URL
};

const BankTransferModal: React.FC<BankTransferModalProps> = ({
  orderId,
  onClose,
  onPaymentSubmitted,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [preview, setPreview] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'zkilr1qk');

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await res.json();
        setValue('paymentScreenshotUrl', data.secure_url); // Set the uploaded image URL
        setPreview(data.secure_url); // Show preview
        toast.success('Image uploaded successfully!');
      } catch (err) {
        toast.error('An error occurred while uploading the image.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleImageClick = () => {
    if (preview) {
      setIsImagePreviewOpen(true);
    }
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setValue('paymentScreenshotUrl', ''); // Clear Cloudinary URL
    setIsImagePreviewOpen(false);
  };

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { bankName, accountNumber, accountName, paymentScreenshotUrl } = form;

    // Ensure all fields are present
    if (!bankName || !accountNumber || !accountName || !paymentScreenshotUrl) {
      toast.error('All fields are required');
      return;
    }

    const requestData = {
      bankName,
      accountNumber,
      accountName,
      paymentScreenshotUrl,
    };

    try {
      const res = await fetch(`/api/orders/${orderId}/bank-transfer`, {
        method: 'PUT', // Ensure method is PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error submitting payment details');
      }

      // Success handling
      toast.success('Payment details uploaded successfully. Awaiting approval.');
      onPaymentSubmitted();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl relative">
        <h2 className="text-lg font-bold mb-4 text-center">Bank Transfer Details</h2>
        <form onSubmit={handleSubmit(formSubmit)} className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="text-base font-medium mb-2">User & Order Details</h3>
            <div className="mb-3">
              <p><strong>Order ID:</strong> {orderId}</p>
            </div>
            <h3 className="text-base font-medium mb-2">Our Bank Details</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Bank Name:</strong> Your Bank Name</p>
              <p><strong>IBAN:</strong> Your IBAN</p>
              <p><strong>SWIFT Code:</strong> Your SWIFT Code</p>
              <p><strong>Account Number:</strong> Your Account Number</p>
              <p><strong>Account Name:</strong> Your Account Name</p>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="paymentScreenshot">
                Upload Payment Screenshot
              </label>
              <input
                type="file"
                id="paymentScreenshot"
                {...register('paymentScreenshotUrl')}
                className="w-full p-1.5 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                onChange={handleImageChange}
                disabled={imageUploading}
              />
              {imageUploading && <p className="text-blue-600 mt-1 text-sm">Uploading image...</p>}
              {preview && (
                <div className="mt-3 flex items-center">
                  <Image
                    src={preview}
                    alt="Payment Screenshot Preview"
                    width={60}
                    height={60}
                    className="rounded-lg object-cover cursor-pointer"
                    onClick={handleImageClick}
                  />
                  <button
                    type="button"
                    className="ml-3 py-1 px-3 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    onClick={handleDeleteImage}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="bankName">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                {...register('bankName', { required: 'Bank name is required' })}
                className="w-full p-1.5 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
              />
              {errors.bankName && (
                <p className="text-red-600 mt-1 text-sm">{errors.bankName.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="accountNumber">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                {...register('accountNumber', { required: 'Account number is required' })}
                className="w-full p-1.5 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
              />
              {errors.accountNumber && (
                <p className="text-red-600 mt-1 text-sm">{errors.accountNumber.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor="accountName">
                Account Name
              </label>
              <input
                type="text"
                id="accountName"
                {...register('accountName', { required: 'Account name is required' })}
                className="w-full p-1.5 border border-gray-300 rounded-md text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
              />
              {errors.accountName && (
                <p className="text-red-600 mt-1 text-sm">{errors.accountName.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="py-1.5 px-3 bg-gray-700 text-white font-semibold rounded-lg text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={onClose}
                disabled={isSubmitting || imageUploading}
              >
                Close
              </button>
              <button
                type="submit"
                className="py-1.5 px-3 bg-gray-900 text-white font-semibold rounded-lg text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-150 ease-in-out"
                disabled={isSubmitting || imageUploading}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span className="loader mr-1.5"></span> Uploading...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </form>
        {isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center rounded-lg">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isImagePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative">
            <Image src={preview!} alt="Full Preview" layout="fill" className="max-w-full max-h-screen rounded-lg" />
            <button
              className="absolute top-0 right-0 m-2 text-white text-2xl"
              onClick={handleCloseImagePreview}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransferModal;

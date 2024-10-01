import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        color: { type: String, required: true }, // Add color field
        size: { type: String, required: true }, // Add size field
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true }, // Added phoneNumber field
      description: { type: String }, // Added optional description field
    },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    bankTransferDetails: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
      paymentScreenshot: { type: String },
    },
    isBankTransferSubmitted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

export type Order = {
  _id: string;
  user?: { name: string };
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    description?: string;
  };
  paymentMethod: string;
  paymentResult?: { id: string; status: string; email_address: string };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  bankTransferDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    paymentScreenshot: string;
  };
  isBankTransferSubmitted: { type: Boolean, default: false },
  createdAt: string;
};

export type OrderItem = {
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: number;
  color: string;
  size: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string; 
  description?: string; 
};
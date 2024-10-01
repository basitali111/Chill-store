import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split('/').at(-2); // Extract the order ID from the URL

  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'Invalid order ID' }), { status: 400 });
  }

  const { bankName, accountNumber, accountName, paymentScreenshotUrl } = await req.json();

  await dbConnect();
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return new NextResponse(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    // Update the bank transfer details
    order.bankTransferDetails = {
      bankName,
      accountNumber,
      accountName,
      paymentScreenshot: paymentScreenshotUrl, // Use the provided URL
    };
    order.isBankTransferSubmitted = true;

    const updatedOrder = await order.save();

    return new NextResponse(JSON.stringify({ message: 'Bank transfer details updated successfully', order: updatedOrder }));
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ message: err.message }), { status: 500 });
  }
}) as any;

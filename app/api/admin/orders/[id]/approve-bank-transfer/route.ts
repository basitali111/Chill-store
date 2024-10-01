import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = false; // Disable revalidation
export const runtime = 'nodejs'; // Use Node.js runtime

export const PUT = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return new NextResponse(
      JSON.stringify({ message: 'Order ID is required' }),
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: 'Order not found' }),
        { status: 404 }
      );
    }

    order.isBankTransferApproved = true;
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    return new NextResponse(
      JSON.stringify({ message: 'Bank transfer approved successfully', order }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
};

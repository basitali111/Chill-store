import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  try {
    await dbConnect();

    const order = await OrderModel.findById(params.id);
    if (order) {
      if (!order.isPaid)
        return new Response(
          JSON.stringify({ message: 'Order is not paid' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      return new Response(
        JSON.stringify(updatedOrder),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Order not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}) as any;

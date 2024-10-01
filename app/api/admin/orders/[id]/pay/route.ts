import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { sendEmail } from '@/lib/utils/sendEmail'; // Import the sendEmail utility

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

    // Populate the user field to access the user's email
    const order = await OrderModel.findById(params.id).populate('user');
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();

      // Check if the user's email is defined before sending the email
      if (order.user && order.user.email) {
        await sendEmail(
          order.user.email,
          'Order Marked as Paid',
          `<p>Your order ${order._id} has been marked as paid.</p>`
        );
      } else {
        console.error('User email is not defined for order:', order._id);
      }

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

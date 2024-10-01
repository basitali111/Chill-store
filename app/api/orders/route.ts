import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import { round2 } from '@/lib/utils';

const calcPrices = (orderItems: OrderItem[]) => {
  // Calculate the items price
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Calculate the shipping price
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  // Calculate the tax price
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));
  // Calculate the total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  const { user } = req.auth;
  try {
    const payload = await req.json();
    await dbConnect();

    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      'price'
    );

    const dbOrderItems = payload.items.map((x: { _id: string }) => {
      const product = dbProductPrices.find((product) => product._id.toString() === x._id);

      if (!product) {
        throw new Error(`Product with ID ${x._id} not found`);
      }

      return {
        ...x,
        product: x._id,
        price: product.price, // Safely access price
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: {
        fullName: payload.shippingAddress.fullName,
        address: payload.shippingAddress.address,
        city: payload.shippingAddress.city,
        postalCode: payload.shippingAddress.postalCode,
        country: payload.shippingAddress.country,
        phoneNumber: payload.shippingAddress.phoneNumber,  // Ensure this is included
        description: payload.shippingAddress.description,  // Ensure this is included
      },
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();
    console.log('Order created successfully:', createdOrder);

    return Response.json(
      { message: 'Order has been created', order: createdOrder },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    console.error('Error creating order:', err);
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;


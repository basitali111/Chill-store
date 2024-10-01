import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'unauthorized' }),
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  const product = await ProductModel.findById(params.id);
  if (!product) {
    return new Response(
      JSON.stringify({ message: 'product not found' }),
      {
        status: 404,
      }
    );
  }
  return new Response(JSON.stringify(product), { status: 200 });
}) as any;

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'unauthorized' }),
      {
        status: 401,
      }
    );
  }

  const {
    name,
    slug,
    price,
    category,
    images,
    brand,
    countInStock,
    description,
    colors,
    sizes,
  } = await req.json();

  try {
    await dbConnect();

    const product = await ProductModel.findById(params.id);
    if (product) {
      product.name = name;
      product.slug = slug;
      product.price = price;
      product.category = category;
      product.images = images;
      product.brand = brand;
      product.countInStock = countInStock;
      product.description = description;
      product.colors = colors;
      product.sizes = sizes;
      
      const updatedProduct = await product.save();
      return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ message: 'Product not found' }),
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message }),
      {
        status: 500,
      }
    );
  }
}) as any;

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'unauthorized' }),
      {
        status: 401,
      }
    );
  }

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (product) {
      await product.deleteOne();
      return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ message: 'Product not found' }),
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message }),
      {
        status: 500,
      }
    );
  }
}) as any;

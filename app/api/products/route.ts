// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'toprated';
  const pageSize = 6;

  const sortOptions: Record<string, any> = {
    toprated: { rating: -1, numReviews: -1 },
    latest: { createdAt: -1 },
  };

  try {
    const products = await ProductModel.find({})
      .sort(sortOptions[sort])
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, slug, price, category, images, brand, countInStock, description, rating, numReviews, colors, sizes } = body;

    const newProduct = new ProductModel({
      name,
      slug,
      price,
      category,
      images,
      brand,
      countInStock,
      description,
      rating,
      numReviews,
      colors,
      sizes,
    });

    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}

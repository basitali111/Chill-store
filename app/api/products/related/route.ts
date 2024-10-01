// app/api/products/related/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  if (!category) {
    return NextResponse.json({ message: 'Category is required' }, { status: 400 });
  }

  try {
    const relatedProducts = await ProductModel.find({ category }).limit(10).lean();
    return NextResponse.json({ relatedProducts });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch related products' }, { status: 500 });
  }
}

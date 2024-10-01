import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  await dbConnect();

  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
  }

  try {
    const product = await ProductModel.findOne({ slug }).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name image',
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ reviews: product.reviews });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Failed to fetch reviews', error: errorMessage }, { status: 500 });
  }
}

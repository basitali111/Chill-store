import { NextRequest, NextResponse } from 'next/server';
import productService from '@/lib/services/productService';

export async function GET(req: NextRequest) {
  try {
    const categoriesWithImages = await productService.getCategoriesWithImages();
    return NextResponse.json(categoriesWithImages);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch categories with images' }, { status: 500 });
  }
}

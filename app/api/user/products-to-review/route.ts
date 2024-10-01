// app/api/user/products-to-review/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ReviewModel from '@/lib/models/ReviewModel';
import ProductModel from '@/lib/models/ProductModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch orders for the user
   
    const orders = await OrderModel.find({ user: req.auth.user._id }).populate('items.product');
  

    // Fetch reviews by the user
 
    const userReviews = await ReviewModel.find({ user: req.auth.user._id }).select('product');
   

    // Get IDs of products that the user has already reviewed
    const reviewedProductIds = new Set(userReviews.map((review) => review.product.toString()));
    
    // Filter products the user has purchased but not reviewed
    const productsToReview = orders
      .flatMap((order) => order.items.map((item: { product: any }) => item.product))
      .filter((product) => product && !reviewedProductIds.has(product._id.toString()));

    

    // Fetch detailed product information for the products to review
    const products = await ProductModel.find({
      _id: { $in: productsToReview.map((p) => p._id) },
    });

   
    return NextResponse.json({ productsToReview: products });
  } catch (error) {
    console.error('Error fetching products to review:', error);
    return NextResponse.json({ message: 'Failed to fetch products to review' }, { status: 500 });
  }
});

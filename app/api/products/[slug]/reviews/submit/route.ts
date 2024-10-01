import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReviewModel from '@/lib/models/ReviewModel';
import ProductModel from '@/lib/models/ProductModel';
import OrderModel from '@/lib/models/OrderModel';
import { reviewSchema } from '@/lib/validateReview';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  await dbConnect();

  try {
    const { user, rating, comment } = await req.json();
    const slug = params.slug;

    if (!slug) {
      console.log('Error: Slug is required');
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    console.log('Request body:', { user, rating, comment });
    console.log('Slug:', slug);

    // Validate request body
    const { error } = reviewSchema.validate({ user, rating, comment });
    if (error) {
      console.log('Validation error:', error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Ensure rating is a number
    const numericRating = parseFloat(rating);
    console.log('Parsed numeric rating:', numericRating, 'Type:', typeof numericRating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      console.log('Invalid rating value:', numericRating);
      return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 });
    }

    const product = await ProductModel.findOne({ slug });
    if (!product) {
      console.log('Product not found');
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    console.log('Product found:', product);

    // Check if user has already reviewed the product
    const existingReview = await ReviewModel.findOne({ user, product: product._id });
    if (existingReview) {
      console.log('User has already reviewed this product');
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = new ReviewModel({
      user,
      product: product._id,
      rating: numericRating,
      comment,
    });

    console.log('Check if rating is a number before saving:', review.rating, 'Type:', typeof review.rating);
    console.log('Review to save:', review);

    const savedReview = await review.save();
    console.log('Saved review rating:', savedReview.rating, 'Type:', typeof savedReview.rating);

    // Update product reviews and rating
    const updatedReviews = await ReviewModel.find({ product: product._id });
    product.reviews = updatedReviews.map((rev) => rev._id);
    product.numReviews = updatedReviews.length;
    product.rating = updatedReviews.reduce((acc, rev) => rev.rating + acc, 0) / updatedReviews.length;

    console.log('Updated product rating:', product.rating, 'Type:', typeof product.rating);

    await product.save();

    console.log('Review saved:', savedReview);
    return NextResponse.json(savedReview);
  } catch (error) {
    console.error('Error submitting review:', (error as Error).message);
    return NextResponse.json({ message: 'Failed to submit review', error: (error as Error).message }, { status: 500 });
  }
}

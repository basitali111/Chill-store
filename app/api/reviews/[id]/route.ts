// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReviewModel from '@/lib/models/ReviewModel';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Extract the id from the URL

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
  }

  const { rating, comment, userId } = await req.json(); // Assume the user ID is passed in the request body

  try {
    const review = await ReviewModel.findById(id);
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (review.user.toString() !== userId) {
      return NextResponse.json({ message: 'You can only edit your own review' }, { status: 403 });
    }

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Extract the id from the URL

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid review ID:', id);
    return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
  }

  const { userId } = await req.json(); // Assume the user ID is passed in the request body

  try {
    const review = await ReviewModel.findById(id);
    if (!review) {
      console.log('Review not found for ID:', id);
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (review.user.toString() !== userId) {
      return NextResponse.json({ message: 'You can only delete your own review' }, { status: 403 });
    }

    await review.deleteOne();
    console.log('Review deleted successfully for ID:', id);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json({ message: 'Failed to delete review', error: (error as Error).message }, { status: 500 });
  }
}
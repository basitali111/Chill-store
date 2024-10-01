// app/api/user/reviews/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReviewModel from '@/lib/models/ReviewModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Count reviews made by the user
    const reviewCount = await ReviewModel.countDocuments({ user: req.auth.user._id });

    return NextResponse.json({ count: reviewCount });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch review count' }, { status: 500 });
  }
});

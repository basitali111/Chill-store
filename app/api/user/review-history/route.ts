// app/api/user/review-history/route.ts

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
    const reviews = await ReviewModel.find({ user: req.auth.user._id })
      .populate('product', 'name slug')
      .exec();

    return NextResponse.json({ reviewHistory: reviews });
  } catch (error) {
    console.error('Error fetching review history:', error);
    return NextResponse.json({ message: 'Failed to fetch review history' }, { status: 500 });
  }
});

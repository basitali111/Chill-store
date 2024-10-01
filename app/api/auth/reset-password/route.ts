import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';

export const POST = async (req: NextRequest) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { userId, token, password } = await req.json();

  const user = await UserModel.findById(userId);

  if (!user || user.resetPasswordToken !== token || user.resetPasswordExpiry < Date.now()) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 5);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  return NextResponse.json({ message: 'Password has been reset' });
};


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import crypto from 'crypto';
import { sendEmail } from '@/lib/utils/sendEmail';

export const POST = async (req: NextRequest) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { email } = await req.json();
  const user = await UserModel.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = resetTokenExpiry;
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user._id}`;

  const emailContent = `
    <p>You requested a password reset. Please use the following link to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
  `;

  try {
    await sendEmail(user.email, 'Password Reset Request', emailContent);
    return NextResponse.json({ message: 'Password reset link sent' });
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
};

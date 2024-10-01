import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = false; // Disable revalidation
export const runtime = 'nodejs'; // Use Node.js runtime

const parseFormData = async (request: NextRequest) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const image = formData.get('image') as File;

  if (!name || !email || !username || !password) {
    throw new Error('All fields are required');
  }

  return { name, email, username, password, image };
};

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, username, password, image } = await parseFormData(request);
    await dbConnect();
    const hashedPassword = await bcrypt.hash(password, 5);

    let imageUrl = '';
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ upload_preset: 'zkilr1qk' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        stream.end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newUser = new UserModel({
      name,
      email,
      username,
      password: hashedPassword,
      image: imageUrl,
    });

    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: 'User has been created' }),
      { status: 201 }
    );
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
};

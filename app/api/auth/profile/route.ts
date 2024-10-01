import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import cloudinary from '@/lib/cloudinary';
import { NextResponse, NextRequest } from 'next/server';

const parseFormData = async (request: NextRequest) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const image = formData.get('image') as File;

  return { name, email, username, password, image };
};

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }
  const { user } = req.auth;
  const { name, email, username, password, image } = await parseFormData(req);
  await dbConnect();
  try {
    const dbUser = await UserModel.findById(user._id);
    if (!dbUser) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    let imageUrl = dbUser.image;
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

    dbUser.name = name;
    dbUser.email = email;
    dbUser.username = username;
    dbUser.password = password ? await bcrypt.hash(password, 5) : dbUser.password;
    dbUser.image = imageUrl;
    await dbUser.save();

    return new NextResponse(JSON.stringify({ message: 'User has been updated' }));
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ message: err.message }), { status: 500 });
  }
}) as any;

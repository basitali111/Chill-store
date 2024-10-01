import mongoose from 'mongoose';

export type User = {
  _id: string;
  name: string;
  email: string;
  username: string; // Add username here
  image: string; // Add image field
  isAdmin: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: number;
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Add image field
      required: false,
    },
    isAdmin: { type: Boolean, required: true, default: false },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiry: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;

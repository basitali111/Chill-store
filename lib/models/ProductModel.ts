import mongoose from 'mongoose';

// Define product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    images: { type: [{ url: String, color: String }], required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure rating is a number
productSchema.pre('save', function (next) {
  if (this.rating) {
    this.rating = Number(this.rating);
    console.log('Pre-save middleware product rating:', this.rating, 'Type:', typeof this.rating);
  }
  next();
});

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  images: { url: string; color: string }[];
  banner?: string;
  price: number;
  brand: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  colors?: string[];
  sizes?: string[];
  reviews?: string[];
};

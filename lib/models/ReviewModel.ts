import mongoose from 'mongoose';

// Define review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: function (v: number) {
          console.log('Validating rating:', v, 'Type:', typeof v);
          return !isNaN(v) && v >= 1 && v <= 5;
        },
        message: (props: { value: any; }) => `${props.value} is not a valid rating! Rating should be between 1 and 5.`,
      },
    },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure rating is a number
reviewSchema.pre('save', function (next) {
  if (this.rating) {
    this.rating = Number(this.rating);
    console.log('Pre-save middleware rating:', this.rating, 'Type:', typeof this.rating);
  }
  next();
});

const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default ReviewModel;

export type Review = {
  _id?: string;
  user: { _id: string; name: string; image: string };
  product: string;
  rating: number;
  comment: string;
};

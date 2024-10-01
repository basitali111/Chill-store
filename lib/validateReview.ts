// lib/validateReview.ts
import Joi from 'joi';

export const reviewSchema = Joi.object({
  user: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5).error(new Error('Invalid rating value (must be between 1 and 5)')),
  comment: Joi.string().allow(''), // Allow empty comment
});

export const validateReview = (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

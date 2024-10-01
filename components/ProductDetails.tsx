'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { convertDocToObj } from '@/lib/utils';
import { Product } from '@/lib/models/ProductModel';
import Rating from '@/components/products/Rating';
import AddToCartButton from './products/AddToCart';
import ProductCard from './products/ProductCard';

type ProductDetailsProps = {
  product: Product | null;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { data: session } = useSession();
  const [selectedColors, setSelectedColors] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0]?.url ?? '');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  const [magnifierVisible, setMagnifierVisible] = useState<boolean>(false);
  const [magnifierPosition, setMagnifierPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (product) {
      if (product.images.length > 0) {
        setSelectedImage(product.images[0].url);
        if (product.colors && product.colors.length > 0) {
          setSelectedColors(product.colors[0]);
        }
      }
      fetchRelatedProducts(product.category);
      fetchReviews(product.slug);
      checkIfUserPurchased(product.slug);
      checkIfUserReviewed(product.slug);
    }
  }, [product]);

  const fetchRelatedProducts = async (category: string) => {
    try {
      const response = await fetch(`/api/products/related?category=${category}`);
      const data = await response.json();
      setRelatedProducts(data.relatedProducts);
    } catch (error) {
      console.error('Failed to fetch related products', error);
    }
  };

  const fetchReviews = async (slug: string) => {
    try {
      const response = await fetch(`/api/products/${slug}/reviews`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        console.error('Error fetching reviews:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  const checkIfUserPurchased = async (slug: string) => {
    try {
      const response = await fetch(`/api/orders/mine`);
      const orders = await response.json();
      const hasPurchased = orders.some(
        (order: any) => order.items.some((item: any) => item.slug === slug && order.isDelivered)
      );
      setHasPurchased(hasPurchased);
    } catch (error) {
      console.error('Failed to check if user purchased', error);
    }
  };

  const checkIfUserReviewed = async (slug: string) => {
    if (!session || !session.user) return;

    try {
      const response = await fetch(`/api/products/${slug}/reviews`);
      const data = await response.json();
      if (response.ok) {
        const userReview = data.reviews.find((review: any) => review.user._id === session.user._id);
        setHasReviewed(!!userReview);
      } else {
        console.error('Error fetching reviews:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const { top, left, width, height } = imageRef.current.getBoundingClientRect();
      const x = e.pageX - left - window.pageXOffset;
      const y = e.pageY - top - window.pageYOffset;

      // Ensure the magnifier isnly visible when the cursor is inside the image bounds
      if (x >= 0 && y >= 0 && x <= width && y <= height) {
        setMagnifierVisible(true);
        setMagnifierPosition({ x: (x / width) * 100, y: (y / height) * 100 });
      } else {
        setMagnifierVisible(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setMagnifierVisible(true);
  };

  const handleMouseLeave = () => {
    setMagnifierVisible(false);
  };

  const handleSubmitReview = async () => {
    if (!product) return;

    if (!rating || !comment) {
      return toast.error('Please enter a rating and comment');
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast.error('Invalid rating. Please enter a number between 1 and 5.');
      return;
    }

    const numericRating = Number(rating);

    try {
      const response = await fetch(`/api/products/${product.slug}/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: session?.user._id,
          rating: numericRating,
          comment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        fetchReviews(product.slug);
        setRating(0);
        setComment('');
        setHasReviewed(true);
        toast.success('Review submitted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to submit the review', error);
      toast.error('Failed to submit the review');
    }
  };

  const handleEditReview = async (id: string) => {
    if (!product) return;

    if (!rating || !comment) {
      return toast.error('Please enter a rating and comment');
    }

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment,
          userId: session?.user._id,
        }),
      });

      if (response.ok) {
        fetchReviews(product.slug);
        setRating(0);
        setComment('');
        setEditingReview(null);
        toast.success('Review updated successfully');
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to edit review', error);
      toast.error('Failed to edit review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!product) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user._id }),
      });

      if (response.ok) {
        fetchReviews(product.slug);
        setHasReviewed(false);
        toast.success('Review deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      toast.error('Failed to delete review');
    }
  };

  if (!product) {
    return <div className="text-center text-lg text-gray-500">Product not found</div>;
  }

  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];

  const handleColorChange = (color: string) => {
    const image = product.images.find((img) => img.color === color);
    if (image) {
      setSelectedImage(image.url);
    }
    setSelectedColors(color);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(size);
  };

  const isDisabled = !selectedColors || !selectedSizes;

  return (
    <div className="font-sans bg-gray-100 py-8">
      <div className="p-4 w-[100%] mx-auto bg-white rounded-lg shadow-lg">
        <Link href="/" passHref>
          <button
            type="button"
            className="w-full flex items-center justify-center px-5 py-2 text-base font-medium text-gray-700 transition-colors duration-200 bg-gray-200 border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-300  mb-6"
          >
            <svg
              className="w-5 h-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </Link>
        <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-12">
          <div
            className="w-full lg:sticky top-0 flex gap-4 relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative">
              <img
                ref={imageRef}
                src={selectedImage}
                alt={product.name}
                className="w-[95%] rounded-lg object-cover shadow-lg border border-gray-200"
              />
              {magnifierVisible && imageRef.current && (
                <div
                  className="absolute z-10 w-32 h-32 bg-white shadow-xl border border-gray-300 rounded-lg overflow-hidden pointer-events-none"
                  style={{
                    transform: `translate(-50%, -50%)`,
                    top: `${magnifierPosition.y}%`,
                    left: `${magnifierPosition.x}%`,
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: `${imageRef.current.offsetWidth * 2}px ${
                      imageRef.current.offsetHeight * 2
                    }px`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                ></div>
              )}
            </div>
            <div className="w-32 flex flex-col gap-3">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Color ${img.color}`}
                  className={`w-full cursor-pointer rounded-lg transition-all duration-200 ${
                    selectedImage === img.url ? 'border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(img.url)}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">{product.name}</h2>
            <div className="mt-4">
              <h3 className="text-gray-700 text-2xl font-semibold">${product.price.toFixed(2)}</h3>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Available Sizes</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-12 h-11 border-2 hover:border-blue-500 font-semibold text-sm text-gray-800 rounded-lg flex items-center justify-center shrink-0 transition duration-150 ${
                      selectedSizes === size ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Available Colors</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-12 h-11 border-2 rounded-lg shrink-0 transition duration-150 ${
                      selectedColors === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  ></button>
                ))}
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <AddToCartButton
                product={convertDocToObj(product)}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                selectedImage={selectedImage}
                isDisabled={isDisabled}
              />
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800">Customer Rating</h3>
              <div className="flex items-center gap-2">
                <Rating value={product.rating} onChange={() => {}} />
                <span className="text-gray-600">({product.numReviews} reviews)</span>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800">Product Description</h3>
              <p className="text-base text-gray-600 mt-2 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  mt-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="space-y-6 mt-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.user.image || '/images/default-avatar.jpg'}
                      alt={review.user.name || 'User Avatar'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{review.user.name}</h3>
                      <Rating value={review.rating} onChange={() => {}} />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{review.comment}</p>
                  {(session?.user && (session.user._id === review.user._id || session.user.isAdmin)) && (
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                        onClick={() => {
                          setRating(review.rating);
                          setComment(review.comment);
                          setEditingReview(review._id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
          {hasPurchased && (!hasReviewed || editingReview) && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingReview ? 'Edit Your Review' : 'Leave a Review'}
              </h3>
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center">
                  <Rating value={rating} onChange={(value: number) => setRating(Number(value))} />
                </div>
                <textarea
                  className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  rows={4}
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button
                  className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  onClick={editingReview ? () => handleEditReview(editingReview) : handleSubmitReview}
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductDetails;

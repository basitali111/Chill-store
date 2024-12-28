'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/models/ProductModel';
import ProductItem from '@/components/products/ProductItem';
import ProductCard from '@/components/products/ProductCard';
import Loader from '@/components/Loader';
import Image from 'next/image';


interface ClientComponentProps {
  latestProducts: Product[];
  categoriesWithImages: { category: string; image: string | null }[];
}

const ClientComponent: React.FC<ClientComponentProps> = ({
  latestProducts,
  categoriesWithImages,
}) => {
  const router = useRouter();

  // State for "Just For You" products
  const [justForYouProducts, setJustForYouProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To track if more products are available

  /**
   * Load More Products (useCallback to fix ESLint warnings,
   * re-run only when `page` or `hasMore` changes)
   */
  const loadMoreProducts = useCallback(async () => {
    if (!hasMore) return; // Prevent fetching if no more products

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&sort=toprated`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.products.length === 0) {
        setHasMore(false); // No more products to load
        return;
      }

      setJustForYouProducts((prevProducts) => {
        // Avoid duplicates if the same product appears in multiple fetches
        const newProducts = data.products.filter(
          (newProduct: Product) =>
            !prevProducts.some((prevProduct) => prevProduct._id === newProduct._id)
        );
        return [...prevProducts, ...newProducts];
      });

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore]);

  // Load initial set of "Just For You" products
  useEffect(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  // Hero Carousel
  const images = ['/images/banner1.png', '/images/banner2.png', '/images/banner3.png'];
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * nextSlide (useCallback for ESLint dependency fix),
   * cycles through hero images
   */
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Auto-play hero carousel
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  // Infinite Carousel for Latest Products
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = useCallback(() => {
    if (scrollInterval.current) return; // Already scrolling
    scrollInterval.current = setInterval(() => {
      if (carouselRef.current) {
        // Adjust the scroll speed based on screen size
        const scrollSpeed = window.innerWidth > 1024 ? 1.5 : 1; // Faster on larger screens
        carouselRef.current.scrollLeft += scrollSpeed;
        // Reset to start if we've scrolled half-way (due to duplicated array)
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    }, 20);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  const handleMouseEnter = () => {
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    startAutoScroll();
  };

  // Drag-to-scroll functionality
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      isDragging.current = true;
      startX.current = e.pageX - carouselRef.current.offsetLeft;
      scrollLeftPos.current = carouselRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast
    carouselRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO CAROUSEL */}
      <div className="relative w-full mt-6">
        <div className="relative overflow-hidden">
          <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[600px]">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none transition"
            aria-label="Previous Slide"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none transition"
            aria-label="Next Slide"
          >
            ❯
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full border-2 border-white ${
                  index === currentSlide ? 'bg-white' : 'bg-transparent hover:bg-white'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* LATEST PRODUCTS */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Latest Products</h2>
        <div
          className="relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={carouselRef}
            className="flex space-x-6 md:space-x-10 overflow-x-scroll scrollbar-hide cursor-grab"
            style={{ scrollBehavior: 'smooth' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {[...latestProducts, ...latestProducts].map((product, index) => (
              <div key={index} className="min-w-[220px] lg:min-w-[250px] xl:min-w-[300px]">
                <ProductItem product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* SHOP BY CATEGORIES */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6">Shop By Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categoriesWithImages.map((categoryData, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/search?category=${categoryData.category}`)}
            >
              {categoryData.image ? (
                <div className="relative w-full h-40">
                  <Image
                    src={categoryData.image}
                    alt={categoryData.category}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-40 bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">{categoryData.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* JUST FOR YOU */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6">Just For You</h2>
        {isLoading && !justForYouProducts.length ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {justForYouProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreProducts}
                  disabled={isLoading}
                  className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
            {!hasMore && (
              <div className="flex justify-center mt-8">
                <span className="text-gray-500">No more products to display.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientComponent;

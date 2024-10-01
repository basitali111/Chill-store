'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/models/ProductModel';
import ProductItem from '@/components/products/ProductItem';
import ProductCard from '@/components/products/ProductCard';
import Loader from '@/components/Loader';

interface ClientComponentProps {
  latestProducts: Product[];
  categoriesWithImages: { category: string; image: string | null }[];
}

const ClientComponent: React.FC<ClientComponentProps> = ({
  latestProducts,
  categoriesWithImages,
}) => {
  const router = useRouter();
  const [justForYouProducts, setJustForYouProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const loadMoreProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&sort=toprated`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJustForYouProducts((prevProducts) => {
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
  };

  const images = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner3.jpg',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="relative w-full mt-4">
        <div className="relative overflow-hidden h-64 sm:h-80 md:h-96 lg:h-[500px]">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
          >
            ❯
          </button>
        </div>
      </div>

      <h2 className="mb-6 text-xl mt-10 font-semibold text-gray-900 md:text-xl lg:text-xl ">
        <mark className="px-3 py-3 text-white bg-gray-800 rounded-full ">
          Latest
        </mark>
        <span className="bg-gray-300 text-gray-900 text-xl me-2 px-2.5 py-0.5 rounded ms-2">
          Products
        </span>
      </h2>

      <div className="carousel-container relative overflow-hidden overflow-x-scroll">
        <ul className="carousel-track flex animate-scroll">
          {Array.from({ length: 3 }).flatMap(() =>
            latestProducts.map((product, index) => (
              <ProductItem
                key={`${product.slug}${index}`}
                product={product}
              />
            ))
          )}
        </ul>
      </div>

      <h2 className="mb-6 text-xl mt-10 font-semibold text-gray-900 md:text-xl lg:text-xl ">
        <mark className="px-3 py-3 text-white bg-gray-800 rounded-full ">
          Shop By
        </mark>
        <span className="bg-gray-300 text-gray-900 text-xl me-2 px-2.5 py-0.5 rounded ms-2">
          Categories
        </span>
      </h2>

      <div className="container lg:w-[80%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-6">
        {categoriesWithImages.map((categoryData, index) => (
          <div
            key={index}
            className="relative bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl group border border-gray-300 hover:border-gray-400 "
            onClick={() =>
              router.push(`/search?category=${categoryData.category}`)
            }
          >
            {categoryData.image && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={categoryData.image}
                  alt={categoryData.category}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-600 ">
                {categoryData.category}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-xl mt-10 font-semibold text-gray-900 md:text-xl lg:text-xl ">
        <mark className="px-3 py-3 text-white bg-gray-800 rounded-full ">
          Just For
        </mark>
        <span className="bg-gray-300 text-gray-900 text-xl font-semibold me-2 px-2.5 py-0.5 rounded ms-2">
          You
        </span>
      </h2>

      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {justForYouProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={loadMoreProducts}
          disabled={isLoading}
          className="px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-gray-800 text-white inline-block border-gray-600"
          style={{
            border: '2px solid rgba(128, 128, 128, 0.5)',
            boxShadow: '0 0 10px rgba(128, 128, 128, 0.5)',
          }}
        >
          <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-gray-600 group-hover:h-full opacity-90"></span>
          <span className="relative group-hover:text-white">
            {isLoading ? 'Loading...' : 'Load More Products'}
          </span>
        </button>
      </div>
    </>
  );
};

export default ClientComponent;

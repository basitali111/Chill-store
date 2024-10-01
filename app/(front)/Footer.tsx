"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categoriesWithImages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const categoryNames = data.map((category: { category: string }) => category.category);
          setCategories(categoryNames);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="footer-container mt-10 pt-32 md:px-0">
      <div className='inner-content grid md:grid-cols-2 grid-cols-1 gap-10 px-10 pt-10 pb-32 text-white rounded-[40px]'>
      </div>
      <div className='inner-content-dark px-10 pt-7 rounded-[40px] -mt-24 pb-12'>
        <div className='grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 '>
          <div className='col-span-2'>
            <h1 className='text-3xl text-white  font-medium py-2'>About us</h1>
            <p className='text-gray-400 xl:pr-28 lg:pr-18'>We are the biggest hyperstore in the universe. We got you all covered with our exclusive collections and latest drops.</p>
          </div>
          <div>
            <h1 className='text-xl text-white  font-medium py-2'>Categories</h1>
            <ul className='text-gray-400'>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={index} className='mb-2'>
                    <Link href={`/search?category=${category}`}>
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No categories available</li>
              )}
            </ul>
          </div>
          <div>
            <h1 className='text-xl text-white  font-medium py-2'>Company</h1>
            <ul className='text-gray-400'>
              <li className='mb-2'>About</li>
              <li className='mb-2'>Contact</li>
            </ul>
          </div>
          <div>
            <h1 className='text-xl text-white  font-medium py-2'>Follow us</h1>
            <div className='flex gap-5'>
              <FaFacebook size={20} className="text-gray-400 hover:text-white transition duration-300" />
              <FaInstagram size={20} className="text-gray-400 hover:text-white transition duration-300" />
              <FaTwitter size={20} className="text-gray-400 hover:text-white transition duration-300" />
              <FaTiktok size={20} className="text-gray-400 hover:text-white transition duration-300" />
            </div>
          </div>
        </div>
      </div>
      <h1 className='py-5 text-center flex items-center justify-center text-gray-400'>© All rights reserved | Made with ❤️ By <div className='text-white ml-3'>Chill Academy</div></h1>
    </div>
  );
}

export default Footer;

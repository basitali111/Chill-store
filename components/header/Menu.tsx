// Menu.tsx

'use client';

import useCartService from '@/lib/hooks/useCartStore';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Menu = () => {
  const { items, init } = useCartService();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [productsToReviewCount, setProductsToReviewCount] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);

    if (session) {
      // Fetch the products to review count for the current user
      const fetchProductsToReviewCount = async () => {
        try {
          const response = await fetch('/api/user/products-to-review');
          if (response.ok) {
            const data = await response.json();
            setProductsToReviewCount(data.count);
          } else {
            console.error('Failed to fetch products to review count');
          }
        } catch (error) {
          console.error('Error fetching products to review count:', error);
        }
      };

      fetchProductsToReviewCount();
    }
  }, [session]);

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' });
    init();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* Cart Icon */}
      <Link href="/cart" className="relative text-gray-800 hover:text-gray-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6H17M7 13L5.4 5M17 13l1.2 6M9 21h6"
          />
        </svg>
        {mounted && items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {items.reduce((a, c) => a + c.qty, 0)}
          </span>
        )}
      </Link>

      {/* User Menu */}
      {session && session.user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center text-gray-800 hover:text-gray-600 transition"
            onClick={toggleDropdown}
          >
            <img
              src={session.user.image || '/images/default-avatar.jpg'}
              alt={session.user.name || 'User Avatar'}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
              {session.user.isAdmin && (
                <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Admin Dashboard
                </Link>
              )}
              <Link href="/order-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Order History
              </Link>
              <Link href="/review-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Review History
              </Link>
              <Link href="/products-to-review" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                <span>Products to Review</span>
                {productsToReviewCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {productsToReviewCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={signoutHandler}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="text-gray-800 hover:text-gray-600 transition"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Menu;

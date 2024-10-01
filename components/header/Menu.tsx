'use client';

import useCartService from '@/lib/hooks/useCartStore';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SearchBox } from './SearchBox';

const Menu = () => {
  const { items, init } = useCartService();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
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

  const handleClick = () => {
    (document.activeElement as HTMLElement).blur();
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
    <>
      <div className="hidden md:block">
        <SearchBox />
      </div>
      <div>
        <ul className="flex justify-center items-center ml-8">
          <li>
            <Link
              className="btn btn-ghost rounded-btn flex flex-col p-2 md:px-4 lg:px-4 text-white text-base md:text-lg font-bold hover:bg-gray-800 transition duration-300"
              href="/cart"
            >
              <p className="text-sm md:text-base font-bold">Cart</p>
              {mounted && items.length != 0 && (
                <div className="badge badge-secondary text-sm p-1">
                  {items.reduce((a, c) => a + c.qty, 0)}{' '}
                </div>
              )}
            </Link>
          </li>
          {session && session.user ? (
            <>
              <li ref={dropdownRef}>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <button
                    tabIndex={0}
                    className="btn btn-ghost text-white rounded-btn p-2 md:px-4 hover:bg-gray-800 transition duration-300"
                    onClick={toggleDropdown}
                  >
                    <div className="flex justify-center items-center text-sm md:text-base font-bold gap-1">
                      <div>{session.user.name}</div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content z-[1] p-2 shadow-lg bg-gray-800 rounded-box w-52 text-white animate-fade-in"
                    >
                      {session.user.isAdmin && (
                        <li onClick={handleClick}>
                          <Link href="/admin/dashboard">Admin Dashboard</Link>
                        </li>
                      )}
                      <li onClick={handleClick}>
                        <Link href="/order-history">Order history</Link>
                      </li>
                      <li onClick={handleClick}>
                        <Link href="/review-history">Review History</Link>
                      </li>
                      <li onClick={handleClick}>
                        <Link href="/products-to-review">
                          Products to Review
                          {productsToReviewCount > 0 && (
                            <span className="badge badge-info ml-2">{productsToReviewCount}</span>
                          )}
                        </Link>
                      </li>
                      <li onClick={handleClick}>
                        <Link href="/profile">Profile</Link>
                      </li>
                      <li onClick={handleClick}>
                        <button type="button" onClick={signoutHandler}>
                          Sign out
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </>
          ) : (
            <li>
              <button
                className="btn btn-ghost rounded-btn text-white text-base hover:bg-gray-800 transition duration-300"
                type="button"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Menu;

// SearchBox.tsx

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useState } from 'react';

export const SearchBox = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';

  const { data: categories, error } = useSWR('/api/products/categories');

  if (error) return <div>{error.message}</div>;
  if (!categories) return <div>Loading...</div>;

  const handleCategoryChange = (c: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('category', c);
    router.push(`/search?${newSearchParams.toString()}`);
    setDropdownOpen(false);
  };

  return (
    <form action="/search" method="GET" className="flex w-full">
      {/* Category Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-gray-700 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {category}
          <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              type="button"
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => handleCategoryChange('All')}
            >
              All
            </button>
            {categories.map((c: string) => (
              <button
                key={c}
                type="button"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleCategoryChange(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search for products..."
          className="w-full px-4 py-2 border-t border-b border-gray-300 focus:outline-none"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

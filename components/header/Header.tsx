// Header.tsx

import Link from 'next/link';
import React from 'react';
import Menu from './Menu';
import { SearchBox } from './SearchBox';
import Image from 'next/image';
import LogoSquare from '../../public/images/Chill Logo.png';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        {/* Left Section: Logo and Drawer Toggle */}
        <div className="flex items-center">
          {/* Drawer Toggle for Mobile */}
          <label
            htmlFor="my-drawer"
            className="lg:hidden text-gray-800 mr-4 cursor-pointer hover:text-gray-600 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src={LogoSquare} alt="Kensin Store" width={50} height={50} />
            <span className="text-xl font-bold text-gray-800 ml-2 hover:text-gray-600 transition duration-300">
              Chill Store
            </span>
          </Link>
        </div>

        {/* Middle Section: Search Box (Desktop) */}
        <div className="hidden lg:block flex-1 mx-8">
          <SearchBox />
        </div>

        {/* Right Section: Menu */}
        <div className="flex items-center space-x-4">
          <Menu />
        </div>
      </nav>

      {/* Search Box for Mobile */}
      <div className="lg:hidden bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <SearchBox />
        </div>
      </div>
    </header>
  );
};

export default Header;
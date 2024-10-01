import Link from 'next/link';
import React from 'react';
import Menu from './Menu';
import { SearchBox } from './SearchBox';
import LogoSquare from './LogoSquare';

const Header = () => {
  return (
    <header>
      <nav className="bg-gray-800 shadow-md">
        <div className="flex w-full items-center py-4 px-2 md:px-8 lg:px-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center ">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost text-white mr-2 md:mr-4 lg:mr-6 hover:bg-gray-700 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
              <div className='flex items-center gap-4'>
              <LogoSquare />
              <Link
                href="/"
                className="text-gray-100 text-base md:text-lg lg:text-xl font-bold tracking-wide hover:text-gray-300 transition duration-300 whitespace-nowrap"
              >
                Kensin Store
              </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Menu />
            </div>
          </div>
        </div>
        <div className="md:hidden bg-gray-700 text-center mt-1 pb-3">
          <SearchBox />
        </div>
      </nav>
    </header>
  );
};

export default Header;

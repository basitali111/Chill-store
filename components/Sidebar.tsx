// Sidebar.tsx

'use client';

import useLayoutService from '@/lib/hooks/useLayout';
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService();
  const { data: categories, error } = useSWR('/api/products/categories');
  const { data: session } = useSession();

  if (error) return <div>{error.message}</div>;
  if (!categories) return <div>Loading...</div>;

  return (
    <div className="w-80 min-h-full bg-white shadow-md">
      <div className="p-6">
        {/* User Profile */}
        {session && session.user && (
          <div className="flex items-center mb-6">
            <img
              src={session.user.image || '/images/default-avatar.jpg'}
              alt={session.user.name || 'User Avatar'}
              className="w-14 h-14 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{session.user.name}</h2>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shop By Department</h2>
          <ul className="space-y-2">
            {categories.map((category: string) => (
              <li key={category}>
                <Link
                  href={`/search?category=${category}`}
                  onClick={toggleDrawer}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <span>{category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

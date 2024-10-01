'use client';

import useLayoutService from '@/lib/hooks/useLayout';
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService();
  const { data: categories, error } = useSWR('/api/products/categories');
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session); // Log session data to debug
  }, [session]);

  if (error) return error.message;
  if (!categories) return 'Loading...';

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      {session && session.user && (
        <li className="mb-4">
          <div className="flex items-center">
            <img
              src={session.user.image || '/images/default-avatar.jpg'}
              alt={session.user.name || 'User Avatar'}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{session.user.name}</h2>
              <p className="text-sm">{session.user.username}</p>
            </div>
          </div>
        </li>
      )}
      <li>
        <h2 className="text-xl">Shop By Department</h2>
      </li>
      {categories.map((category: string) => (
        <li key={category}>
          <Link href={`/search?category=${category}`} onClick={toggleDrawer}>
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;


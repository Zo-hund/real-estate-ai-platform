import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';

export function Header() {
  const user = useUser();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Real Estate AI</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
          <Link href="/analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
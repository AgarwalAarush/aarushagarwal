import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed left-0 top-0 h-full w-64 bg-[#181818] z-50">
        <div className="p-6">
          <div className="h-16"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#1D1E21] border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-lg  text-gray-900 dark:text-white">
                Aarush Agarwal
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
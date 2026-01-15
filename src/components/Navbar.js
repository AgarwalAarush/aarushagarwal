import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const mainNavigation = [
    { name: 'Home', href: '/', isSection: false },
    { name: 'About', href: '/about', isSection: false },
  ];

  const resourcesNavigation = [
    { name: 'Thoughts', href: '/thoughts', isSection: false },
  ];

  const handleNavClick = (e, item) => {
    if (item.isSection && router.pathname === '/') {
      e.preventDefault();
      const sectionId = item.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else if (item.isSection && router.pathname !== '/') {
      // If we're not on home page and it's a section link, go to home page with hash
      window.location.href = '/' + item.href;
    }
  };

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
              <Link href="/" className="text-lg font-medium text-gray-900 dark:text-white">
                Aarush Agarwal
              </Link>
            </div>
            <div className="flex items-center gap-2 -mr-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 rounded-md hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} w-6 h-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} w-6 h-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-[#1D1E21]`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[...mainNavigation, ...resourcesNavigation].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={(e) => {
                  handleNavClick(e, item);
                  if (!item.isSection) setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}
            {/* Theme toggle is global in Layout */}
          </div>
        </div>
      </nav>
    </>
  );
}
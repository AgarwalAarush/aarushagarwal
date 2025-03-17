import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Resume', href: '/documents/Resume - Aarush Agarwal.pdf' },
  ];

  const isActive = (path) => router.pathname === path;

  if (!mounted) {
    return (
      <nav className="section-bg border-b border-[#1e1e2d]">
        <div className="container px-4 mx-auto">
          <div className="h-16"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="section-bg border-b border-[#1e1e2d]">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-[#f0f0f0] uppercase">
                <span className="bg-gradient-to-r from-[#6e56cf] to-[#4cc9f0] bg-clip-text text-transparent">
                  AARUSH AGARWAL
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center ml-4 space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md uppercase transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-[#4cc9f0] bg-[rgba(76,201,240,0.1)] border border-[rgba(76,201,240,0.2)]'
                      : 'text-[#a0a0a0] hover:text-[#4cc9f0] hover:bg-[rgba(76,201,240,0.05)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex -mr-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-[#a0a0a0] rounded-md hover:text-[#4cc9f0] hover:bg-[rgba(76,201,240,0.05)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4cc9f0]"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} w-6 h-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} w-6 h-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden section-bg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 text-base font-medium rounded-md uppercase transition-colors duration-300 ${
                isActive(item.href)
                  ? 'text-[#4cc9f0] bg-[rgba(76,201,240,0.1)] border border-[rgba(76,201,240,0.2)]'
                  : 'text-[#a0a0a0] hover:text-[#4cc9f0] hover:bg-[rgba(76,201,240,0.05)]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
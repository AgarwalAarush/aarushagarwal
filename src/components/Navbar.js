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

  const mainNavigation = [
    { name: 'Home', href: '/', isSection: false },
    { name: 'About', href: '/about', isSection: false },
    { name: 'Projects', href: '/projects', isSection: false },
    { name: 'Research', href: '/research', isSection: false },
    { name: 'Contact', href: '/contact', isSection: false },
  ];

  const resourcesNavigation = [
    { name: 'Thoughts', href: '#blog', isSection: true },
    { name: 'Uses', href: '/uses', isSection: false },
  ];

  const socialsNavigation = [
    { name: 'Instagram', href: 'https://www.instagram.com/aarush_agarwal_43/', isSection: false },
    { name: 'Github', href: 'https://github.com/agarwalaarush', isSection: false },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aarush-agarwal-2751a61b1/', isSection: false },
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
      {/* Desktop Sidebar */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-[#181818] z-50">
        <div className="p-6 h-full flex flex-col">
          {/* Profile Section */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
                <img 
                  src="/images/profile-pic.png" 
                  alt="Aarush Agarwal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-lg font-medium text-white mb-1">Aarush Agarwal</h1>
          </div>
          
          {/* Main Navigation */}
          <div className="mb-8">
            <div className="space-y-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="mr-3 text-gray-500">#</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="mb-8">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Resources</h3>
            <div className="space-y-1">
              {resourcesNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="mr-3 text-gray-500">⚡</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials Section */}
          <div className="mt-auto">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Socials</h3>
            <div className="space-y-1">
              {socialsNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  <span className="mr-3 text-gray-500">✖</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-[#1D1E21] border-b border-gray-800 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-lg font-medium text-white">
                Aarush Agarwal
              </Link>
            </div>
            <div className="flex -mr-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-300 rounded-md hover:text-white hover:bg-gray-800 focus:outline-none"
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
        <div className={`${isMenuOpen ? 'block' : 'hidden'} bg-[#1D1E21]`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[...mainNavigation, ...resourcesNavigation].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={(e) => {
                  handleNavClick(e, item);
                  if (!item.isSection) setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
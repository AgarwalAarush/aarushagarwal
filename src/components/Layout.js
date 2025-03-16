import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 text-center text-gray-600 bg-gray-100">
        <div className="container px-4 mx-auto">
          <p suppressHydrationWarning={true}>© {new Date().getFullYear()} Aarush Agarwal. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="https://github.com/aarushagarwal" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
              GitHub
            </a>
            <a href="https://linkedin.com/in/aarushagarwal" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
              LinkedIn
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
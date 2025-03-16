import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1118]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 text-center bg-[#080a12] relative">
        {/* Grid background - similar to other sections */}
        <div className="absolute inset-0 z-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.2">
              {[...Array(10)].map((_, i) => (
                <line key={`fh-${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke="#6e56cf" strokeWidth="0.5" />
              ))}
              {[...Array(30)].map((_, i) => (
                <line key={`fv-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#6e56cf" strokeWidth="0.5" />
              ))}
            </g>
            
            {/* Random dots as "particles" */}
            {[...Array(20)].map((_, i) => (
              <circle 
                key={`fp-${i}`} 
                cx={Math.random() * 100 + "%"} 
                cy={Math.random() * 100 + "%"} 
                r={Math.random() * 2 + 1}
                fill="#6e56cf"
                opacity={Math.random() * 0.5 + 0.2}
              />
            ))}
          </svg>
        </div>
        
        <motion.div 
          className="container relative z-10 px-4 mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p suppressHydrationWarning={true} className="text-[#a0a0a0] font-medium">
            © {new Date().getFullYear()} Aarush Agarwal. All rights reserved.
          </p>
          
          <div className="flex justify-center mt-6 space-x-8">
            <motion.a 
              href="https://github.com/aarushagarwal" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6e56cf] to-[#4cc9f0] rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative px-6 py-2 text-[#f0f0f0] font-medium uppercase tracking-wider border border-[#6e56cf] rounded-lg group-hover:border-[#4cc9f0] transition-colors duration-300">
                GitHub
              </div>
            </motion.a>
            
            <motion.a 
              href="https://linkedin.com/in/aarushagarwal" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4cc9f0] to-[#6e56cf] rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative px-6 py-2 text-[#f0f0f0] font-medium uppercase tracking-wider border border-[#4cc9f0] rounded-lg group-hover:border-[#6e56cf] transition-colors duration-300">
                LinkedIn
              </div>
            </motion.a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
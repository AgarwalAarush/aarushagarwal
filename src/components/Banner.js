import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Banner({ bannerData }) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Always show banner on page load
        setIsVisible(true);
    }, []);

    const dismissBanner = () => {
        setIsVisible(false);
    };

    // Don't render anything until mounted (prevents hydration mismatch)
    if (!mounted || !isVisible || !bannerData || !bannerData.topLine || bannerData.topLine.length === 0) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case 'award':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            case 'work':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full mb-8"
                >
                    <div className="relative group bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                        <div className="flex flex-col gap-3 pr-8">
                            {/* Top Line - Hackathon Achievements */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-evenly gap-3 w-full">
                                {bannerData.topLine.map((banner) => (
                                    <div key={banner.id} className="flex items-center gap-2">
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                                            banner.type === 'award' 
                                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {getIcon(banner.type)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                            {banner.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Bottom Line - CalHacks Details */}
                            {bannerData.bottomLine && (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                                        {bannerData.bottomLine}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={dismissBanner}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Dismiss banner"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


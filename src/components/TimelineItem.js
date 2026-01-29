import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TimelineItem({ 
    icon, 
    iconAlt, 
    company, 
    role, 
    period, 
    description,
    isLast = false 
}) {
    const hasRole = Boolean(role);

    return (
        <div className="relative">
            <div className="flex gap-4">
                {/* Icon with vertical line */}
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                        <Image 
                            src={icon} 
                            alt={iconAlt} 
                            width={48} 
                            height={48} 
                            className="w-12 h-12 object-contain" 
                        />
                    </div>
                    
                    {/* Vertical connecting line */}
                    {!isLast && (
                        <div 
                            className="absolute left-1/2 top-12 w-0.5 bg-gray-300 dark:bg-gray-700 -translate-x-1/2"
                            style={{ height: 'calc(100% + 1rem)' }}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                    {/* Company and role with period */}
                    <div className="mb-1">
                        <h3 className="text-base text-gray-900 dark:text-white">
                            {company}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            {hasRole ? `${role} • ${period}` : period}
                        </p>
                    </div>

                    {/* Description */}
                    {description && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="pt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2"
                        >
                            {description}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

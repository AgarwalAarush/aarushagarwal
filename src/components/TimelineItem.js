import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

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
    const reducedMotion = useReducedMotion();

    return (
        <motion.article
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.18 }}
            className={`grid gap-6 border-t border-[#c9c5bd] py-8 md:grid-cols-[0.34fr_0.66fr] md:gap-10 md:py-10 ${
                isLast ? "border-b" : ""
            }`}
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
                        <Image
                            src={icon}
                            alt={iconAlt}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                        />
                </div>
                <div className="min-w-0">
                    <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ef432f]">
                        {period}
                    </p>
                    <h3 className="text-[15px] font-medium leading-snug text-[#22211f]">
                        {company}
                    </h3>
                </div>
            </div>

            <div>
                {hasRole && (
                    <p className="mb-4 font-display text-2xl font-medium uppercase tracking-[-0.02em] text-[#22211f] sm:text-[1.75rem]">
                        {role}
                    </p>
                )}
                {description && (
                    <div className="space-y-3 text-[14px] leading-[1.75] text-[#625f59] sm:text-[15px] [&_a]:text-[#d83b2a] [&_a]:underline-offset-4 [&_a:hover]:underline [&_span]:font-medium [&_span]:text-[#22211f]">
                        {description}
                    </div>
                )}
            </div>
        </motion.article>
    );
}

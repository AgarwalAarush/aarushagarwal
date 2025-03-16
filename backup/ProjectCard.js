import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
export default function ProjectCard({ project }) {
    const [mounted, setMounted] = useState(false);
    // Only show the component after it's mounted on the client
    useEffect(() => {
        setMounted(true);
    }, []);
    // Return a placeholder during server-side rendering
    if (!mounted) {
        return (
            <div className="overflow-hidden bg-white rounded-lg shadow-md h-80"></div>
        );
    }
    return (
        <motion.div
            className="overflow-hidden bg-white rounded-lg shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/projects/project-${project.id}`} className="block">
                <div className="relative w-full h-48">
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-purple-100">
                            <span className="text-purple-600">No Image</span>
                        </div>
                    )}
                </div>
                {/* Add suppressHydrationWarning to this div */}
                <div className="p-6" suppressHydrationWarning={true}>
                    <h3 className="mb-2 text-xl font-semibold text-black">
                        {project.title}
                    </h3>
                    <p className="mb-4 text-black/60">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-black/60 hover:text-purple-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            GitHub
                        </a>
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-black/60 hover:text-purple-700"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Live Demo
                            </a>
                        )}
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-purple-600 hover:text-purple-800">
                            View Details →
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
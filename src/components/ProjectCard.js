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
      <div className="overflow-hidden bg-[#1e1e2d] rounded-lg shadow-md h-80 border border-[#4cc9f030]"></div>
    );
  }
  
  return (
    <motion.div
      className="overflow-hidden bg-[#0a0c14] rounded-lg shadow-md border border-[#4cc9f030] hover:border-[#4cc9f0] hover:shadow-[0_10px_30px_rgba(76,201,240,0.15)]"
      whileHover={{ y: -10 }}
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
            <div className="flex items-center justify-center w-full h-full bg-[#0f1118]">
              <span className="text-[#4cc9f0]">No Image</span>
            </div>
          )}
        </div>
        {/* Add suppressHydrationWarning to this div */}
        <div className="p-6" suppressHydrationWarning={true}>
          <h3 className="mb-2 text-xl font-semibold text-[#f0f0f0]">
            {project.title}
          </h3>
          <p className="mb-4 text-[#a0a0a0]">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs text-[#4cc9f0] bg-[rgba(76,201,240,0.1)] rounded-full border border-[rgba(76,201,240,0.2)] transition-all duration-300 hover:bg-[rgba(76,201,240,0.2)]"
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
              className="text-sm text-[#a0a0a0] hover:text-[#4cc9f0] transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a0a0a0] hover:text-[#4cc9f0] transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
              </a>
            )}
          </div>
          <div className="mt-4">
            <span className="text-sm text-[#4cc9f0] hover:text-[#6e56cf] transition-colors duration-300">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
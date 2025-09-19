import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

export default function ProjectCard({ project, showTechnologies = true }) {
  // Card content that's used both on the server and on the client:
  const cardContent = (
    <div className="w-full h-full flex flex-col">
      {/* Project image */}
      {project.image && (
        <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
          <img 
            src={project.image} 
            alt={`${project.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>

        <div 
          className="mb-3 text-sm text-gray-700 dark:text-white"
          dangerouslySetInnerHTML={{
            __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />

        {/* Technologies */}
        {showTechnologies && project.technologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 dark:bg-[#181818] dark:text-white border border-gray-200 dark:border-transparent"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block">
        <ClientOnly fallback={
          <div className="overflow-hidden rounded-lg shadow-md cursor-pointer">
            <div className="p-6 bg-gray-100 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-[#1e1e2d] hover:border-purple-400 dark:hover:border-[#9d7bff] transition-colors duration-300 h-96 flex relative group">
              <div className="relative z-10 h-full w-full">
                {cardContent}
              </div>
            </div>
          </div>
        }>
          {() => (
            <div className="overflow-hidden rounded-lg shadow-md cursor-pointer">
              <div className="p-6 bg-gray-100 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-[#1e1e2d] hover:border-purple-400 dark:hover:border-[#9d7bff] transition-colors duration-300 h-96 flex relative group">
                <div className="relative z-10 h-full w-full">
                  {cardContent}
                </div>
              </div>
            </div>
          )}
        </ClientOnly>
      </a>
    </Link>
  );
}
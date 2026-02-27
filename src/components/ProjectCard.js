import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

export default function ProjectCard({ project, showTechnologies = true }) {
  // Card content that's used both on the server and on the client:
  const cardContent = (
    <div className="w-full h-full flex flex-col">
      {/* Project image or icon */}
      {project.image ? (
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={project.image} 
            alt={`${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : project.icon ? (
        <div className="w-full h-48 mb-4 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <Image
            src={project.icon} 
            alt={`${project.title} Icon`}
            width={96}
            height={96}
            className="w-24 h-24 object-contain"
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="mb-2 text-lg text-gray-900 dark:text-white">
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
                className="px-2 py-1 text-xs rounded-sm bg-gray-100 text-gray-700 dark:bg-[#181818] dark:text-white border border-gray-200 dark:border-transparent"
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
            <div className="p-6 bg-transparent rounded-lg border border-gray-200 dark:border-[#1e1e2d] transition-colors duration-300 h-96 flex relative group hover:bg-gray-100 dark:hover:bg-gray-800/30">
              <div className="relative z-10 h-full w-full">
                {cardContent}
              </div>
            </div>
          </div>
        }>
          {() => (
            <div className="overflow-hidden rounded-lg shadow-md cursor-pointer">
              <div className="p-6 bg-transparent rounded-lg border border-gray-200 dark:border-[#1e1e2d] transition-colors duration-300 h-96 flex relative group hover:bg-gray-100 dark:hover:bg-gray-800/30">
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

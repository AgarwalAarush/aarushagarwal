import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

export default function ProjectCard({ project }) {
  // Card content that's used both on the server and on the client:
  const cardContent = (
    <>
      {/* Project icon */}
      <div className="flex items-center mr-4">
        {project.icon ? (
          <img 
            src={project.icon} 
            alt={`${project.title} icon`}
            className="w-12 h-12 object-contain rounded-lg"
          />
        ) : (
          <div className="p-3 bg-gray-700 rounded-lg">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="mb-2 text-lg font-bold text-white">
          {project.title}
        </h3>

        <p className="mb-3 text-sm text-white">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-sm bg-[#181818] text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block">
        <ClientOnly fallback={
          <div className="overflow-hidden rounded-lg shadow-md cursor-pointer">
            <div className="p-6 bg-[#1D1E21] rounded-lg border border-[#1e1e2d] hover:border-[#9d7bff] transition-colors duration-300 h-40 flex relative group">
              <div className="relative z-10 h-full flex w-full">
                {cardContent}
              </div>
            </div>
          </div>
        }>
          {() => (
            <div className="overflow-hidden rounded-lg shadow-md cursor-pointer">
              <div className="p-6 bg-[#1D1E21] rounded-lg border border-[#1e1e2d] hover:border-[#9d7bff] transition-colors duration-300 h-40 flex relative group">
                <div className="relative z-10 h-full flex w-full">
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
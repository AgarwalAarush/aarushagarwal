import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

export default function ProjectCard({ project }) {
  // Card content that's used both on the server and on the client:
  const cardContent = (
    <>
      {/* Conditional image rendering */}
      {project.image && (
        <div className="mb-4 overflow-hidden rounded-md">
          <img
            src={project.image}
            alt={project.title}
            className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <h3 className="mb-3 text-xl font-bold text-[#f0f0f0]">
        {project.title}
      </h3>

      <p className="mb-4 text-[#a0a0a0] flex-grow">
        {project.description}
      </p>

      {/* Technologies */}
      {project.technologies && (
        <div className="flex flex-wrap mb-4 gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium rounded-full bg-[rgba(76,201,240,0.1)] text-[#4cc9f0]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex mt-auto space-x-5">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
        )}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            Live Demo
          </a>
        )}
      </div>
    </>
  );

  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block">
        <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer">
          <div className="p-6 bg-[#0a0c14] border border-[#1e1e2d] rounded-lg hover:border-[#4cc9f0] transition-all duration-300 h-full flex flex-col">
            <ClientOnly fallback={cardContent}>
              {() => (
                <motion.div
                  initial={false}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {cardContent}
                </motion.div>
              )}
            </ClientOnly>
          </div>
        </div>
      </a>
    </Link>
  );
}
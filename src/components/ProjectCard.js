import React from "react";
import Link from "next/link";

export default function ProjectCard({ project, showTechnologies = true }) {
  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block group border-b border-gray-100 last:border-b-0">
        <div className="px-0 py-5 transition-all duration-200 relative overflow-hidden">
          {/* Hover gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/70 via-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative flex flex-col gap-1.5">
            {/* Title row */}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base text-gray-900 group-hover:text-purple-900 transition-colors duration-200">
                {project.title}
              </h3>
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200 text-lg leading-none flex-shrink-0">
                →
              </span>
            </div>

            {/* Description */}
            <div
              className="text-sm text-gray-500 leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-700 font-normal">$1</strong>')
              }}
            />

            {/* Technologies */}
            {showTechnologies && project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs text-gray-400 border border-gray-200 bg-white group-hover:border-purple-200 group-hover:text-purple-600 transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-dm-mono)' }}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-gray-300" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}

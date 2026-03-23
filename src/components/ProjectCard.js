import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "../lib/assets";

export default function ProjectCard({ project, showTechnologies = true }) {
  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block group border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200">
        {/* Project image */}
        {project.image && (
          <div className="relative w-full h-44 overflow-hidden bg-gray-50">
            <Image
              src={getAssetUrl(project.image)}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="px-4 py-5">
          <div className="flex flex-col gap-1.5">
            {/* Title row */}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base text-gray-900">
                {project.title}
              </h3>
              <span className="text-gray-300 group-hover:text-gray-700 transition-colors duration-200 text-lg leading-none flex-shrink-0">
                →
              </span>
            </div>

            {/* Description */}
            <div
              className="text-sm text-gray-500 leading-relaxed line-clamp-3"
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
                    className="px-2 py-0.5 text-xs text-gray-400 border border-gray-200 bg-white transition-colors duration-200"
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

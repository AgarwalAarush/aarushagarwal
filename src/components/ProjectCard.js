import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

export default function ProjectCard({
  project,
  showTechnologies = true,
  showImagePreview = true,
}) {
  // Card content that's used both on the server and on the client:
  const cardContent = (
    <div
      className={`flex w-full flex-col ${showImagePreview ? 'min-h-0 flex-1' : 'h-full min-h-0'}`}
    >
      {/* Project image or icon */}
      {showImagePreview &&
        (project.image ? (
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={project.image}
              alt={`${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : project.icon ? (
          <div className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
            <Image
              src={project.icon}
              alt={`${project.title} Icon`}
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
            />
          </div>
        ) : null)}

      {/* Content */}
      <div
        className={`flex flex-col ${showImagePreview ? 'min-h-0 flex-1 justify-center' : 'min-h-0 flex-1 justify-start'}`}
      >
        {showImagePreview ? (
          <>
            <h3 className="mb-2 shrink-0 text-lg text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <div
              className="mb-3 text-sm text-gray-700 dark:text-white"
              dangerouslySetInnerHTML={{
                __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </>
        ) : (
          <>
            {/* Fixed title band so description always starts at the same vertical offset */}
            <div className="h-[3.25rem] shrink-0">
              <h3 className="m-0 line-clamp-2 text-lg font-normal leading-snug text-gray-900 dark:text-white">
                {project.title}
              </h3>
            </div>
            <div
              className="-mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 [&_strong]:font-normal [&_strong]:text-gray-900 dark:[&_strong]:text-white"
              dangerouslySetInnerHTML={{
                __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </>
        )}

        {/* Technologies */}
        {showTechnologies && project.technologies && (
          <div className={`flex flex-wrap gap-2 ${showImagePreview ? '' : 'mt-3'}`}>
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="rounded-sm border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:border-transparent dark:bg-[#181818] dark:text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const cardShellClass = [
    'relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-transparent p-6 transition-colors duration-300',
    'group hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800/30',
    showImagePreview ? 'h-96' : 'aspect-[50/29]',
  ].join(' ');

  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a className="block w-full">
        <ClientOnly fallback={
          <div className="w-full cursor-pointer overflow-hidden rounded-2xl">
            <div className={cardShellClass}>
              <div className="relative z-10 flex min-h-0 flex-1 flex-col">{cardContent}</div>
            </div>
          </div>
        }>
          {() => (
            <div className="w-full cursor-pointer overflow-hidden rounded-2xl">
              <div className={cardShellClass}>
                <div className="relative z-10 flex min-h-0 flex-1 flex-col">{cardContent}</div>
              </div>
            </div>
          )}
        </ClientOnly>
      </a>
    </Link>
  );
}

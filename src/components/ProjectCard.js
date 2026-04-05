import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ClientOnly from "../components/ClientOnly";

/**
 * SF-style arrow.uturn.right, vertically flipped: tail high (top-left), bowl opens
 * downward, exits with a horizontal shaft and chevron pointing right. Draw order
 * is tail → curve → tip (pathLength animation follows this sequence).
 */
const CURVED_ARROW_PATH =
  "M 4 4 C 4 11.5 5 14 11.5 14 C 14.5 14 18.5 14 20 14 L 22.5 14 L 20 12.3 L 22.5 14 L 20 15.7 L 22.5 14";

/** Round caps + pathLength 0 leave visible “dots” at path ends — use butt caps and hide when inactive */
function CurvedArrowIndicator({ active }) {
  return (
    <div
      className="pointer-events-none h-7 w-7 sm:h-8 sm:w-8"
      aria-hidden
    >
      <svg viewBox="0 0 30 30" className="h-full w-full text-gray-800 dark:text-gray-100">
        <motion.path
          d={CURVED_ARROW_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="butt"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: active ? 1 : 0,
            opacity: active ? 1 : 0,
          }}
          transition={{
            pathLength: {
              duration: active ? 0.72 : 0.48,
              ease: active ? [0.22, 1, 0.36, 1] : [0.55, 0, 0.45, 1],
            },
            opacity: {
              duration: active ? 0.18 : 0,
              delay: active ? 0.06 : 0,
            },
          }}
        />
      </svg>
    </div>
  );
}

export default function ProjectCard({
  project,
  showTechnologies = true,
  showImagePreview = true,
}) {
  const [hover, setHover] = useState(false);

  // Card content — title layout unchanged; arrow is absolutely positioned beside it
  const cardContent = (
    <div
      className={`flex w-full ${showImagePreview ? 'flex-col min-h-0 flex-1' : 'flex-row items-center gap-4'}`}
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
      {showImagePreview ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="relative mb-2 shrink-0 pr-10 sm:pr-11">
            <h3 className="text-lg text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <div
              className="pointer-events-none absolute right-0 top-[11px] z-10 -translate-y-1/2"
              aria-hidden
            >
              <CurvedArrowIndicator active={hover} />
            </div>
          </div>
          <div
            className="mb-3 text-sm text-gray-700 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
          {showTechnologies && project.technologies && (
            <div className="flex flex-wrap gap-2">
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
      ) : (
        <>
          {/* Title on the left */}
          <div className="shrink-0 sm:w-56">
            <h3 className="m-0 text-lg font-normal leading-snug text-gray-900 dark:text-white">
              {project.title}
            </h3>
          </div>
          {/* Description on the right */}
          <div
            className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 [&_strong]:font-medium [&_strong]:text-gray-900 dark:[&_strong]:text-white"
            dangerouslySetInnerHTML={{
              __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
          {/* Arrow top-right */}
          <div className="shrink-0 self-start" aria-hidden>
            <CurvedArrowIndicator active={hover} />
          </div>
          {showTechnologies && project.technologies && (
            <div className="flex shrink-0 flex-wrap gap-2">
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
        </>
      )}
    </div>
  );

  const cardShellClass = [
    'relative flex w-full flex-col overflow-hidden bg-transparent transition-colors duration-300',
    'group hover:bg-gray-100 dark:hover:bg-gray-800/30',
    showImagePreview ? 'rounded-2xl border border-gray-200 dark:border-gray-700 h-96 p-6' : 'py-5 px-3',
  ].join(' ');

  const cardInner = (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col">{cardContent}</div>
  );

  return (
    <Link href={`/projects/${project.id}`} legacyBehavior>
      <a
        className="block w-full"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <ClientOnly
          fallback={
            <div className={`w-full cursor-pointer ${showImagePreview ? 'overflow-hidden rounded-2xl' : ''}`}>
              <div className={cardShellClass}>{cardInner}</div>
            </div>
          }
        >
          {() => (
            <div className={`w-full cursor-pointer ${showImagePreview ? 'overflow-hidden rounded-2xl' : ''}`}>
              <div className={cardShellClass}>{cardInner}</div>
            </div>
          )}
        </ClientOnly>
      </a>
    </Link>
  );
}

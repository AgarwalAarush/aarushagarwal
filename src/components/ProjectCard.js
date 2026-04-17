import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const images = (project.images && project.images.length > 0)
    ? project.images
    : [project.image].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const currentImage = images[imgIndex] || null;

  const prevImg = (e) => {
    e.preventDefault();
    setDirection(-1);
    setImgIndex(i => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.preventDefault();
    setDirection(1);
    setImgIndex(i => (i + 1) % images.length);
  };

  // Card content — title layout unchanged; arrow is absolutely positioned beside it
  const cardContent = (
    <div
      className={`flex w-full ${showImagePreview ? 'flex-col min-h-0 flex-1' : 'flex-col gap-3 md:flex-row md:items-center md:gap-4'}`}
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
          {/* Text block — vertically centered against image */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="m-0 text-xl md:text-lg font-normal leading-snug text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <div className="pointer-events-none shrink-0 mt-1 mr-4" aria-hidden>
                <CurvedArrowIndicator active={hover} />
              </div>
            </div>
            <div
              className="text-base md:text-sm leading-relaxed text-gray-600 dark:text-gray-400 [&_strong]:font-medium [&_strong]:text-gray-900 dark:[&_strong]:text-white"
              dangerouslySetInnerHTML={{
                __html: project.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
            {showTechnologies && project.technologies && (
              <div className="flex shrink-0 flex-wrap gap-2 mt-2">
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

          {/* Image with arrows */}
          {currentImage && (
            <div className="shrink-0 flex w-full items-center gap-2 md:w-auto">
              <button
                onClick={prevImg}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5.5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="relative flex-1 md:flex-none md:w-72 aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={imgIndex}
                    custom={direction}
                    initial={{ x: direction * 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction * -60, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                onClick={nextImg}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L10.5 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );

  const cardShellClass = [
    'relative flex w-full flex-col overflow-hidden bg-transparent transition-colors duration-300',
    'group hover:bg-gray-100 dark:hover:bg-gray-800/30',
    showImagePreview ? 'rounded-2xl border border-gray-200 dark:border-gray-700 h-96 p-6' : 'py-4 px-3',
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

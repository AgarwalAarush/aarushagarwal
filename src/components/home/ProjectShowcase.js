import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function cleanDescription(description = "") {
  return description
    .replace(/^\*\*.*?\*\*\s*/, "")
    .replace(/\*\*/g, "");
}

function ProjectArrow({ active }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 50 50"
      className="h-11 w-11 text-[#f0eee9]"
      animate={{ x: active ? 4 : 0, y: active ? -4 : 0 }}
      transition={{ type: "spring", stiffness: 190, damping: 18 }}
    >
      <path
        d="M12 38 38 12M18 12h20v20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function ProjectMetricFooter({ homepage, project, className = "" }) {
  return (
    <div
      className={`items-end justify-between gap-3 border-t border-white/15 pt-5 ${className}`}
    >
      <div>
        <p className="whitespace-nowrap font-display text-[2.25rem] font-medium uppercase leading-none tracking-[-0.035em] text-[#ef432f] sm:text-[2.7rem] xl:text-[3rem]">
          {homepage.metric}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
          {homepage.metricLabel}
        </p>
      </div>
      <p className="max-w-[24rem] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-white/35 lg:whitespace-nowrap xl:text-[9px] xl:tracking-[0.13em]">
        {project.technologies.slice(0, 4).join(" / ")}
      </p>
    </div>
  );
}

function FeaturedProjectCard({ project, index }) {
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const reverse = index % 2 === 1;
  const homepage = project.homepage || {};
  const cardImage = homepage.cardImage || project.image;
  const cardImagePosition = homepage.cardImagePosition || "center";
  const isVideo = /\.(mp4|webm|ogg)(?:$|\?)/i.test(cardImage || "");

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      className="mb-10 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#171716] text-[#f0eee9] shadow-[0_24px_70px_-42px_rgba(46,36,28,0.65)] sm:rounded-[1.75rem] lg:mb-14"
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f] focus-visible:ring-inset"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setActive(false);
          }
        }}
      >
        <div
          className={`grid min-h-[480px] lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <div
                className={`mb-7 flex items-start gap-5 ${
                  homepage.award ? "justify-between" : "justify-end"
                }`}
              >
                {homepage.award && (
                  <div className="border-l border-[#ef432f] pl-4">
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#ef432f]">
                        Recognition
                      </p>
                      <p className="mt-1.5 max-w-[25rem] font-display text-2xl font-medium uppercase leading-[0.9] tracking-[-0.025em] text-white sm:text-[1.75rem]">
                        {homepage.award}
                      </p>
                      {homepage.competitionScale && (
                        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/42">
                          {homepage.competitionScale}
                        </p>
                      )}
                  </div>
                )}
                <ProjectArrow active={active && !reducedMotion} />
              </div>

              <motion.h3
                initial={false}
                animate={{
                  color: active && !reducedMotion ? "#ef432f" : "#f0eee9",
                  x: active && !reducedMotion ? 6 : 0,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className={`font-display font-medium uppercase leading-[0.75] tracking-[-0.05em] ${
                  project.id === "AutoReflex"
                    ? "text-[clamp(3.8rem,6.7vw,6.35rem)]"
                    : "text-[clamp(4rem,8vw,7.2rem)]"
                }`}
              >
                {project.title}
              </motion.h3>
              <p className="mt-5 max-w-[42rem] text-[13px] leading-[1.65] text-white/62 sm:text-[14px]">
                {cleanDescription(project.description)}
              </p>
            </div>

            <ProjectMetricFooter
              homepage={homepage}
              project={project}
              className="mt-8 hidden lg:flex"
            />
          </div>

          <div className="relative min-h-[310px] overflow-hidden bg-[#242321] lg:min-h-full">
            {cardImage ? (
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{
                  scale: active && !reducedMotion ? 1.065 : 1,
                  x: active && !reducedMotion ? (reverse ? -12 : 12) : 0,
                }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              >
                {isVideo ? (
                  <video
                    src={cardImage}
                    aria-label={`${project.title} project demo`}
                    autoPlay={!reducedMotion}
                    loop={!reducedMotion}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: cardImagePosition }}
                  />
                ) : (
                  <Image
                    src={cardImage}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: cardImagePosition }}
                  />
                )}
              </motion.div>
            ) : (
              <div className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Project preview
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/75 via-transparent to-[#171716]/10" />
            <motion.div
              aria-hidden="true"
              className="absolute inset-y-0 w-px bg-[#ef432f]/70"
              initial={false}
              animate={{
                x: active && !reducedMotion ? "72vw" : "14vw",
                opacity: active || reducedMotion ? 0.8 : 0,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 22 }}
            />
          </div>

          <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 lg:hidden">
            <ProjectMetricFooter
              homepage={homepage}
              project={project}
              className="flex"
            />
          </div>
        </div>

      </Link>
    </motion.article>
  );
}

function ProjectArchiveRow({ project, index }) {
  const reducedMotion = useReducedMotion();
  const homepage = project.homepage || {};
  const cardImage = homepage.cardImage || project.image;

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: reducedMotion ? 0 : index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="border-t border-[#c9c5bd] last:border-b"
    >
      <Link
        href={`/projects/${project.id}`}
        className="group relative grid gap-3 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f] focus-visible:ring-offset-4 sm:grid-cols-[0.14fr_0.34fr_0.52fr] sm:items-center sm:gap-6 sm:py-7"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8c8880]">
          {String(index + 5).padStart(2, "0")}
        </span>
        <div>
          {homepage.award && (
            <>
              <p className="mb-2 font-display text-base font-medium uppercase leading-none tracking-[-0.01em] text-[#ef432f] sm:text-lg">
                {homepage.award}
              </p>
              {homepage.competitionScale && (
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.15em] text-[#858078]">
                  {homepage.competitionScale}
                </p>
              )}
            </>
          )}
          <h3 className="font-display text-3xl font-medium uppercase tracking-[-0.025em] text-[#22211f] transition-transform duration-300 group-hover:translate-x-1.5 sm:text-4xl">
            {project.title}
          </h3>
        </div>
        <div className="pr-0 sm:pr-28">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[#66635d]">
            {cleanDescription(project.description)}
          </p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[#9a958c]">
            {project.technologies.slice(0, 3).join(" / ")}
          </p>
        </div>

        {cardImage && (
          <div className="pointer-events-none absolute right-6 top-1/2 hidden h-24 w-32 -translate-y-1/2 overflow-hidden border border-[#b8b4ac] bg-[#e8e4dc] opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100 group-focus-visible:right-3 group-focus-visible:opacity-100 md:block">
            <Image
              src={cardImage}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        )}
      </Link>
    </motion.li>
  );
}

export default function ProjectShowcase({ projects = [] }) {
  const featuredProjects = projects.slice(0, 4);
  const archiveProjects = projects.slice(4);

  return (
    <>
      <div>
        {featuredProjects.map((project, index) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>

      {archiveProjects.length > 0 && (
        <div className="mt-24 lg:mt-32">
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-[#5e5b55]">
              Project archive
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#9a958c]">
              {String(archiveProjects.length).padStart(2, "0")} more
            </span>
          </div>
          <ol>
            {archiveProjects.map((project, index) => (
              <ProjectArchiveRow
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

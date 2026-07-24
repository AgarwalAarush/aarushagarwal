import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const FLOW_NODE_X = [18, 206, 394, 582];

function cleanDescription(description = "") {
  return description.replace(/\*\*/g, "");
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

function SystemFlow({ steps, active, reducedMotion }) {
  return (
    <div className="mt-8 border-t border-white/15 pt-6 lg:mt-10 lg:pt-8">
      <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
        System flow
      </p>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 74"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 hidden h-[74px] w-full sm:block"
        >
          <path
            d="M18 36 H582"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
          />
          <motion.path
            d="M18 36 H582"
            fill="none"
            stroke="#3478f6"
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: active || reducedMotion ? 1 : 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          {FLOW_NODE_X.map((x, index) => (
            <motion.g
              key={steps[index]}
              initial={false}
              animate={{
                opacity: active || reducedMotion ? 1 : 0.42,
                scale: active || reducedMotion ? 1 : 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 20,
                delay: reducedMotion ? 0 : index * 0.07,
              }}
              style={{ transformOrigin: `${x}px 36px` }}
            >
              <circle cx={x} cy="36" r="5" fill="#171716" stroke="#ef432f" />
              <circle cx={x} cy="36" r="2" fill="#ef432f" />
            </motion.g>
          ))}
        </svg>

        <ol className="grid gap-3 sm:grid-cols-4 sm:gap-4">
          {steps.map((step, index) => (
            <motion.li
              key={step}
              initial={false}
              animate={{
                opacity: active || reducedMotion ? 1 : 0.6,
                y: active || reducedMotion ? 0 : 3,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                delay: reducedMotion ? 0 : 0.14 + index * 0.07,
              }}
              className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white sm:block sm:pt-[54px]"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full border border-[#ef432f] sm:hidden"
              />
              <span className="text-white/35">
                {String(index + 1).padStart(2, "0")}
              </span>{" "}
              {step}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project, index }) {
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const reverse = index % 2 === 1;
  const homepage = project.homepage || {};
  const steps = homepage.systemFlow || [];

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      className="sticky top-4 mb-6 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#171716] text-[#f0eee9] shadow-[0_24px_70px_-42px_rgba(46,36,28,0.65)] sm:top-6 sm:rounded-[1.75rem]"
      style={{ top: `${24 + index * 10}px` }}
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
          className={`grid min-h-[560px] lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
            <div>
              <div className="mb-9 flex items-center justify-between">
                <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-white/45">
                  Selected work / {String(index + 1).padStart(2, "0")}
                </p>
                <ProjectArrow active={active && !reducedMotion} />
              </div>

              <h3 className="font-display text-[clamp(4rem,8vw,7.2rem)] font-medium uppercase leading-[0.75] tracking-[-0.05em]">
                {project.title}
              </h3>
              <p className="mt-7 max-w-[42rem] text-[14px] leading-[1.7] text-white/62 sm:text-[15px]">
                {cleanDescription(project.description)}
              </p>
            </div>

            <div className="mt-10 flex items-end justify-between gap-5 border-t border-white/15 pt-6">
              <div>
                <p className="font-display text-[2.25rem] font-medium uppercase leading-none tracking-[-0.035em] text-[#ef432f] sm:text-[3rem]">
                  {homepage.metric}
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
                  {homepage.metricLabel}
                </p>
              </div>
              <p className="max-w-[15rem] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.13em] text-white/35 sm:text-[9px]">
                {project.technologies.slice(0, 4).join(" / ")}
              </p>
            </div>
          </div>

          <div className="relative min-h-[310px] overflow-hidden bg-[#242321] lg:min-h-full">
            {project.image ? (
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{
                  scale: active && !reducedMotion ? 1.045 : 1,
                  x: active && !reducedMotion ? (reverse ? -8 : 8) : 0,
                }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
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
        </div>

        {steps.length === 4 && (
          <div className="px-6 pb-8 sm:px-9 sm:pb-10 lg:px-12 lg:pb-12">
            <SystemFlow
              steps={steps}
              active={active}
              reducedMotion={reducedMotion}
            />
          </div>
        )}
      </Link>
    </motion.article>
  );
}

function ProjectArchiveRow({ project, index }) {
  const reducedMotion = useReducedMotion();

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
        <h3 className="font-display text-3xl font-medium uppercase tracking-[-0.025em] text-[#22211f] transition-transform duration-300 group-hover:translate-x-1.5 sm:text-4xl">
          {project.title}
        </h3>
        <div className="pr-0 sm:pr-28">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[#66635d]">
            {cleanDescription(project.description)}
          </p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[#9a958c]">
            {project.technologies.slice(0, 3).join(" / ")}
          </p>
        </div>

        {project.image && (
          <div className="pointer-events-none absolute right-6 top-1/2 hidden h-24 w-32 -translate-y-1/2 overflow-hidden border border-[#b8b4ac] bg-[#e8e4dc] opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100 group-focus-visible:right-3 group-focus-visible:opacity-100 md:block">
            <Image
              src={project.image}
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

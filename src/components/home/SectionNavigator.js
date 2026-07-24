import { useEffect, useMemo, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const sections = [
  { id: "research", label: "Research", y: 64, x: 108 },
  { id: "experience", label: "Experience", y: 198, x: 52 },
  { id: "projects", label: "Projects", y: 334, x: 108 },
];

function scrollToSection(id, reducedMotion) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function SectionNavigator() {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [dragging, setDragging] = useState(false);
  const orbY = useMotionValue(sections[0].y);
  const orbX = useTransform(
    orbY,
    sections.map((section) => section.y),
    sections.map((section) => section.x)
  );

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId]
  );

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-18% 0px -52% 0px",
        threshold: [0.05, 0.25, 0.5],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dragging) return undefined;

    const controls = animate(orbY, activeSection.y, {
      type: reducedMotion ? "tween" : "spring",
      duration: reducedMotion ? 0 : undefined,
      stiffness: 150,
      damping: 22,
    });

    return () => controls.stop();
  }, [activeSection, dragging, orbY, reducedMotion]);

  const selectSection = (section) => {
    setActiveId(section.id);
    scrollToSection(section.id, reducedMotion);
  };

  const handleDragEnd = () => {
    setDragging(false);
    const currentY = orbY.get();
    const nearest = sections.reduce((closest, section) =>
      Math.abs(section.y - currentY) < Math.abs(closest.y - currentY)
        ? section
        : closest
    );
    selectSection(nearest);
  };

  return (
    <aside
      aria-label="Homepage section navigator"
      className="pointer-events-none fixed right-5 top-1/2 hidden h-[430px] w-[220px] -translate-y-1/2 xl:block"
    >
      <div className="relative h-[382px] w-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 382"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.path
            d="M108 64 C194 86 184 140 52 198 C-8 225 16 290 108 334"
            fill="none"
            stroke="#c9c5bd"
            strokeWidth="1"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: reducedMotion ? 0 : 1.2,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: { duration: reducedMotion ? 0 : 0.35 },
            }}
          />
        </svg>

        {sections.map((section) => {
          const active = section.id === activeId;
          const labelOnRight = section.id !== "experience";

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section)}
              aria-current={active ? "location" : undefined}
              className="pointer-events-auto absolute flex -translate-y-1/2 items-center gap-2.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.17em] focus-visible:outline-none"
              style={{
                top: section.y,
                left: section.x,
                transform: labelOnRight
                  ? "translate(-4px, -50%)"
                  : "translate(calc(-100% + 4px), -50%)",
                flexDirection: labelOnRight ? "row" : "row-reverse",
              }}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                  active
                    ? "border-[#ef432f] bg-[#ef432f]"
                    : "border-[#171716] bg-[#f4f1eb]"
                }`}
              />
              <span
                className={`transition-colors duration-300 ${
                  active ? "text-[#ef432f]" : "text-[#343330] hover:text-[#ef432f]"
                }`}
              >
                {section.label}
              </span>
            </button>
          );
        })}

        <motion.button
          type="button"
          aria-label="Drag to navigate between Research, Experience, and Projects"
          drag={reducedMotion ? false : "y"}
          dragConstraints={{ top: 46, bottom: 350 }}
          dragElastic={0.04}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x: orbX, y: orbY }}
          whileFocus={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="pointer-events-auto group absolute left-0 top-0 h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ef432f]/55 bg-[#f4f1eb]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f] focus-visible:ring-offset-4"
        >
          <span className="absolute inset-[14px] rounded-full bg-[radial-gradient(circle,rgba(239,67,47,0.72)_0%,rgba(239,67,47,0.18)_38%,rgba(239,67,47,0)_72%)] opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-[88px] top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.17em] text-[#ef432f] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            Drag
          </span>
        </motion.button>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("research", reducedMotion)}
        className="pointer-events-auto absolute bottom-0 right-0 flex flex-col items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#45433f] transition-colors duration-300 hover:text-[#ef432f] focus-visible:outline-none focus-visible:text-[#ef432f]"
      >
        Scroll
        <svg aria-hidden="true" viewBox="0 0 18 24" className="h-6 w-[18px]">
          <path
            d="M9 1v19m0 0-5-5m5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  );
}

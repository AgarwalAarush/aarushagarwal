import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const sections = [
  { id: "top", label: "Headline", y: 42, x: 112, labelSide: "left" },
  { id: "research", label: "Research", y: 140, x: 62, labelSide: "right" },
  { id: "experience", label: "Experience", y: 238, x: 112, labelSide: "left" },
  { id: "projects", label: "Projects", y: 336, x: 62, labelSide: "right" },
];

const NAVIGATOR_VISUAL_CENTER_X = 81;

function scrollToSection(id, reducedMotion) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function SectionNavigator() {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [navigatorCenter, setNavigatorCenter] = useState(null);
  const [scrollCueVisible, setScrollCueVisible] = useState(true);
  const { scrollY } = useScroll();
  const scrollCueFadeEnd = reducedMotion ? 1 : 180;
  const scrollCueOpacity = useTransform(
    scrollY,
    [0, scrollCueFadeEnd],
    [1, 0]
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    const visible = latest < scrollCueFadeEnd;
    setScrollCueVisible((current) =>
      current === visible ? current : visible
    );
  });

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
        rootMargin: "-12% 0px -55% 0px",
        threshold: [0.02, 0.2, 0.45],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const portraitEdge = document.querySelector(
      "[data-hero-portrait-edge]"
    );

    if (!portraitEdge) return undefined;

    const updateNavigatorCenter = () => {
      const portraitRight = portraitEdge.getBoundingClientRect().right;
      const viewportRight = document.documentElement.clientWidth;
      setNavigatorCenter((portraitRight + viewportRight) / 2);
    };

    updateNavigatorCenter();

    const resizeObserver = new ResizeObserver(updateNavigatorCenter);
    resizeObserver.observe(portraitEdge);
    resizeObserver.observe(document.documentElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setScrollCueVisible(scrollY.get() < scrollCueFadeEnd);
  }, [scrollCueFadeEnd, scrollY]);

  const selectSection = (section) => {
    setActiveId(section.id);
    scrollToSection(section.id, reducedMotion);
  };

  const scrollToNextSection = () => {
    const activeIndex = sections.findIndex((section) => section.id === activeId);
    const nextSection =
      sections[Math.min(Math.max(activeIndex, 0) + 1, sections.length - 1)];
    scrollToSection(nextSection.id, reducedMotion);
  };

  return (
    <aside
      aria-label="Homepage section navigator"
      className="pointer-events-none fixed top-1/2 z-[4] hidden h-[430px] w-[220px] xl:block"
      style={
        navigatorCenter === null
          ? { right: 0, transform: "translateY(-50%)" }
          : {
              left: navigatorCenter,
              transform: `translate(-${NAVIGATOR_VISUAL_CENTER_X}px, -50%)`,
            }
      }
    >
      <div className="relative h-[382px] w-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 382"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.path
            d="M112 42 C42 68 30 108 62 140 C98 176 166 202 112 238 C50 278 24 304 62 336"
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
          const labelOnRight = section.labelSide === "right";

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
                className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                  active
                    ? "scale-110 border-[#ef432f] bg-[#ef432f]"
                    : "border-[#171716] bg-[#f4f1eb]"
                }`}
              />
              <span
                className={`bg-[#f4f1eb]/90 px-1 py-0.5 transition-colors duration-300 ${
                  active ? "text-[#ef432f]" : "text-[#343330] hover:text-[#ef432f]"
                }`}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="absolute bottom-0 flex w-[84px] justify-center"
        style={{
          left: NAVIGATOR_VISUAL_CENTER_X,
          transform: "translateX(-50%)",
        }}
      >
        <motion.button
          type="button"
          onClick={scrollToNextSection}
          aria-hidden={!scrollCueVisible}
          tabIndex={scrollCueVisible ? 0 : -1}
          style={{ opacity: scrollCueOpacity }}
          className={`flex flex-col items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#45433f] transition-colors duration-300 hover:text-[#ef432f] focus-visible:outline-none focus-visible:text-[#ef432f] ${
            scrollCueVisible ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          Scroll
          <svg
            aria-hidden="true"
            viewBox="0 0 18 24"
            className="h-6 w-[18px]"
          >
            <path
              d="M9 1v19m0 0-5-5m5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </aside>
  );
}

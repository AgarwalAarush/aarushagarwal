import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { getAssetUrl } from "../../lib/assets";

const navItems = [
  { label: "Research", href: "#research" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Notes", href: "/notes" },
];

const socialLinks = [
  {
    label: "Resume",
    href: getAssetUrl("/documents/Resume%20-%20Aarush%20Agarwal.pdf"),
  },
  {
    label: "GitHub",
    href: "https://github.com/agarwalaarush",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aarush-agarwal-2751a61b1/",
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 12 12 4M5 4h7v7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomepageHero() {
  const reducedMotion = useReducedMotion();
  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      id="top"
      aria-labelledby="homepage-title"
      className="relative min-h-[100dvh] overflow-hidden border-b border-[#d8d5ce] px-5 pb-16 pt-5 sm:px-8 lg:px-12 lg:pb-20"
    >
      <div className="mx-auto max-w-[1400px] xl:pr-[240px] 2xl:pr-0">
        <header className="flex items-center justify-between">
          <Link
            href="#top"
            className="font-display text-[26px] font-semibold leading-none tracking-[-0.07em] text-[#171716] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f] focus-visible:ring-offset-4"
            aria-label="Back to the top"
          >
            AA
          </Link>

          <nav aria-label="Homepage navigation">
            <ul className="flex items-center gap-4 sm:gap-7 lg:gap-10">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={item.label === "Experience" ? "hidden sm:block" : ""}
                >
                  <Link
                    href={item.href}
                    className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#383733] transition-colors duration-300 hover:text-[#ef432f] focus-visible:outline-none focus-visible:text-[#ef432f] sm:text-[11px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="grid min-h-[calc(100dvh-76px)] items-center gap-14 py-14 md:grid-cols-[0.92fr_1.08fr] md:gap-8 lg:py-10">
          <motion.div
            {...reveal}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[1] max-w-lg md:pb-6 lg:pl-[4vw]"
          >
            <div className="mb-7 grid max-w-[28rem] grid-cols-[auto_1fr] items-center gap-4">
              <p className="font-display text-[3.4rem] font-medium uppercase leading-[0.72] tracking-[-0.06em] text-[#ef432f] sm:text-[4rem]">
                6×
              </p>
              <div className="border-b border-[#b8b4ac] pb-2">
                <p className="font-display text-[1.65rem] font-medium uppercase leading-none tracking-[-0.025em] text-[#242320] sm:text-[1.85rem]">
                  Hackathon Winner
                </p>
                <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.14em] text-[#77736b] sm:text-[8px]">
                  CMU 3× / Harvard / Berkeley
                </p>
              </div>
            </div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ef432f] sm:text-[11px]">
              Engineer / Researcher / Builder
            </p>
            <h1
              id="homepage-title"
              className="font-display max-w-[8ch] text-[clamp(4.5rem,9vw,8.6rem)] font-medium uppercase leading-[0.76] tracking-[-0.055em] text-[#171716]"
            >
              Aarush
              <br />
              Agarwal
            </h1>

            <div className="mt-8 border-t border-[#b8b4ac] pt-5 sm:mt-10 sm:pt-6">
              <h2 className="font-display max-w-[31rem] text-[clamp(1.55rem,2.15vw,2rem)] font-medium uppercase leading-[1.03] tracking-[-0.025em] text-[#2a2926]">
                <span className="whitespace-nowrap">
                  AI @ CMU
                </span>
                <br />
                <span className="whitespace-nowrap">MLE @ Shopify</span>
                <br />
                <span className="whitespace-nowrap">Venture @ Felicis</span>
              </h2>

              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4b4944] transition-colors duration-300 hover:text-[#ef432f] focus-visible:outline-none focus-visible:text-[#ef432f]"
                    >
                      {link.label}
                      <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <ArrowUpRight />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <span
              aria-hidden="true"
              data-hero-portrait-edge
              className="pointer-events-none absolute -right-4 top-0 h-px w-px sm:-right-8"
            />

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: 28 }}
              animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full"
            >
              <div
                aria-hidden="true"
                className="absolute -right-4 top-[5%] h-[90%] w-[32%] overflow-hidden border border-[#d8d5ce] opacity-25 sm:-right-8"
              >
                <Image
                  src={getAssetUrl("/images/profile-pic.jpeg")}
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover object-center grayscale-[0.15]"
                  priority
                />
              </div>

              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        y: [0, -7, 0],
                      }
                }
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mr-5 aspect-[1.02/1] overflow-hidden bg-[#e7e1d7] sm:mr-10 md:mr-14"
              >
                <Image
                  src={getAssetUrl("/images/profile-pic.jpeg")}
                  alt="Aarush Agarwal"
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover object-center"
                  priority
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#171716]/15 to-transparent"
                />
              </motion.div>

              <div className="absolute -bottom-7 right-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#77736b] sm:right-10 sm:text-[10px]">
                <span className="h-px w-10 bg-[#b8b4ac]" />
                Pittsburgh, PA
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAssetUrl } from "../lib/assets";

export default function ProjectGallery({
  title,
  images = [],
  href,
  coverPosition = "center",
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const slides = [...new Set(images.filter(Boolean).map(getAssetUrl))];
  if (!slides.length) return null;

  const current = index % slides.length;
  const src = slides[current];
  const isVideo = /\.(mp4|webm|ogg)(?:$|\?)/i.test(src);
  const move = (step) => setIndex((value) => (value + step + slides.length) % slides.length);
  const media = (
    <motion.div
      key={src}
      initial={reducedMotion ? false : { opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0"
    >
      {isVideo ? (
        <video
          src={src}
          aria-label={`${title} demo`}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      ) : (
        <Image
          src={src}
          alt={`${title} — image ${current + 1} of ${slides.length}`}
          fill
          sizes={href ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 800px"}
          className={href && current === 0 ? "object-cover" : "object-contain"}
          style={{ objectPosition: current === 0 ? coverPosition : "center" }}
        />
      )}
    </motion.div>
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} gallery`}
      className={`flex flex-col overflow-hidden bg-[#f4f1eb] ${className}`}
      onKeyDown={(event) => {
        if (slides.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }}
    >
      <div className="relative min-h-0 flex-1">
        {href ? (
          <Link href={href} aria-label={`View ${title} project`} className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ef432f]">
            {media}
          </Link>
        ) : media}
      </div>
      {slides.length > 1 && (
        <div className="flex shrink-0 items-center justify-between border-t border-[#d9d5cc] bg-[#f4f1eb] px-3 py-1.5 text-[#34322e]">
          <span className="pl-2 text-xs tabular-nums" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Image </span>{String(current + 1).padStart(2, "0")}
            <span className="mx-2 text-[#77736c]" aria-hidden="true">/</span>
            <span className="sr-only"> of </span>{String(slides.length).padStart(2, "0")}
          </span>
          <div className="flex gap-1">
            {[[-1, ArrowLeft, "Previous"], [1, ArrowRight, "Next"]].map(([step, Icon, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => move(step)}
                aria-label={`${label} ${title} image`}
                className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-[#e5e0d6] hover:text-[#d83b2a] active:bg-[#d9d3c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f]"
              >
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

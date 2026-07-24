export default function SectionHeading({ number, title, eyebrow, description }) {
  return (
    <header className="grid gap-5 pb-9 md:grid-cols-[0.34fr_0.66fr] md:gap-10 md:pb-12">
      <div className="flex items-start gap-3 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-[11px]">
        <span className="text-[#ef432f]">{number}</span>
        <span className="text-[#5e5b55]">{eyebrow}</span>
      </div>
      <div>
        <h2 className="font-display text-[clamp(3.5rem,7vw,6.6rem)] font-medium uppercase leading-[0.82] tracking-[-0.045em] text-[#171716]">
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-[46rem] text-[15px] leading-relaxed text-[#68655f] sm:text-base">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}

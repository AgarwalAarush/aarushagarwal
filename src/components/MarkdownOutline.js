import { useEffect, useState } from 'react';

export default function MarkdownOutline({ headings }) {
  const [activeId, setActiveId] = useState(headings?.[0]?.id || '');

  useEffect(() => {
    if (!headings || headings.length === 0) {
      return undefined;
    }

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean);

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm font-light tracking-widest text-gray-400 dark:text-gray-500">
      <ul className="space-y-3">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block transition-colors duration-200 ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

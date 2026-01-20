const HEADING_PATTERN = /^(#{2,3})\s+(.+?)\s*$/;

const stripInlineMarkdown = (value) => {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

const slugify = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

const createSlugger = () => {
  const seen = new Map();

  return (value) => {
    const base = slugify(value);
    const count = seen.get(base) ?? 0;
    const nextCount = count + 1;
    seen.set(base, nextCount);

    if (count === 0) {
      return base;
    }

    return `${base}-${count}`;
  };
};

export const extractHeadings = (markdown, { minDepth = 2, maxDepth = 3 } = {}) => {
  if (!markdown) {
    return [];
  }

  const slugger = createSlugger();
  const headings = [];
  const lines = markdown.split('\n');
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = trimmed.match(HEADING_PATTERN);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    if (level < minDepth || level > maxDepth) {
      continue;
    }

    const rawText = match[2].replace(/\s+#+\s*$/, '');
    const text = stripInlineMarkdown(rawText).trim();
    if (!text) {
      continue;
    }

    headings.push({
      id: slugger(text),
      text,
      level
    });
  }

  return headings;
};

import fs from 'fs';
import path from 'path';

const NOTES_PATH = path.join(process.cwd(), 'src/pages/notes');
const H1_PATTERN = /^#\s+(.+?)\s*$/m;

const stripMarkdown = (value) => {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
};

const titleFromSlug = (slug) => {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const extractTitle = (content, slug) => {
  const headingMatch = content.match(H1_PATTERN);
  if (headingMatch?.[1]) {
    const title = stripMarkdown(headingMatch[1]);
    if (title) {
      return title;
    }
  }

  return titleFromSlug(slug);
};

const stripLeadingH1 = (content) => {
  return content.replace(/^\uFEFF?#\s+.+?\s*(?:\r?\n)+/, '');
};

const extractExcerpt = (content) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'))
    .map((line) => stripMarkdown(line))
    .filter(Boolean);

  return lines[0] ?? '';
};

export const getNoteSlugs = () => {
  if (!fs.existsSync(NOTES_PATH)) {
    return [];
  }

  return fs
    .readdirSync(NOTES_PATH)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
    .sort((a, b) => a.localeCompare(b));
};

export const getAllNotesMeta = () => {
  return getNoteSlugs().map((slug) => {
    const filePath = path.join(NOTES_PATH, `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');

    return {
      slug,
      title: extractTitle(content, slug),
      excerpt: extractExcerpt(content),
      hasContent: content.trim().length > 0,
    };
  });
};

export const getNoteBySlug = (slug) => {
  const filePath = path.join(NOTES_PATH, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  const contentWithoutTitle = stripLeadingH1(content);

  return {
    slug,
    content: contentWithoutTitle,
    title: extractTitle(content, slug),
    excerpt: extractExcerpt(content),
  };
};

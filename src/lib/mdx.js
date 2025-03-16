import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

// Path to our MDX files
const POSTS_PATH = path.join(process.cwd(), 'content/posts');

// Get all MDX file paths
export function getPostFilePaths() {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path));
}

// Get post data from filename
export async function getPost(filename) {
  const filePath = path.join(POSTS_PATH, filename);
  const source = fs.readFileSync(filePath, 'utf8');

  // Use gray-matter to parse the post metadata and content
  const { content, data } = matter(source);

  // Use next-mdx-remote to serialize the content
  const mdxSource = await serialize(content, {
    // Parse the MDX with these options
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeHighlight, { ignoreMissing: true }],
      ],
    },
    scope: data,
  });

  return {
    content: mdxSource,
    frontMatter: {
      ...data,
      slug: filename.replace(/\.mdx?$/, ''),
    },
  };
}

// Get all posts with their data
export async function getAllPosts() {
  const filePaths = getPostFilePaths();

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const { content, frontMatter } = await getPost(filePath);
      
      return {
        ...frontMatter,
        content,
      };
    })
  );

  // Sort posts by date
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
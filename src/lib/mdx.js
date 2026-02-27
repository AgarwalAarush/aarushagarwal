import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

  return {
    // Return raw content; render pipeline is handled where content is consumed.
    content,
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

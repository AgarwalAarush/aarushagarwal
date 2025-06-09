import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Thoughts({ posts }) {
  return (
    <div className="min-h-screen bg-[#1D1E21]">
      <Head>
        <title>Thoughts | Aarush Agarwal</title>
        <meta name="description" content="Thoughts on AI, software development, and technology" />
        <link rel="icon" href="/images/profile-pic.png" />
        <link rel="apple-touch-icon" href="/images/profile-pic.png" />
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Thoughts
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Thoughts on AI, software development, and the future of technology.
          </p>
        </motion.div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/thoughts/${post.slug}`}>
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-200 hover:border-gray-600/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h2 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 text-xs text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No thoughts yet. Check back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const blogDir = path.join(process.cwd(), "src/content/thoughts");
  
  // Check if blog directory exists
  if (!fs.existsSync(blogDir)) {
    return {
      props: {
        posts: [],
      },
    };
  }

  const filenames = fs.readdirSync(blogDir);
  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace('.md', '');
      const fullPath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter } = matter(fileContents);

      return {
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        excerpt: frontmatter.excerpt,
        tags: frontmatter.tags || [],
        readingTime: frontmatter.readingTime || 5,
        published: frontmatter.published !== false, // Default to true if not specified
        author: frontmatter.author || 'Aarush Agarwal'
      };
    })
    .filter(post => post.published) // Only show published posts
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  return {
    props: {
      posts,
    },
    revalidate: 60, // Revalidate every minute in production
  };
}
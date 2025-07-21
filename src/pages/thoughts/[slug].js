import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

// Custom components for MDX
const components = {
  h1: (props) => (
    <h1 className="text-3xl font-bold text-white mb-6 mt-8" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-bold text-white mb-4 mt-8" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-bold text-white mb-3 mt-6" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-lg font-bold text-white mb-2 mt-4" {...props} />
  ),
  p: (props) => (
    <p className="text-gray-300 mb-4 leading-relaxed text-sm" {...props} />
  ),
  ul: (props) => (
    <ul className="text-gray-300 mb-4 pl-6 space-y-2 text-sm" {...props} />
  ),
  ol: (props) => (
    <ol className="text-gray-300 mb-4 pl-6 space-y-2 list-decimal text-sm" {...props} />
  ),
  li: (props) => (
    <li className="leading-relaxed text-sm" {...props} />
  ),
  blockquote: (props) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-800/30 text-gray-300 italic" 
      {...props} 
    />
  ),
  code: (props) => (
    <code 
      className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded text-sm font-mono" 
      {...props} 
    />
  ),
  pre: (props) => (
    <pre 
      className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-700" 
      {...props} 
    />
  ),
  a: (props) => (
    <a 
      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline" 
      {...props} 
    />
  ),
  strong: (props) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  em: (props) => (
    <em className="text-gray-200 italic" {...props} />
  ),
};

export default function ThoughtsPost({ post, mdxSource }) {
  if (!post) {
    return (
      <div className="min-h-screen bg-[#1D1E21] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link href="/thoughts" className="text-blue-400 hover:text-blue-300">
            ← Back to Thoughts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1E21]">
      <Head>
        <title>{post.title} | Aarush Agarwal</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content={post.author} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags && post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="icon" href="/images/profile-pic.png" />
        <link rel="apple-touch-icon" href="/images/profile-pic.png" />
      </Head>

      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back to thoughts link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/thoughts" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Thoughts
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{post.author}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Medium Link */}
          {post.mediumLink && (
            <div className="mt-6">
              <a
                href={post.mediumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                Read on Medium
              </a>
            </div>
          )}
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose max-w-none"
        >
          <div className="text-gray-300 leading-relaxed">
            <MDXRemote {...mdxSource} components={components} />
          </div>
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-300 font-medium">Written by {post.author}</p>
              <p className="text-gray-400 text-sm">
                Published on {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link 
                href="/thoughts" 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
              >
                More Posts
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </motion.footer>
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), "src/content/thoughts");
  
  // Check if blog directory exists
  if (!fs.existsSync(blogDir)) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const filenames = fs.readdirSync(blogDir);
  const paths = filenames
    .filter(name => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace('.md', '');
      return {
        params: { slug },
      };
    });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const blogDir = path.join(process.cwd(), "src/content/thoughts");
  const fullPath = path.join(blogDir, `${slug}.md`);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return {
      notFound: true,
    };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);

  // Check if post is published
  if (frontmatter.published === false) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight, rehypeSlug],
    },
  });

  const post = {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    tags: frontmatter.tags || [],
    readingTime: frontmatter.readingTime || 5,
    author: frontmatter.author || 'Aarush Agarwal',
    mediumLink: frontmatter.mediumLink || null
  };

  return {
    props: {
      post,
      mdxSource,
    },
    revalidate: 60, // Revalidate every minute in production
  };
} 
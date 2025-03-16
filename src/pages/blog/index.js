import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Blog({ posts }) {
  return (
    <div className="min-h-screen py-12">
      <Head>
        <title>Blog | Your Name</title>
        <meta name="description" content="Blog posts by Your Name" />
      </Head>

      <div className="container px-4 mx-auto">
        <motion.h1 
          className="mb-10 text-4xl font-bold text-center text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Blog
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <motion.div 
              key={post.slug}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h2 className="mb-3 text-2xl font-semibold text-gray-800">{post.title}</h2>
                  <p className="mb-4 text-gray-600">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // In a real implementation, these would come from an API or markdown files
  const posts = [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      excerpt: "Learn how to set up a Next.js project and why it's the perfect React framework for your next web application.",
      date: '2023-05-15',
      readingTime: 5,
      tags: ['Next.js', 'React', 'Web Development']
    },
    {
      slug: 'mastering-tailwind-css',
      title: 'Mastering Tailwind CSS',
      excerpt: 'Tips and tricks for making the most of utility-first CSS with Tailwind, including custom configurations.',
      date: '2023-06-02',
      readingTime: 8,
      tags: ['CSS', 'Tailwind', 'Styling']
    },
    {
      slug: 'animations-with-framer-motion',
      title: 'Creating Smooth Animations with Framer Motion',
      excerpt: 'How to implement beautiful, physics-based animations in your React applications using Framer Motion.',
      date: '2023-07-10',
      readingTime: 6,
      tags: ['Animation', 'React', 'Framer Motion']
    },
    {
      slug: 'github-api-integration',
      title: 'Integrating the GitHub API in Your Projects',
      excerpt: 'A step-by-step guide to authenticating and fetching data from the GitHub API using Octokit.js.',
      date: '2023-08-18',
      readingTime: 10,
      tags: ['GitHub', 'API', 'JavaScript']
    },
  ];

  return {
    props: {
      posts,
    },
  };
}
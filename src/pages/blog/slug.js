import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { motion } from 'framer-motion';

// Components that can be used in MDX
const components = {
  h1: (props) => <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="mt-6 mb-4 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-4 mb-3 text-xl font-bold" {...props} />,
  p: (props) => <p className="my-4" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  a: (props) => <a className="text-purple-600 hover:underline" {...props} />,
  code: (props) => <code className="px-1 py-0.5 text-sm bg-gray-100 rounded" {...props} />,
  pre: (props) => <pre className="p-4 my-4 overflow-auto text-sm bg-gray-800 rounded-lg text-gray-100" {...props} />,
  blockquote: (props) => <blockquote className="pl-4 my-4 italic border-l-4 border-gray-300" {...props} />,
};

export default function BlogPost({ post }) {
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <Head>
        <title>{post.title} | Your Name</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <div className="container px-4 mx-auto">
        <Link 
          href="/blog"
          className="inline-flex items-center mb-8 text-purple-700 hover:text-purple-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Blog
        </Link>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-md prose prose-purple max-w-none">
            <MDXRemote {...post.content} components={components} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // In a real implementation, these would come from markdown files
  const posts = [
    { slug: 'getting-started-with-nextjs' },
    { slug: 'mastering-tailwind-css' },
    { slug: 'animations-with-framer-motion' },
    { slug: 'github-api-integration' },
  ];

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  // In a real implementation, this would read markdown files
  const postsData = {
    'getting-started-with-nextjs': {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      date: '2023-05-15',
      readingTime: 5,
      excerpt: "Learn how to set up a Next.js project and why it's the perfect React framework for your next web application.",
      tags: ['Next.js', 'React', 'Web Development'],
      markdown: `
# Getting Started with Next.js

Next.js is a powerful React framework that provides features like server-side rendering, static site generation, and more out of the box.

## Why Choose Next.js?

Next.js simplifies the development of React applications by providing:

- **Server-side rendering (SSR)** for better SEO and performance
- **Static site generation (SSG)** for blazing-fast websites
- **API routes** to build your API directly within your Next.js app
- **File-based routing** that makes navigation intuitive
- **Built-in CSS and Sass support** for styling your application
- **Image optimization** with the \`next/image\` component

## Setting Up Your First Next.js Project

Getting started with Next.js is incredibly simple:

\`\`\`bash
npx create-next-app my-next-app
cd my-next-app
npm run dev
\`\`\`

And that's it! Your application will be running at http://localhost:3000.

## File Structure

A basic Next.js project structure looks like this:

\`\`\`
my-next-app/
  ├── pages/
  │   ├── _app.js
  │   ├── index.js
  │   └── about.js
  ├── public/
  │   └── favicon.ico
  ├── styles/
  │   ├── globals.css
  │   └── Home.module.css
  ├── package.json
  └── next.config.js
\`\`\`

## Creating Your First Page

In Next.js, pages are React components exported from files in the \`pages\` directory:

\`\`\`jsx
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to my Next.js website!</h1>
      <p>This is the home page of my application.</p>
    </div>
  )
}
\`\`\`

With this simple setup, you're already taking advantage of code-splitting, prefetching, and many other optimizations.
      `
    },
    'mastering-tailwind-css': {
      slug: 'mastering-tailwind-css',
      title: 'Mastering Tailwind CSS',
      date: '2023-06-02',
      readingTime: 8,
      excerpt: 'Tips and tricks for making the most of utility-first CSS with Tailwind, including custom configurations.',
      tags: ['CSS', 'Tailwind', 'Styling'],
      markdown: `
# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build modern websites without ever leaving your HTML. This approach might seem verbose at first, but it offers incredible flexibility and speed once you get used to it.

## The Power of Utility-First CSS

Traditional CSS frameworks like Bootstrap provide pre-designed components that are easy to use but challenging to customize. Tailwind takes a different approach by providing low-level utility classes that you can combine to build completely custom designs.

For example, instead of using a pre-built "card" component, you might write:

\`\`\`html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div>
    <div class="text-xl font-medium text-black">Tailwind CSS</div>
    <p class="text-gray-500">The utility-first CSS framework</p>
  </div>
</div>
\`\`\`

## Setting Up Tailwind in Your Project

Here's how to add Tailwind to a Next.js project:

1. Install the required packages:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

2. Configure your template paths in \`tailwind.config.js\`:

\`\`\`javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

3. Add the Tailwind directives to your CSS:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Custom Configurations

One of the strengths of Tailwind is how easily you can customize it to match your design system:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#FF5733',
      secondary: '#3498DB',
      // ...
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
\`\`\`

## Creating Custom Utilities

You can also create your own utilities using the \`@layer\` directive:

\`\`\`css
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  .text-shadow-lg {
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
}
\`\`\`

## Extracting Components

When you find yourself repeating the same patterns of utilities, consider extracting them into reusable components:

\`\`\`css
@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}
\`\`\`

Then you can simply use:

\`\`\`html
<button class="btn-primary">
  Save changes
</button>
\`\`\`

By mastering these techniques, you'll be able to create beautiful, consistent, and highly customized interfaces with Tailwind CSS.
      `
    },
    // Add more blog posts
  };

  const post = postsData[params.slug];

  if (!post) {
    return {
      notFound: true,
    };
  }

  // Process markdown content
  const mdxSource = await serialize(post.markdown, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeHighlight, { ignoreMissing: true }],
      ],
    },
  });

  return {
    props: {
      post: {
        ...post,
        content: mdxSource,
      },
    },
  };
}
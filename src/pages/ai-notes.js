import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MarkdownOutline from '../components/MarkdownOutline';
import { extractHeadings } from '../lib/markdownOutline';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const notesPath = path.join(process.cwd(), 'src/pages/notes/ai-notes.md');
  const notesContent = fs.readFileSync(notesPath, 'utf8');
  const headings = extractHeadings(notesContent);

  return {
    props: {
      notesContent,
      headings,
    },
  };
}

export default function AINotes({ notesContent, headings }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
      <Head>
        <title>AI Notes | Aarush Agarwal</title>
        <meta name="description" content="Personal notes on AI concepts and architectures" />
      </Head>

      <main className="py-16 bg-white dark:bg-[#1D1E21] relative min-h-screen">
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left sidebar with outline */}
              <aside className="lg:w-60 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-8">
                  <Link
                    href="/"
                    className="inline-flex items-center text-gray-900 dark:text-white hover:underline transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                  </Link>
                  <MarkdownOutline headings={headings} />
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="mb-10">
                  <h1 className="mb-4 text-2xl text-gray-900 dark:text-white">AI Notes</h1>
                  <p className="mb-6 text-gray-700 dark:text-white">Personal notes on AI concepts, techniques, and architectures.</p>
                </div>

                <article className="prose prose-sm max-w-none markdown-github">
                  <div className="text-black dark:text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]}>
                      {notesContent}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

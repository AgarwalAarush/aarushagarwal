import Head from 'next/head';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MarkdownOutline from '../../components/MarkdownOutline';
import { extractHeadings } from '../../lib/markdownOutline';
import { getNoteBySlug, getNoteSlugs } from '../../lib/notes';

export async function getStaticPaths() {
  const slugs = getNoteSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      note: {
        ...note,
        headings: extractHeadings(note.content),
      },
    },
  };
}

export default function NotePage({ note }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
      <Head>
        <title>{`${note.title} | Aarush Agarwal`}</title>
        <meta name="description" content={note.excerpt || `Notes entry: ${note.title}`} />
      </Head>

      <main className="py-16 bg-white dark:bg-[#1D1E21] relative min-h-screen">
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-12">
              <aside className="lg:w-60 flex-shrink-0">
                <div className="lg:sticky lg:top-16">
                  <MarkdownOutline headings={note.headings} />
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                <div className="mb-10">
                  <h1 className="mb-4 text-2xl text-gray-900 dark:text-white">{note.title}</h1>
                </div>

                {note.content.trim().length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">This note is still a draft.</p>
                ) : (
                  <article className="prose prose-sm max-w-none markdown-github">
                    <div className="text-black dark:text-gray-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]}>
                        {note.content}
                      </ReactMarkdown>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

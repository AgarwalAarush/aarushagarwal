import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllNotesMeta } from '../../lib/notes';

export async function getStaticProps() {
  return {
    props: {
      notes: getAllNotesMeta(),
    },
  };
}

export default function NotesIndex({ notes }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
      <Head>
        <title>Notes | Aarush Agarwal</title>
        <meta name="description" content="Collection of technical notes" />
      </Head>

      <main className="py-16 bg-white dark:bg-[#1D1E21] relative min-h-screen">
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-10">
              <Link
                href="/"
                className="inline-flex items-center text-gray-900 dark:text-white hover:underline transition-all duration-300 mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
              <h1 className="mb-2 text-2xl text-gray-900 dark:text-white">Notes</h1>
              <p className="text-gray-700 dark:text-gray-300">A running collection of ideas, experiments, and references.</p>
            </div>

            <section className="space-y-4">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="block rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
                >
                  <h2 className="text-lg text-gray-900 dark:text-white mb-1">{note.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {note.hasContent
                      ? note.excerpt || 'Open note'
                      : 'Draft note (no content yet)'}
                  </p>
                </Link>
              ))}
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

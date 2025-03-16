import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function ProjectDetail({ frontmatter, content }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <Head>
        <title>{frontmatter.title} | Project Details</title>
        <meta name="description" content={frontmatter.description} />
      </Head>

      <div className="container px-4 mx-auto max-w-4xl">
        <Link href="/projects" className="inline-block">
          <motion.span 
            className="inline-block mb-6 text-purple-600 hover:text-purple-800"
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            &larr; Back to Projects
          </motion.span>
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {frontmatter.image && (
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex justify-between mb-6">
              {frontmatter.github && (
                <a 
                  href={frontmatter.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-black/60 hover:text-purple-700"
                >
                  GitHub Repository
                </a>
              )}
              {frontmatter.demo && (
                <a 
                  href={frontmatter.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-black/60 hover:text-purple-700"
                >
                  Live Demo
                </a>
              )}
            </div>

            <div className="prose prose-purple max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
  
  const paths = files.map(filename => ({
    params: {
      id: filename.replace('.md', '')
    }
  }));
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/projects', `${params.id}.md`),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);
  
  return {
    props: {
      frontmatter,
      content
    }
  };
}

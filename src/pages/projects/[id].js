import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { motion } from 'framer-motion';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function ProjectPage({ project }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Custom components for ReactMarkdown
  const components = {
    // Custom renderer for code blocks
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-4 bg-[#24292e]"
          showLineNumbers={true}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1E21]">
      <Head>
        <title>{`${project.title} | Aarush Agarwal`}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="py-16 bg-[#1D1E21] relative min-h-screen">
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back button */}
            <Link href="/#projects" className="inline-flex items-center mb-8 text-white hover:underline transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Projects
            </Link>
            
            {/* Project header */}
            <div className="mb-8 p-6 bg-[#1D1E21] border border-[#1e1e2d] rounded-lg">
              {project.image && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <h1 className="mb-4 text-2xl font-bold text-white">{project.title}</h1>
              
              <p className="mb-6 text-lg text-white">{project.description}</p>
              
              {/* Technologies */}
              {project.technologies && (
                <div className="flex flex-wrap mb-6 gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-sm font-medium rounded-sm bg-[#181818] text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Links */}
              <div className="flex space-x-6">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#6e56cf] rounded-lg hover:bg-[#9d7bff] transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Repository
                  </a>
                )}
                
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-[#6e56cf] text-[#6e56cf] rounded-lg hover:bg-[#6e56cf] hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
            
            {/* Project content */}
            <article className="prose prose-invert prose-sm max-w-none p-6 bg-[#1D1E21] border border-[#1e1e2d] rounded-lg markdown-github">
              <ReactMarkdown components={components}>{project.content}</ReactMarkdown>
            </article>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const projectFiles = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
  
  const paths = projectFiles.map(filename => ({
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
  const { id } = params;
  
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/projects', `${id}.md`),
    'utf-8'
  );
  
  const { data: frontmatter, content } = matter(markdownWithMeta);
  
  return {
    props: {
      project: {
        id,
        title: frontmatter.title,
        description: frontmatter.description,
        image: frontmatter.image,
        github: frontmatter.github,
        demo: frontmatter.demo,
        technologies: frontmatter.technologies,
        content
      }
    }
  };
}
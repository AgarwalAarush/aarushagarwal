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
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import MarkdownOutline from '../../components/MarkdownOutline';
import { extractHeadings } from '../../lib/markdownOutline';
import { getAssetUrl } from '../../lib/assets';

function ActionArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    >
      <path
        d="M4 12 12 4M5 4h7v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectPage({ project }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Function to parse bold markdown syntax in description
  const parseBoldText = (text) => {
    if (!text) return text;

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="">{boldText}</strong>;
      }
      return part;
    });
  };

  // Custom components for ReactMarkdown
  const components = {
    table({ children }) {
      return (
        <div className="project-table-shell not-prose">
          <table>{children}</table>
        </div>
      );
    },
    // Custom renderer for code blocks
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';

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
    },
    img({ src, alt, title }) {
      if (!src) return null;
      const isAbsolute = /^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:');
      const resolvedSrc = isAbsolute
        ? src
        : `/images/projects/${project.id}/${src}`;
      const assetSrc = resolvedSrc.startsWith('/')
        ? getAssetUrl(resolvedSrc)
        : resolvedSrc;
      const isVideo = /\.(mp4|webm|ogg)$/i.test(assetSrc);

      if (isVideo) {
        return (
          <span className="block my-6">
            <video
              src={assetSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg border border-gray-200 dark:border-[#2a2a2a]"
            />
            {title && (
              <span className="mt-2 block text-center text-sm text-gray-500 dark:text-gray-400">
                {title}
              </span>
            )}
          </span>
        );
      }

      const cropTopBottom = src && src.includes('box-demo');

      if (cropTopBottom) {
        return (
          <span className="block my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-[#2a2a2a]">
            <span className="block" style={{ marginTop: '-35%', marginBottom: '-28%' }}>
              <Image
                src={assetSrc}
                alt={alt || ''}
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 800px"
                unoptimized
                className="w-full h-auto block"
              />
            </span>
            {title && (
              <span className="mt-2 block text-center text-sm text-gray-500 dark:text-gray-400">
                {title}
              </span>
            )}
          </span>
        );
      }

      return (
        <span className="block my-6">
          <Image
            src={assetSrc}
            alt={alt || ''}
            width={1600}
            height={900}
            sizes="(max-width: 1024px) 100vw, 800px"
            unoptimized
            className="w-full h-auto rounded-lg border border-gray-200 dark:border-[#2a2a2a]"
          />
          {title && (
            <span className="mt-2 block text-center text-sm text-gray-500 dark:text-gray-400">
              {title}
            </span>
          )}
        </span>
      );
    },
    // Custom renderer for h1 to handle projects with icons
    h1({ node, children, ...props }) {
      // For the very first h1 in projects with icons, show the icon
      if (project.icon) {
        return (
          <div className="flex items-center justify-start gap-4 mb-8 not-prose w-fit">
            <Image
              src={project.icon}
              alt={`${project.title} Icon`}
              width={64}
              height={64}
              className="rounded-lg flex-shrink-0"
            />
            <h1 className="text-2xl  text-black dark:text-white m-0 text-left flex-shrink-0 no-underline" style={{borderBottom: 'none', textDecoration: 'none'}} {...props}>
              {children}
            </h1>
          </div>
        );
      }
      // Default h1 rendering for projects without icons
      return <h1 className="text-2xl  text-black dark:text-white mb-6 mt-8 text-left no-underline" style={{borderBottom: 'none', textDecoration: 'none'}} {...props}>{children}</h1>;
    }
  };

  const headings = project.headings || [];
  const projectActions = [
    { label: 'Watch demo', href: project.demo },
    { label: 'Visit website', href: project.website },
    { label: 'View GitHub', href: project.github },
    {
      label: 'View deck',
      href:
        project.deck && !project.deck.includes('DECK_LINK')
          ? project.deck
          : null,
    },
  ].filter((action) => action.href);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
      <Head>
        <title>{`${project.title} | Aarush Agarwal`}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="py-16 bg-white dark:bg-[#1D1E21] relative min-h-screen">
        
        <div className="container relative z-10 mx-auto w-full max-w-full overflow-x-hidden px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex min-w-0 max-w-full flex-col gap-12 lg:flex-row">
              <aside className="lg:w-60 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-8">
                  <Link
                    href="/#projects"
                    className="inline-flex items-center text-gray-900 dark:text-white hover:underline transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/').then(() => {
                        setTimeout(() => {
                          const projectsSection = document.getElementById('projects');
                          if (projectsSection) {
                            projectsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Projects
                  </Link>
                  <MarkdownOutline headings={headings} />
                </div>
              </aside>

              <div className="w-full min-w-0 max-w-full flex-1">
                {/* Project header */}
                <div className="mb-10">
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
                  
                  {project.icon ? (
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={project.icon}
                        alt={`${project.title} Icon`}
                        width={48}
                        height={48}
                        className="rounded-lg flex-shrink-0"
                      />
                      <h1 className="text-2xl  text-gray-900 dark:text-white m-0">{project.title}</h1>
                    </div>
                  ) : (
                    <h1 className="mb-4 text-2xl  text-gray-900 dark:text-white">{project.title}</h1>
                  )}

                  {projectActions.length > 0 && (
                    <div className="mb-7 flex flex-wrap gap-2 border-y border-[#dedad2] py-3">
                      {projectActions.map((action, index) => (
                        <a
                          key={action.label}
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-[transform,background-color,color,border-color] duration-300 active:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef432f] focus-visible:ring-offset-2 ${
                            index === 0
                              ? 'border-[#242320] bg-[#242320] text-white hover:border-[#ef432f] hover:bg-[#ef432f]'
                              : 'border-[#cfcac1] bg-[#fbfaf7] text-[#34322e] hover:border-[#ef432f] hover:text-[#ef432f]'
                          }`}
                        >
                          {action.label}
                          <ActionArrow />
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <p className="mb-6 text-gray-700 dark:text-white">{parseBoldText(project.description)}</p>
                  
                  {/* Technologies */}
                  {project.technologies && (
                    <div className="flex flex-wrap mb-6 gap-2">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-sm rounded-lg bg-[#F3F2EC] text-gray-700 dark:bg-[#181818] dark:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Project content */}
                <article className="prose prose-sm w-full min-w-0 max-w-none markdown-github">
                  <div className="w-full min-w-0 text-black dark:text-gray-300">
                    {(() => {
                      if (project.id !== 'AutoReflex' && project.id !== 'Abyss') {
                        return (
                          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                            {project.content}
                          </ReactMarkdown>
                        );
                      }

                      const embedMarker = /(\n*```(?:circuit-embed|software-embed|abyss-embed|abyss-dataflow-embed|abyss-infra-embed)\s*```\s*\n*)/;
                      const segments = project.content.split(embedMarker);
                      const embeds = [
                        { marker: 'circuit-embed', src: '/api/circuit-diagram', title: 'AutoReflex hardware circuit diagram', height: '560px' },
                        { marker: 'software-embed', src: '/api/software-diagram', title: 'AutoReflex software architecture diagram', height: '420px' },
                        { marker: 'abyss-embed', src: '/api/abyss-diagram', title: 'Abyss system architecture diagram', height: '730px' },
                        { marker: 'abyss-dataflow-embed', src: '/api/abyss-dataflow', title: 'Abyss data flow diagram', height: '580px' },
                        { marker: 'abyss-infra-embed', src: '/api/abyss-infra-diagram', title: 'Abyss AWS infrastructure diagram', height: '605px' },
                      ];
                      let embedIndex = 0;

                      return segments.map((segment, i) => {
                        const embed = embeds.find(e => segment.includes(e.marker));
                        if (embed) {
                          return (
                            <div key={i} className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a2a] not-prose">
                              <iframe
                                src={embed.src}
                                className="w-full border-0"
                                style={{ minHeight: embed.height, height: embed.height }}
                                title={embed.title}
                              />
                            </div>
                          );
                        }
                        return (
                          <ReactMarkdown key={i} components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                            {segment}
                          </ReactMarkdown>
                        );
                      });
                    })()}
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

export async function getStaticPaths() {
  const projectFiles = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
  const paths = [];

  for (const filename of projectFiles) {
    const id = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'src/content/projects', filename),
      'utf-8'
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    if (frontmatter.ignore === true) continue;
    paths.push({ params: { id } });
  }

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
  const headings = extractHeadings(content);
  
  return {
    props: {
      project: {
        id,
        title: frontmatter.title || 'Untitled Project',
        description: frontmatter.description || 'No description available',
        image: frontmatter.image ? getAssetUrl(frontmatter.image) : null,
        icon: frontmatter.icon ? getAssetUrl(frontmatter.icon) : null,
        github: frontmatter.github || null,
        demo: frontmatter.demo || null,
        website: frontmatter.website || null,
        deck: frontmatter.deck || null,
        technologies: frontmatter.technologies || [],
        content,
        headings
      }
    }
  };
}

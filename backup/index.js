import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

export default function Home({ projects, posts }) {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Aarush Agarwal - Personal Website</title>
        <meta name="description" content="Personal website showcasing projects and blog posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center py-20 overflow-hidden bg-gradient-to-br from-purple-300 via-pink-400 to-purple-600">
          <div className="container px-4 mx-auto text-center">
            <motion.h1 
              className="mb-6 text-5xl font-bold text-white uppercase tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AARUSH AGARWAL
            </motion.h1>
            <motion.p 
              className="max-w-lg mx-auto mb-10 text-xl text-purple-100 uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Software Engineer & Problem Solver
            </motion.p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-800 uppercase">Projects</h2>
              <Link href="/projects" className="px-4 py-2 text-purple-700 transition-colors duration-300 border border-purple-700 rounded-lg hover:bg-purple-700 hover:text-white uppercase">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects && projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Latest Posts</h2>
              <Link href="/blog" className="px-4 py-2 text-purple-700 transition-colors duration-300 border border-purple-700 rounded-lg hover:bg-purple-700 hover:text-white">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts && posts.slice(0, 2).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="p-6 transition-transform duration-300 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">{post.title}</h3>
                    <p className="mb-4 text-gray-600">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
    // Get files from the projects directory
    const projectFiles = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
  
    // Get slug and frontmatter from markdown files
    const projects = projectFiles.map(filename => {
      // Create id from filename
      const id = filename.replace('.md', '');
      
      // Read markdown file as string
      const markdownWithMeta = fs.readFileSync(
        path.join(process.cwd(), 'src/content/projects', filename),
        'utf-8'
      );
      
      // Parse markdown frontmatter
      const { data: frontmatter } = matter(markdownWithMeta);
      
      // Return id and data
      return {
        id,
        title: frontmatter.title,
        description: frontmatter.description,
        image: frontmatter.image,
        github: frontmatter.github,
        demo: frontmatter.demo,
        technologies: frontmatter.technologies
      };
    });

  const posts = [
    {
      slug: 'first-post',
      title: 'My First Blog Post',
      excerpt: 'This is a summary of my first blog post.',
      date: '2023-01-01',
      readingTime: 4
    },
    // Add more posts
  ];

  return {
    props: {
      projects,
      posts
    },
    revalidate: 60 // Revalidate at most once per minute
  };
}

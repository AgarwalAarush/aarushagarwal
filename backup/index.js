import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { useState, useEffect } from "react";
import ClientOnly from "../components/ClientOnly";
import Particles from "../components/Particles";
import DynamicProjectCard from "../components/DynamicProjectCard";

import { initMacbookAnimation } from "@/lib/macanimation";

export default function Home({ projects, posts }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const container = document.getElementById("computer-container");
    let cleanup = null;

    const loadAnimation = async () => {
      try {
        cleanup = await initMacbookAnimation(container);
      } catch (error) {
        console.error("Error initializing Macbook animation:", error);
      }
    };

    loadAnimation();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isMounted]);

  // Hero section content defined in one place to ensure consistency
  const heroJSX = (
    <div>
      <motion.h1
        className="mb-6 text-5xl font-bold text-[#f0f0f0] uppercase tracking-wider"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AARUSH AGARWAL
      </motion.h1>
      <motion.p
        className="max-w-lg mx-auto mb-10 text-xl text-[#a0a0a0] uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Software Engineer & Problem Solver
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a
          href="#projects"
          className="px-6 py-3 mt-6 text-[#080a12] bg-[#4cc9f0] rounded-lg hover:bg-[#6e56cf] transition-colors duration-300 inline-block font-medium"
        >
          View My Work
        </a>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1118]">
      <Head>
        <title>Aarush Agarwal - Personal Website</title>
        <meta
          name="description"
          content="Personal website showcasing projects and blog posts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#080a12]">
          {/* Three.js Computer Container - Positioned behind the text */}
          <div className="absolute inset-0 z-10" id="computer-container"></div>

          {/* Particle effect overlay */}
          <div className="absolute inset-0 z-20 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient
                  id="grid-gradient"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="0%" stopColor="#6e56cf" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#080a12" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-gradient)" />

              {/* Grid lines */}
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 30}
                    x2="100%"
                    y2={i * 30}
                    stroke="#4cc9f0"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 30}
                    y1="0"
                    x2={i * 30}
                    y2="100%"
                    stroke="#4cc9f0"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* Random dots as "particles" - Client-side only */}
              <ClientOnly fallback={<Particles count={50} color="#4cc9f0" />}>
                {() => <Particles count={50} color="#4cc9f0" />}
              </ClientOnly>
            </svg>
          </div>

          <div className="container relative z-30 px-4 mx-auto text-center">
            {/* Server-side rendering fallback & client-side animations */}
            <ClientOnly fallback={heroJSX}>
              {() => heroJSX}
            </ClientOnly>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 bg-[#080a12] relative">
          {/* Grid background - extended throughout the section */}
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line
                    key={`ph-${i}`}
                    x1="0"
                    y1={i * 30}
                    x2="100%"
                    y2={i * 30}
                    stroke="#4cc9f0"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line
                    key={`pv-${i}`}
                    x1={i * 30}
                    y1="0"
                    x2={i * 30}
                    y2="100%"
                    stroke="#4cc9f0"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* Random dots as "particles" - Client-side only */}
              <ClientOnly fallback={<Particles count={30} color="#4cc9f0" />}>
                {() => <Particles count={30} color="#4cc9f0" />}
              </ClientOnly>
            </svg>
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            {/* Centered Projects title */}
            <ClientOnly
              fallback={
                <motion.div
                  className="mb-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-[#f0f0f0] uppercase">
                    Projects
                  </h2>
                </motion.div>
              }
            >
              {() => (
                <motion.div
                  className="mb-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-[#f0f0f0] uppercase">
                    Projects
                  </h2>
                </motion.div>
              )}
            </ClientOnly>

            {/* Projects grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects &&
                projects.map((project) => (
                  <div key={project.id}>
                    <DynamicProjectCard project={project} />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-[#080a12] relative">
          {/* Grid background */}
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line
                    key={`bh-${i}`}
                    x1="0"
                    y1={i * 30}
                    x2="100%"
                    y2={i * 30}
                    stroke="#6e56cf"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line
                    key={`bv-${i}`}
                    x1={i * 30}
                    y1="0"
                    x2={i * 30}
                    y2="100%"
                    stroke="#6e56cf"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* Random dots as "particles" - Client-side only */}
              <ClientOnly fallback={<Particles count={30} color="#6e56cf" />}>
                {() => <Particles count={30} color="#6e56cf" />}
              </ClientOnly>
            </svg>
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            {/* Blog header */}
            <ClientOnly
              fallback={
                <motion.div
                  className="flex items-center justify-between mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-[#f0f0f0]">
                    Latest Posts
                  </h2>
                  <Link
                    href="/blog"
                    className="px-4 py-2 text-[#6e56cf] transition-colors duration-300 border border-[#6e56cf] rounded-lg hover:bg-[#6e56cf] hover:text-[#f0f0f0]"
                  >
                    View All
                  </Link>
                </motion.div>
              }
            >
              {() => (
                <motion.div
                  className="flex items-center justify-between mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-[#f0f0f0]">
                    Latest Posts
                  </h2>
                  <Link
                    href="/blog"
                    className="px-4 py-2 text-[#6e56cf] transition-colors duration-300 border border-[#6e56cf] rounded-lg hover:bg-[#6e56cf] hover:text-[#f0f0f0]"
                  >
                    View All
                  </Link>
                </motion.div>
              )}
            </ClientOnly>

            {/* Blog posts */}
            <ClientOnly
              fallback={
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {posts &&
                    posts.slice(0, 2).map((post) => (
                      <div key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>
                          <div className="p-6 overflow-hidden bg-[#0a0c14] rounded-lg shadow-md border border-[#1e1e2d] hover:border-[#9d7bff] hover:shadow-[0_10px_30px_rgba(157,123,255,0.15)] transition-all duration-300 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#6e56cf20] to-[#9d7bff20] rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                              <h3 className="mb-3 text-xl font-semibold text-[#f0f0f0]">
                                {post.title}
                              </h3>
                              <p className="mb-4 text-[#a0a0a0]">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center text-sm text-[#a0a0a0]">
                                <span>
                                  {new Date(post.date).toLocaleDateString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  {post.readingTime} min read
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="text-sm text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300">
                                  Read More →
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              }
            >
              {() => (
                <motion.div
                  className="grid grid-cols-1 gap-8 md:grid-cols-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {posts &&
                    posts.slice(0, 2).map((post) => (
                      <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          whileHover={{ y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link href={`/blog/${post.slug}`}>
                            <div className="p-6 overflow-hidden bg-[#0a0c14] rounded-lg shadow-md border border-[#1e1e2d] hover:border-[#9d7bff] hover:shadow-[0_10px_30px_rgba(157,123,255,0.15)] transition-all duration-300 relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-[#6e56cf20] to-[#9d7bff20] rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative z-10">
                                <h3 className="mb-3 text-xl font-semibold text-[#f0f0f0]">
                                  {post.title}
                                </h3>
                                <p className="mb-4 text-[#a0a0a0]">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm text-[#a0a0a0]">
                                  <span>
                                    {new Date(post.date).toLocaleDateString()}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    {post.readingTime} min read
                                  </span>
                                </div>
                                <div className="mt-4">
                                  <span className="text-sm text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300">
                                    Read More →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </ClientOnly>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  // Get files from the projects directory
  const projectFiles = fs.readdirSync(
    path.join(process.cwd(), "src/content/projects")
  );

  // Get slug and frontmatter from markdown files
  const projects = projectFiles.map((filename) => {
    // Create id from filename
    const id = filename.replace(".md", "");

    // Read markdown file as string
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), "src/content/projects", filename),
      "utf-8"
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
      technologies: frontmatter.technologies,
    };
  });

  const posts = [
    {
      slug: "first-post",
      title: "My First Blog Post",
      excerpt: "This is a summary of my first blog post.",
      date: "2023-01-01",
      readingTime: 4,
    },
    // Add more posts as needed
  ];

  return {
    props: {
      projects,
      posts,
    },
    revalidate: 60, // Revalidate at most once per minute
  };
}
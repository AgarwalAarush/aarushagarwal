import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { useState, useEffect, useRef } from "react";
import ClientOnly from "../components/ClientOnly";
import Image from "next/image";
import Banner from "../components/Banner";

export default function Home({ projects, posts }) {
    const [isMounted, setIsMounted] = useState(false);
    const roles = [
        "Ex MLE Intern @ Shopify",
        "Student Researcher @ CMU",
        "AI @ CMU",
    ];
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [roleIndex, setRoleIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Banner announcements
    const bannerData = {
        topLine: [
            {
                id: 'hackcmu-2024',
                type: 'award',
                title: '1st place at HackCMU'
            },
            {
                id: 'hackharvard-2024',
                type: 'award',
                title: '3rd place at HackHarvard'
            }
        ],
        bottomLine: 'Won 1st Place in YC, Fetch.AI Tracks and Best Startup Award at CalHacks 12.0'
    };

	useEffect(() => {
		setIsMounted(true);
	}, []);

    useEffect(() => {
        const current = roles[roleIndex % roles.length];
        const typingSpeed = isDeleting ? 40 : 90;
        const pauseAtEndMs = 1200;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                const next = current.slice(0, charIndex + 1);
                setTypedText(next);
                setCharIndex(charIndex + 1);
                if (next === current) {
                    setTimeout(() => setIsDeleting(true), pauseAtEndMs);
                }
            } else {
                const next = current.slice(0, charIndex - 1);
                setTypedText(next);
                setCharIndex(charIndex - 1);
                if (next.length === 0) {
                    setIsDeleting(false);
                    setRoleIndex((roleIndex + 1) % roles.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [roles, roleIndex, charIndex, isDeleting]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
			<Head>
				<title>Aarush Agarwal - Personal Website</title>
				<meta
					name="description"
					content="Personal website showcasing projects and blog posts"
				/>
				<link rel="icon" href="/images/profile-pic.png" />
				<link rel="apple-touch-icon" href="/images/profile-pic.png" />
			</Head>
            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Banner Section */}
                <Banner bannerData={bannerData} />

				{/* Hero Section */}
                <section className="mb-16">
                    <div className="max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-2xl text-left">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3">
                                Aarush Agarwal
                            </h1>
                            <p className="text-xl text-gray-900 dark:text-white mb-6 h-7">
                                <span className="text-gray-700 dark:text-gray-400">{typedText}</span>
                                <span className="ml-1 inline-block w-3 bg-gray-900 dark:bg-white animate-pulse" style={{height: '1.1em'}}></span>
                            </p>
                            <div className="flex gap-4">
                                <Link href="/about" className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    About
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                                <Image src="/images/profile-pic.jpeg" alt="Aarush" width={240} height={240} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <a
                                    href="/documents/Resume%20-%20Aarush%20Agarwal.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                >
                                    Resume
                                </a>
                                <a
                                    href="https://github.com/agarwalaarush"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-md border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                    aria-label="GitHub"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.31.76-1.6-2.67-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/aarush-agarwal-2751a61b1/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-md border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.96 0-1.73-.79-1.73-1.73s.77-1.73 1.73-1.73 1.73.79 1.73 1.73-.77 1.73-1.73 1.73zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.88 0-2.17 1.46-2.17 2.97v5.7h-3v-10h2.88v1.37h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.6v5.57z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                        
				</section>

                {/* Internships Section */}
                <section id="internships" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Internships</h2>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 overflow-hidden">
                                    <Image src="/images/shopify.png" alt="Shopify" width={24} height={24} className="w-6 h-6 object-contain" />
                                </span>
                                MLE Intern — Shopify
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">May 2025 – Aug 2025</span>
                        </div>
                        <div className="space-y-4 text-sm">
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold text-gray-900 dark:text-white">Fraud Detection:</span> Developed a more robust buyer‑fraud detection system by implementing machine learning models with VertexAI and optimizing data pipelines with BigQuery and Dataflow. Improvements to data freshness and analysis increased predictive accuracy, while targeted feature selection significantly reduced training iteration time.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold text-gray-900 dark:text-white">AI Agent Network:</span> Built a distributed agent framework powered by Neo4j, where specialized AI agents collaborated through graph traversal queries. This enabled intelligent task decomposition and significantly improved the quality and efficiency of automated output. <span className="font-bold text-gray-900 dark:text-white">Patent filed.</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Research Summary Card */}
                <section id="research" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research</h2>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                ML & CUDA Researcher — Carnegie Mellon University
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Aug 2024 – Aug 2025</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-1">Physics Cosmology Laboratory</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Supervisor: Professor Mateo Cremonesi</p>
                        <div className="space-y-3 text-sm">
                            <p className="text-gray-700 dark:text-gray-300">
                                Co-authored paper focused on spatial-partitioning a parallelized K-Nearest Neighbors algorithm, achieving up to a 200x speedup over FAISS (Facebook AI Similarity), Annoy (Spotify), and SCANN (Google) in low-dimensional (2-5) spaces.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                Transitioned Python autograd and gradient functions to C++ and CUDA extension implementations and integrated with PyTorch JIT serialization, achieving a 10% decrease in KNN runtime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Projects Section with expand/collapse */}
                <section id="projects" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {(projects || [])
                            .slice(0, showAllProjects ? projects.length : 4)
                            .map((project) => (
                                <ProjectCard key={project.id} project={project} showTechnologies={false} />
                            ))}
                    </div>
                    <button onClick={() => setShowAllProjects(!showAllProjects)} className="inline-block px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                        {showAllProjects ? 'Minimize' : 'View more'}
                    </button>
                </section>

                {/* Thoughts Section at bottom */}
                <section id="blog" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thoughts</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-8">
                        Sharing experiences, knowledge and views on tech.
                    </p>
                    
                    <div className="space-y-4">
                        {posts && posts.slice(0, 3).map((post) => (
                            <div key={post.slug} className="group">
                                <Link href={`/thoughts/${post.slug}`}>
                                    <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                        <div className="text-gray-500">+</div>
                                        <div className="flex-1">
                                            <h3 className="text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-500">Article</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom space */}
			</main>
		</div>
	);
}

export async function getStaticProps() {
	const projectFiles = fs.readdirSync(
		path.join(process.cwd(), "src/content/projects")
	);
	const projects = projectFiles.map((filename) => {
		const id = filename.replace(".md", "");
		const markdownWithMeta = fs.readFileSync(
			path.join(process.cwd(), "src/content/projects", filename),
			"utf-8"
		);
		const { data: frontmatter } = matter(markdownWithMeta);
		return {
			id,
			title: frontmatter.title || "Untitled Project",
			description: frontmatter.description || "No description available",
			image: frontmatter.image || null,
			icon: frontmatter.icon || null,
			github: frontmatter.github || null,
			demo: frontmatter.demo || null,
			technologies: frontmatter.technologies || [],
			ranking: frontmatter.ranking || 999,
		};
	}).sort((a, b) => a.ranking - b.ranking);

	// Load blog posts from markdown files
	const blogDir = path.join(process.cwd(), "src/content/thoughts");
	let posts = [];
	
	if (fs.existsSync(blogDir)) {
		const filenames = fs.readdirSync(blogDir);
		posts = filenames
			.filter(name => name.endsWith('.md'))
			.map((filename) => {
				const slug = filename.replace('.md', '');
				const fullPath = path.join(blogDir, filename);
				const fileContents = fs.readFileSync(fullPath, 'utf8');
				const { data: frontmatter } = matter(fileContents);

				return {
					slug,
					title: frontmatter.title || "Untitled",
					excerpt: frontmatter.excerpt || "",
					date: frontmatter.date || null,
					readingTime: frontmatter.readingTime ?? 5,
					published: frontmatter.published !== false,
				};
			})
			.filter(post => post.published) // Only show published posts
			.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
	}

	return {
		props: {
			projects,
			posts,
		},
		revalidate: 60,
	};
}

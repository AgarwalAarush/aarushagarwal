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
				{/* Hero Section */}
                <section className="mb-16">
                    <div className="max-w-4xl flex items-start justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                Aarush Agarwal
                            </h1>
                            <p className="text-lg text-gray-900 dark:text-white mb-6 h-7">
                                <span className="text-gray-700 dark:text-gray-400">{typedText}</span>
                                <span className="ml-1 inline-block w-3 bg-gray-900 dark:bg-white animate-pulse" style={{height: '1.1em'}}></span>
                            </p>
                        </div>
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <Image src="/aarush.jpeg" alt="Aarush" width={144} height={144} className="w-full h-full object-cover" />
                        </div>
                    </div>
                        <div className="flex gap-4">
                            <Link href="/about" className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                                About
                            </Link>
                        </div>
				</section>

                {/* Projects Section with expand/collapse */}
                <section id="projects" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-8">
                        Explore my range of AI and software projects.
                    </p>
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

                {/* Research Summary Card above Thoughts */}
                <section id="research" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research</h2>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">CUDA Optimization for Particle Physics ML</h3>
                        <p className="text-blue-700 dark:text-blue-400 font-medium">Carnegie Mellon University</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Physics Cosmology Laboratory • Supervisor: Professor Mateo Cremonesi • Aug 2024 - Present</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">High-performance computing optimization for ML in particle physics. Novel algorithms for collision detection using graph neural networks; building C++/CUDA extensions with significant speedups over FAISS in low-dimensional spaces.</p>
                    </div>
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

                {/* Research Summary Card at very bottom */}
                <section id="research" className="mb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research</h2>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">CUDA Optimization for Particle Physics ML</h3>
                        <p className="text-blue-700 dark:text-blue-400 font-medium">Carnegie Mellon University</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Physics Cosmology Laboratory • Supervisor: Professor Mateo Cremonesi • Aug 2024 - Present</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">High-performance computing optimization for ML in particle physics. Novel algorithms for collision detection using graph neural networks; building C++/CUDA extensions with significant speedups over FAISS in low-dimensional spaces.</p>
                    </div>
                </section>
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
		};
	});

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

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { useState, useEffect, useRef } from "react";
import ClientOnly from "../components/ClientOnly";

export default function Home({ projects, posts }) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-[#1D1E21]">
			<Head>
				<title>Aarush Agarwal - Personal Website</title>
				<meta
					name="description"
					content="Personal website showcasing projects and blog posts"
				/>
				<link rel="icon" href="/icon.png" />
			</Head>
			<main className="max-w-4xl mx-auto px-6 py-16">
				{/* Hero Section */}
				<section className="mb-16">
					<div className="max-w-2xl">
						<h1 className="text-4xl font-bold text-white mb-6">
							Hey, I'm Aarush.
						</h1>
						<p className="text-xl text-white mb-4">
							I build <span className="text-gray-400">software</span> and specialise in{" "}
							<span className="text-gray-400">AI strategies</span>.
						</p>
						<p className="text-gray-400 mb-8 leading-relaxed">
							A software engineer, AI enthusiast and entrepreneur based in the Bay Area,
							specialising in the world of artificial intelligence and software development.
						</p>
						<div className="flex gap-4">
							<Link href="/about" className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200">
								About
							</Link>
						</div>
					</div>
				</section>

				{/* Thoughts Section */}
				<section id="blog" className="mb-16">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-1 h-1 bg-white rounded-full"></div>
						<h2 className="text-2xl font-bold text-white">Thoughts</h2>
					</div>
					<p className="text-gray-400 mb-8">
						Sharing experiences, knowledge and views on tech.
					</p>
					
					<div className="space-y-4">
						{posts && posts.slice(0, 3).map((post) => (
							<div key={post.slug} className="group">
								<Link href={`/blog/${post.slug}`}>
									<div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
										<div className="text-gray-500">+</div>
										<div className="flex-1">
											<h3 className="text-white group-hover:text-gray-300 transition-colors duration-200">
												{post.title}
											</h3>
											<p className="text-sm text-gray-500">Article</p>
										</div>
									</div>
								</Link>
							</div>
						))}
					</div>
				</section>

				{/* Projects Section */}
				<div className="w-full" id="projects">
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-2 bg-gray-700 rounded-md">
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-white">Projects</h3>
						</div>
						<p className="text-gray-400 mb-6">
							Explore my range of AI and software projects.
						</p>
						<Link href="/projects" className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200">
							View Projects
						</Link>
					</div>
				</div>
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
			title: "Getting Started with Machine Learning",
			excerpt: "A comprehensive guide to understanding ML fundamentals.",
			date: "2023-01-01",
			readingTime: 4,
		},
		{
			slug: "second-post", 
			title: "Building Scalable Web Applications",
			excerpt: "Best practices for developing robust web systems.",
			date: "2023-02-01",
			readingTime: 6,
		},
		{
			slug: "third-post",
			title: "The Future of AI Development",
			excerpt: "Exploring emerging trends in artificial intelligence.",
			date: "2023-03-01", 
			readingTime: 5,
		},
	];

	return {
		props: {
			projects,
			posts,
		},
		revalidate: 60,
	};
}

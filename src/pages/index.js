import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { useState, useEffect, useRef } from "react";
import ClientOnly from "../components/ClientOnly";
import Particles from "../components/Particles";

import { initMacbookAnimation } from "@/lib/macanimationgl";
import { initAIAnimation } from "@/lib/aianimationgl";

export default function Home({ projects, posts }) {
	const [isMounted, setIsMounted] = useState(false);
	const [scrollOpacity, setScrollOpacity] = useState(1);
	const exploreTextRef = useRef(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;
		const container = document.getElementById("computer-container");
		let cleanup = null;
		const loadAnimation = async () => {
			try {
				cleanup = await initAIAnimation(container);
			} catch (error) {
				console.error("Error initializing AI animation:", error);
			}
		};
		loadAnimation();
		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, [isMounted]);

	// Add scroll listener for fade effect
	useEffect(() => {
		if (!isMounted) return;
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const fadeStart = 0;
			const fadeEnd = 300;
			const fadeRange = fadeEnd - fadeStart;
			let newOpacity = 1;
			if (scrollPosition <= fadeStart) {
				newOpacity = 1;
			} else if (scrollPosition >= fadeEnd) {
				newOpacity = 0;
			} else {
				newOpacity = 1 - (scrollPosition - fadeStart) / fadeRange;
			}
			setScrollOpacity(newOpacity);
			if (exploreTextRef.current) {
				exploreTextRef.current.style.opacity = newOpacity;
			}
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMounted]);

	const heroContent = (
		<>
			<h1 className="mb-6 text-5xl font-bold text-[#f0f0f0] uppercase tracking-wider">
				AARUSH AGARWAL
			</h1>
			<p className="max-w-lg mx-auto mb-10 text-xl text-[#a0a0a0] uppercase">
				Software Engineer & Problem Solver
			</p>
		</>
	);

	return (
		<div className="min-h-screen section-bg">
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
				<section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden section-bg">
					<div
						className="absolute inset-0 z-10"
						id="computer-container"
					></div>
					<div className="absolute inset-0 z-20 opacity-30">
						<svg
							width="100%"
							height="100%"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<radialGradient
									id="grid-gradient"
									cx="50%"
									cy="50%"
									r="50%"
									fx="50%"
									fy="50%"
								>
									<stop
										offset="0%"
										stopColor="#6e56cf"
										stopOpacity="0.3"
									/>
									<stop
										offset="100%"
										stopColor="#080a12"
										stopOpacity="0"
									/>
								</radialGradient>
							</defs>
							<rect
								width="100%"
								height="100%"
								fill="url(#grid-gradient)"
							/>
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
							<ClientOnly>
								<Particles count={50} color="#4cc9f0" />
							</ClientOnly>
						</svg>
					</div>
					<div className="container relative z-30 px-4 mx-auto text-center">
						<ClientOnly fallback={<div>{heroContent}</div>}>
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
							</div>
						</ClientOnly>
					</div>
					<motion.div
						ref={exploreTextRef}
						className="absolute bottom-24 left-0 right-0 text-center z-30"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 1 }}
						style={{ opacity: scrollOpacity }}
					>
						<p className="text-[#f0f0f0] text-base uppercase tracking-widest">
							Continue Exploring
						</p>
						<motion.div
							className="mt-1"
							animate={{ y: [0, 10, 0] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "loop",
							}}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mx-auto"
							>
								<path
									d="M7 10L12 15L17 10"
									stroke="#f0f0f0"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</motion.div>
					</motion.div>
				</section>

				{/* Projects Section */}
				<section id="projects" className="py-16 section-bg relative">
					{/* Grid background */}
					<div className="absolute inset-0 z-0 opacity-30">
						<svg
							width="100%"
							height="100%"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* <defs>
								<radialGradient id="projects-grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
									<stop offset="0%" stopColor="#6e56cf" stopOpacity="0.3" />
									<stop offset="100%" stopColor="#080a12" stopOpacity="0" />
								</radialGradient>
							</defs> */}
							<rect
								width="100%"
								height="100%"
								fill="url(#projects-grid-gradient)"
							/>
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
							<ClientOnly>
								<Particles count={30} color="#4cc9f0" />
							</ClientOnly>
						</svg>
					</div>
					<div className="container relative z-10 px-4 mx-auto">
						<ClientOnly
							fallback={
								<div className="mb-12 text-center">
									<h2 className="text-3xl font-bold text-[#f0f0f0] uppercase">
										Projects
									</h2>
								</div>
							}
						>
							<motion.div
								className="mb-12 text-center"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true, amount: 0.2 }}
							>
								<h2 className="text-3xl font-bold text-[#f0f0f0] uppercase">
									Projects
								</h2>
							</motion.div>
						</ClientOnly>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{projects &&
								projects.map((project) => (
									<div key={project.id}>
										<ClientOnly
											fallback={
												<ProjectCard
													project={project}
												/>
											}
										>
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												whileInView={{
													opacity: 1,
													y: 0,
												}}
												transition={{ duration: 0.5 }}
												viewport={{ once: true }}
											>
												<ProjectCard
													project={project}
												/>
											</motion.div>
										</ClientOnly>
									</div>
								))}
						</div>
					</div>
				</section>

				{/* Blog Section */}
				<section className="py-16 section-bg relative">
					{/* Grid background */}
					<div className="absolute inset-0 z-0 opacity-30">
						<svg
							width="100%"
							height="100%"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* <defs>
								<radialGradient id="blog-grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
									<stop offset="0%" stopColor="#6e56cf" stopOpacity="0.3" />
									<stop offset="100%" stopColor="#080a12" stopOpacity="0" />
								</radialGradient>
							</defs> */}
							<rect
								width="100%"
								height="100%"
								fill="url(#blog-grid-gradient)"
							/>
							<g opacity="0.2">
								{[...Array(20)].map((_, i) => (
									<line
										key={`bh-${i}`}
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
										key={`bv-${i}`}
										x1={i * 30}
										y1="0"
										x2={i * 30}
										y2="100%"
										stroke="#4cc9f0"
										strokeWidth="0.5"
									/>
								))}
							</g>
							<ClientOnly>
								<Particles count={50} color="#4cc9f0" />
							</ClientOnly>
						</svg>
					</div>
					<div className="container relative z-10 px-4 mx-auto">
						<ClientOnly
							fallback={
								<div className="flex items-center justify-between mb-12">
									<h2 className="text-3xl font-bold text-[#f0f0f0]">
										Latest Posts
									</h2>
									<Link
										href="/blog"
										className="px-4 py-2 text-[#6e56cf] transition-colors duration-300 border border-[#6e56cf] rounded-lg hover:bg-[#6e56cf] hover:text-[#f0f0f0]"
									>
										View All
									</Link>
								</div>
							}
						>
							<motion.div
								className="flex items-center justify-between mb-12"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
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
						</ClientOnly>
						<ClientOnly
							fallback={
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
									{posts &&
										posts.slice(0, 2).map((post) => (
											<div key={post.slug}>
												<Link
													href={`/blog/${post.slug}`}
												>
													<div className="p-6 overflow-hidden section-bg rounded-lg shadow-md border border-[#1e1e2d] hover:border-[#9d7bff] hover:shadow-[0_10px_30px_rgba(157,123,255,0.15)] transition-all duration-300 relative group">
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
																	{new Date(
																		post.date
																	).toLocaleDateString()}
																</span>
																<span className="mx-2">
																	•
																</span>
																<span>
																	{
																		post.readingTime
																	}{" "}
																	min read
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
							<motion.div
								className="grid grid-cols-1 gap-8 md:grid-cols-2"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									staggerChildren: 0.1,
								}}
								viewport={{ once: true, amount: 0.1 }}
							>
								{posts &&
									posts.slice(0, 2).map((post) => (
										<motion.div
											key={post.slug}
											initial={{ opacity: 0, y: 20 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5 }}
											viewport={{ once: true }}
										>
											<motion.div
												whileHover={{ y: -10 }}
												transition={{ duration: 0.3 }}
											>
												<Link
													href={`/blog/${post.slug}`}
												>
													<div className="p-6 overflow-hidden section-bg rounded-lg shadow-md border border-[#1e1e2d] hover:border-[#9d7bff] hover:shadow-[0_10px_30px_rgba(157,123,255,0.15)] transition-all duration-300 relative group">
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
																	{new Date(
																		post.date
																	).toLocaleDateString()}
																</span>
																<span className="mx-2">
																	•
																</span>
																<span>
																	{
																		post.readingTime
																	}{" "}
																	min read
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
						</ClientOnly>
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
		// Add more posts
	];

	return {
		props: {
			projects,
			posts,
		},
		revalidate: 60,
	};
}

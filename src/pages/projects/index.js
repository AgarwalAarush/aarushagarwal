import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import { motion } from "framer-motion";
import ProjectCard from "../../components/ProjectCard";
import { useState, useEffect } from "react";
import ClientOnly from "../../components/ClientOnly";

export default function ProjectsPage({ projects }) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-[#1D1E21]">
			<Head>
				<title>Projects | Aarush Agarwal</title>
				<meta
					name="description"
					content="A collection of my AI and software development projects"
				/>
				<link rel="icon" href="/images/profile-pic.png" />
				<link rel="apple-touch-icon" href="/images/profile-pic.png" />
			</Head>
			<main className="max-w-4xl mx-auto px-6 py-16">
				{/* Header Section */}
				<section className="mb-16">
					<div className="max-w-2xl">
						<h1 className="text-4xl font-bold text-white mb-6">
							Projects
						</h1>
						<p className="text-gray-400 leading-relaxed">
							A collection of AI and software development projects showcasing my work in machine learning, web development, and innovative solutions.
						</p>
					</div>
				</section>

				{/* Projects Grid */}
				<section>
					<div className="grid grid-cols-1 gap-6">
						{projects && projects.length > 0 ? (
							projects.map((project) => (
								<div key={project.id}>
									<ClientOnly
										fallback={
											<ProjectCard project={project} />
										}
									>
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ 
												duration: 0.5,
												delay: projects.indexOf(project) * 0.1 
											}}
										>
											<ProjectCard project={project} />
										</motion.div>
									</ClientOnly>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<p className="text-gray-400 text-lg">
									No projects found. Check back soon for updates!
								</p>
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}

export async function getStaticProps() {
	try {
		const projectsDirectory = path.join(process.cwd(), "src/content/projects");
		
		// Check if the projects directory exists
		if (!fs.existsSync(projectsDirectory)) {
			return {
				props: {
					projects: [],
				},
				revalidate: 60,
			};
		}

		const projectFiles = fs.readdirSync(projectsDirectory);
		const projects = projectFiles
			.filter(filename => filename.endsWith('.md'))
			.map((filename) => {
				const id = filename.replace(".md", "");
				const markdownWithMeta = fs.readFileSync(
					path.join(projectsDirectory, filename),
					"utf-8"
				);
				const { data: frontmatter } = matter(markdownWithMeta);
				return {
					id,
					title: frontmatter.title || 'Untitled Project',
					description: frontmatter.description || 'No description available',
					image: frontmatter.image || null,
					icon: frontmatter.icon || null,
					github: frontmatter.github || null,
					demo: frontmatter.demo || null,
					technologies: frontmatter.technologies || [],
					ranking: frontmatter.ranking || 999, // Default high number for items without ranking
				};
			})
			.sort((a, b) => a.ranking - b.ranking); // Sort by ranking, lowest numbers first

		return {
			props: {
				projects,
			},
			revalidate: 60,
		};
	} catch (error) {
		console.error('Error loading projects:', error);
		return {
			props: {
				projects: [],
			},
			revalidate: 60,
		};
	}
}

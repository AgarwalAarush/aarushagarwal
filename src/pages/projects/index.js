import Head from "next/head";
import ProjectCard from "../../components/ProjectCard";
import { motion } from "framer-motion";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Projects({ projects }) {
	return (
		<div className="min-h-screen py-12 bg-gray-50">
			<Head>
				<title>Projects | Your Name</title>
				<meta
					name="description"
					content="Portfolio of projects by Your Name"
				/>
			</Head>

			<div className="container px-4 mx-auto">
				<motion.h1
					className="mb-10 text-4xl font-bold text-center text-gray-800"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					My Projects
				</motion.h1>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	// Get files from the projects directory
	const files = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
	
	// Get slug and frontmatter from markdown files
	const projects = files.map(filename => {
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

	return {
		props: {
			projects,
		},
	};
}

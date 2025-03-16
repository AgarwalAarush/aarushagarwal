import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// We're removing ClientOnly to directly handle client/server rendering
export default function ProjectCard({ project }) {
	// Track mounting status manually
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Card content that's shared between server and client render
	const cardContent = (
		<div className="p-6 bg-[#0a0c14] border border-[#1e1e2d] rounded-lg hover:border-[#4cc9f0] transition-all duration-300 h-full flex flex-col">
			{/* Conditional image rendering */}
			{project.image && (
				<div className="mb-4 overflow-hidden rounded-md">
					<img
						src={project.image}
						alt={project.title}
						className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
					/>
				</div>
			)}

			<h3 className="mb-3 text-xl font-bold text-[#f0f0f0]">
				{project.title}
			</h3>

			<p className="mb-4 text-[#a0a0a0] flex-grow">
				{project.description}
			</p>

			{/* Technologies */}
			{project.technologies && (
				<div className="flex flex-wrap mb-4 gap-2">
					{project.technologies.map((tech, index) => (
						<span
							key={index}
							className="px-2 py-1 text-xs font-medium rounded-full bg-[rgba(76,201,240,0.1)] text-[#4cc9f0]"
						>
							{tech}
						</span>
					))}
				</div>
			)}

			{/* Links */}
			<div className="flex mt-auto space-x-5">
				{project.github && (
					<a
						href={project.github}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300"
						onClick={(e) => e.stopPropagation()} // Prevent the Link from triggering
					>
						GitHub
					</a>
				)}

				{project.demo && (
					<a
						href={project.demo}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-[#6e56cf] hover:text-[#9d7bff] transition-colors duration-300"
						onClick={(e) => e.stopPropagation()} // Prevent the Link from triggering
					>
						Live Demo
					</a>
				)}
			</div>
		</div>
	);

	// The wrapper for our card - this will be consistent between server and client
	return (
		<Link href={`/projects/${project.id}`} legacyBehavior>
			<a className="block">
				<div className="overflow-hidden rounded-lg shadow-lg cursor-pointer">
					{isMounted ? (
						<motion.div
							whileHover={{ y: -10 }}
							transition={{ duration: 0.3 }}
						>
							{cardContent}
						</motion.div>
					) : (
						// On server and during initial client render before hydration
						<div>{cardContent}</div>
					)}
				</div>
			</a>
		</Link>
	);
}

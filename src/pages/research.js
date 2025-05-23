import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Research() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const research = [
		{
			year: "August 2024 - Present",
			title: "CUDA Optimization for Particle Physics ML",
			institution: "Carnegie Mellon University",
			supervisor: "Professor Mateo Cremonesi",
			lab: "Physics Cosmology Laboratory",
			description: "Conducting cutting-edge research in high-performance computing optimization for machine learning applications in particle physics. Focus on developing novel algorithms for particle collision detection using graph neural networks.",
			achievements: [
				"Developing high-performance CUDA extensions by transitioning critical Python code to optimized C++ implementations",
				"Achieving up to 40x speed improvements over FAISS in low-dimensional vector spaces through novel K-Nearest Neighbors algorithm optimization",
				"Conducting comprehensive performance benchmarking against industry-standard libraries including FAISS, Annoy, and HNSW",
			],
			publications: [
				{
					title: "Optimizing K-Nearest Neighbors Algorithm Using Spatial Partitioning in Low-Dimensional Spaces",
					status: "In Progress (Authoring Phase)",
					description: "Research paper detailing novel optimization techniques for KNN algorithms with significant performance improvements over industry standards in low-dimensional spaces"
				}
			],
			technologies: [
				"CUDA", "C++", "Python", "Graph Neural Networks", "FAISS", "Annoy", "HNSW", "PyTorch", "High-Performance Computing"
			],
			type: "current"
		}
	];

	const researchInterests = [
		{
			area: "High-Performance Computing",
			description: "Optimizing machine learning algorithms for parallel processing using CUDA and GPU acceleration"
		},
		{
			area: "Graph Neural Networks",
			description: "Developing and optimizing GNN architectures for particle physics and scientific computing applications"
		},
		{
			area: "Algorithm Optimization",
			description: "Creating novel approaches to improve performance of fundamental algorithms like K-Nearest Neighbors"
		},
		{
			area: "Machine Learning",
			description: "Applying ML techniques to solve complex problems in physics, particularly particle collision detection"
		}
	];

	return (
		<div className="min-h-screen bg-[#1D1E21]">
			<Head>
				<title>Research | Aarush Agarwal</title>
				<meta
					name="description"
					content="Research work by Aarush Agarwal in high-performance computing, CUDA optimization, and machine learning for particle physics"
				/>
				<link rel="icon" href="/images/profile-pic.png" />
				<link rel="apple-touch-icon" href="/images/profile-pic.png" />
			</Head>

			<main className="max-w-4xl mx-auto px-6 py-16">
				{/* Header Section */}
				<section className="mb-16">
					<h1 className="text-4xl font-bold text-white mb-4">
						Research
					</h1>
					<p className="text-lg text-gray-300 mb-8">
						Advancing the frontiers of high-performance computing and machine learning for scientific applications.
					</p>
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<p className="text-gray-300 leading-relaxed">
							My research focuses on the intersection of high-performance computing, machine learning, and particle physics. 
							I work on developing novel optimization techniques that bridge the gap between theoretical algorithms and 
							practical implementations, with particular emphasis on CUDA programming and graph neural networks for 
							scientific computing applications.
						</p>
					</div>
				</section>

				{/* Current Research */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Current Research</h2>
					<div className="space-y-8">
						{research.map((item, index) => (
							<motion.div
								key={index}
								className="bg-gray-800/30 rounded-lg p-8 border border-gray-700/50"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
										<p className="text-blue-400 font-medium">{item.institution}</p>
										<p className="text-gray-400 text-sm">{item.lab} • Supervisor: {item.supervisor}</p>
									</div>
									<span className="text-sm text-gray-400 whitespace-nowrap ml-4">{item.year}</span>
								</div>

								<p className="text-gray-300 text-sm mb-6 leading-relaxed">{item.description}</p>

								{/* Key Achievements */}
								<div className="mb-6">
									<h4 className="text-lg font-semibold text-white mb-3">Key Research Contributions</h4>
									<ul className="space-y-2">
										{item.achievements.map((achievement, achIndex) => (
											<li key={achIndex} className="text-gray-300 text-sm flex items-start">
												<span className="text-blue-400 mr-3 mt-1.5">•</span>
												<span>{achievement}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Publications */}
								{item.publications && (
									<div className="mb-6">
										<h4 className="text-lg font-semibold text-white mb-3">Publications & Papers</h4>
										{item.publications.map((pub, pubIndex) => (
											<div key={pubIndex} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
												<h5 className="font-medium text-white mb-1">{pub.title}</h5>
												<p className="text-blue-400 text-sm mb-2">Status: {pub.status}</p>
												<p className="text-gray-300 text-sm">{pub.description}</p>
											</div>
										))}
									</div>
								)}

								{/* Technologies */}
								<div>
									<h4 className="text-lg font-semibold text-white mb-3">Technologies & Tools</h4>
									<div className="flex flex-wrap gap-2">
										{item.technologies.map((tech, techIndex) => (
											<span
												key={techIndex}
												className="px-3 py-1 bg-[#181818] text-white rounded-sm text-sm font-medium"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</section>

				{/* Research Interests */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Research Interests</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{researchInterests.map((interest, index) => (
							<motion.div
								key={index}
								className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<h3 className="text-lg font-bold text-white mb-3">{interest.area}</h3>
								<p className="text-gray-300 text-sm">{interest.description}</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* Impact & Metrics */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Research Impact</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center">
							<div className="text-3xl font-bold text-blue-400 mb-2">40x</div>
							<div className="text-white font-medium mb-1">Speed Improvement</div>
							<div className="text-gray-400 text-sm">Over FAISS in low-dimensional spaces</div>
						</div>
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center">
							<div className="text-3xl font-bold text-blue-400 mb-2">1</div>
							<div className="text-white font-medium mb-1">Paper in Progress</div>
							<div className="text-gray-400 text-sm">KNN optimization research</div>
						</div>
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center">
							<div className="text-3xl font-bold text-blue-400 mb-2">10+</div>
							<div className="text-white font-medium mb-1">Months Active</div>
							<div className="text-gray-400 text-sm">Ongoing research at CMU</div>
						</div>
					</div>
				</section>

				{/* Collaboration */}
				<section>
					<h2 className="text-2xl font-bold text-white mb-6">Research Collaboration</h2>
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<p className="text-gray-300 mb-4 leading-relaxed">
							I&apos;m always interested in collaborating on research projects that push the boundaries of high-performance 
							computing and machine learning. My current work focuses on practical applications of optimization techniques 
							for scientific computing, but I&apos;m open to exploring new domains and applications.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link href="/contact" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-center">
								Discuss Research
							</Link>
							<a href="https://www.linkedin.com/in/aarush-agarwal-2751a61b1/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 rounded-md transition-colors duration-200 text-center">
								Connect on LinkedIn
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
} 
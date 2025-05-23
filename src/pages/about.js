import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function About() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const timeline = [
		{
			year: "May 2025 - Present",
			title: "Machine Learning Engineer Intern",
			company: "Shopify",
			description: "Working on the buyer risk pre-auth model that stops fraudsters from transactions. Developing ML infrastructure and fraud detection systems to protect e-commerce transactions and improve platform security.",
			type: "work"
		},
		{
			year: "August 2024 - Present",
			title: "ML & CUDA Researcher",
			company: "Carnegie Mellon University Cosmology Lab",
			description: "Conducting cutting-edge research under Professor Mateo Cremonesi. Optimizing object condensation loss functions for graph neural networks to detect particle collisions in CERN data. Developing high-performance CUDA extensions and achieving up to 40x speed improvements over FAISS.",
			type: "work"
		},
		{
			year: "October 2022 - January 2024",
			title: "Co-Founder & Product Lead",
			company: "MV Test Tracker (MVTT)",
			description: "Co-founded educational technology platform to optimize academic scheduling and reduce student stress. Developed sophisticated optimization algorithms and collaborated with Mountain View High School to create a responsive online portal.",
			type: "work"
		},
		{
			year: "August 2022 - May 2023",
			title: "Founder & President",
			company: "Algorithmic Programming Club",
			description: "Founded and led club to introduce students to advanced CS concepts. Developed comprehensive curriculum covering algorithms and data structures, organized programming competitions.",
			type: "work"
		},
		{
			year: "August 2021 - May 2023",
			title: "Vice President",
			company: "Artificial Intelligence Club",
			description: "Transformed theoretical organization into practical learning environment. Led two teams to semifinalist positions in Mathematics and Technology for Computer Science (MtFC) competition in 2022.",
			type: "work"
		},
		{
			year: "August 2024 - May 2028",
			title: "Bachelor's Degree in Artificial Intelligence",
			company: "Carnegie Mellon University",
			description: "Currently pursuing AI degree with focus on machine learning, high-performance computing, and practical applications. Active in research and competitive programming.",
			type: "education"
		},
		{
			year: "August 2020 - June 2024",
			title: "High School Diploma",
			company: "Mountain View High School",
			description: "Graduated with strong foundation in computer science and mathematics. Led multiple clubs and participated in competitive programming competitions.",
			type: "education"
		}
	];

	const skills = [
		"Python", "C++", "JavaScript", "React", "Next.js", "CUDA Programming", 
		"Machine Learning", "Graph Neural Networks", "High-Performance Computing", "TensorFlow", "PyTorch",
		"Algorithm Optimization", "Parallel Computing", "Full-Stack Development", "OpenAI API"
	];

	const achievements = [
		{
			title: "High-Performance ML Research",
			description: "Achieved up to 40x speed improvements over FAISS in low-dimensional vector spaces through novel K-Nearest Neighbors algorithm optimization using advanced spatial partitioning techniques."
		},
		{
			title: "Educational Technology Impact",
			description: "Co-founded MV Test Tracker, revolutionizing academic scheduling for Mountain View High School and improving student mental health through intelligent test scheduling optimization."
		},
		{
			title: "Competitive Programming Excellence",
			description: "Led two teams to semifinalist positions in the Mathematics and Technology for Computer Science (MtFC) competition in 2022 while serving as Vice President of AI Club."
		},
		{
			title: "CUDA Optimization Research",
			description: "Developing cutting-edge CUDA extensions for particle physics applications, optimizing graph neural networks for particle collision detection in CERN experimental data."
		}
	];

	return (
		<div className="min-h-screen bg-[#1D1E21]">
			<Head>
				<title>About | Aarush Agarwal</title>
				<meta
					name="description"
					content="Learn more about Aarush Agarwal - AI researcher, software engineer, and innovation enthusiast"
				/>
				<link rel="icon" href="/images/profile-pic.png" />
				<link rel="apple-touch-icon" href="/images/profile-pic.png" />
			</Head>
			<main className="max-w-4xl mx-auto px-6 py-16">
				{/* Header Section */}
				<section className="mb-16">
					<div className="flex items-start gap-8 mb-8">
						<div className="w-32 h-32 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
							<Image 
								src="/images/profile-pic.png" 
								alt="Aarush Agarwal"
								width={128}
								height={128}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1">
							<h1 className="text-4xl font-bold text-white mb-4">
								Aarush Agarwal
							</h1>
							<p className="text-xl text-gray-300 mb-4">
								ML Engineer Intern @Shopify | AI @CMU
							</p>
							<p className="text-gray-400 mb-6">
								Los Altos, California • Open to opportunities
							</p>
							<div className="flex gap-4">
								<a href="https://www.linkedin.com/in/aarush-agarwal-2751a61b1/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
									Connect
								</a>
							</div>
						</div>
					</div>
				</section>

				{/* About Summary */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">About</h2>
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<p className="text-gray-300 text-sm leading-relaxed mb-4">
							Machine Learning Engineer and AI researcher with hands-on experience in high-performance computing optimization and practical AI applications. 
							Currently pursuing Artificial Intelligence at Carnegie Mellon University while working as an ML Engineer Intern at Shopify.
						</p>
						<p className="text-gray-300 text-sm leading-relaxed mb-4">
							Passionate about bridging the gap between theoretical AI concepts and real-world implementations, with a focus on CUDA optimization 
							and graph neural networks for particle physics applications. My research involves optimizing machine learning algorithms for 
							high-energy physics, achieving up to 40x speed improvements over industry-standard libraries.
						</p>
						<p className="text-gray-300 text-sm leading-relaxed">
							From co-founding educational technology startups to conducting cutting-edge research in particle physics, I&apos;m always excited 
							to tackle complex problems that make technology more accessible and impactful. I blend entrepreneurial experience with deep 
							technical expertise to create meaningful solutions.
						</p>
					</div>
				</section>

				{/* Experience & Education Timeline */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Experience & Education</h2>
					<div className="space-y-6">
						{timeline.map((item, index) => (
							<motion.div
								key={index}
								className="flex gap-6"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<div className="flex flex-col items-center">
									<div className={`w-4 h-4 rounded-full ${
										item.type === 'work' ? 'bg-blue-500' : 
										item.type === 'education' ? 'bg-green-500' : 'bg-purple-500'
									}`}></div>
									{index < timeline.length - 1 && (
										<div className="w-0.5 h-16 bg-gray-600 mt-2"></div>
									)}
								</div>
								<div className="flex-1 pb-8">
									<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
										<div className="flex justify-between items-start mb-2">
											<h3 className="text-lg font-bold text-white">{item.title}</h3>
											<span className="text-sm text-gray-400">{item.year}</span>
										</div>
										<p className="text-blue-400 font-medium mb-3">{item.company}</p>
										<p className="text-gray-300 text-sm">{item.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</section>

				{/* Key Achievements */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Key Achievements</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{achievements.map((achievement, index) => (
							<motion.div
								key={index}
								className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<h3 className="text-lg font-bold text-white mb-3">{achievement.title}</h3>
								<p className="text-gray-300 text-sm">{achievement.description}</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* Skills */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-white mb-6">Skills & Technologies</h2>
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<div className="flex flex-wrap gap-3">
							{skills.map((skill, index) => (
								<span
									key={index}
									className="px-3 py-2 bg-[#181818] text-white rounded-sm text-sm font-medium"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section>
					<h2 className="text-2xl font-bold text-white mb-6">Let&apos;s Connect</h2>
					<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
						<p className="text-gray-300 mb-6">
							I&apos;m always interested in discussing new opportunities, collaborative projects, or innovative ideas in AI and software development.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<a href="mailto:aarushaga@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Email Me
							</a>

							<a href="https://github.com/agarwalaarush" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 rounded-md transition-colors duration-200">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								GitHub
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
} 
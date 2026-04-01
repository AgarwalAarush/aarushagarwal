import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import ProjectCard from "../components/ProjectCard";
import { useState } from "react";
import Image from "next/image";
import TimelineItem from "../components/TimelineItem";
import { getAssetUrl } from "../lib/assets";

export default function Home({ projects }) {
    const [showAllProjects, setShowAllProjects] = useState(false);

    const heroCtaCell =
        'inline-flex items-center justify-center border border-gray-200 bg-white px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-900 transition-colors hover:bg-gray-50 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-[#1D1E21] dark:text-white dark:hover:bg-gray-800 dark:focus-visible:ring-gray-500 dark:focus-visible:ring-offset-[#1D1E21] rounded-md -ml-px first:ml-0 relative z-0 hover:z-10';

    return (
        <div className="font-soehne-home min-h-screen bg-white dark:bg-[#1D1E21]">
			<Head>
				<title>Aarush Agarwal - Personal Website</title>
				<meta
					name="description"
					content="Personal website showcasing projects and blog posts"
				/>
			</Head>
            <main className="max-w-4xl mx-auto px-6 py-16">
				{/* Hero Section */}
                <section className="mb-16">
                    <div className="max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-2xl text-left md:min-h-60 md:flex md:flex-col md:justify-center">
                            <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-6">
                                Aarush Agarwal
                            </h1>
                            <div className="inline-flex items-stretch gap-0">
                                <a
                                    href={getAssetUrl("/documents/Resume%20-%20Aarush%20Agarwal.pdf")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={heroCtaCell}
                                >
                                    Resume
                                </a>
                                <a
                                    href="https://github.com/agarwalaarush"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={heroCtaCell}
                                    aria-label="GitHub"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/aarush-agarwal-2751a61b1/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={heroCtaCell}
                                    aria-label="LinkedIn"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                                <Image src={getAssetUrl("/images/profile-pic.jpeg")} alt="Aarush" width={240} height={240} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                        
				</section>

                {/* Experiences Section */}
                <section id="experiences" className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl text-gray-900 dark:text-white">Experiences</h2>
                    </div>
                    <div>
                        <TimelineItem
                            icon={getAssetUrl("/images/felicis.png")}
                            iconAlt="Felicis"
                            company="Felicis"
                            role="Venture Fellow"
                            period="January 2026 - Present"
                            description={
                                <p>
                                    Selected as a Venture Fellow in a highly competitive program focused on leveraging AI and technology for real-world impact. Partnering with Felicis to identify, support, and accelerate early-stage student founders across campus.
                                </p>
                            }
                        />
                        <TimelineItem
                            icon={getAssetUrl("/images/shopify.png")}
                            iconAlt="Shopify"
                            company="Shopify"
                            role="MLE Intern"
                            period="May 2025 – Aug 2025"
                            description={
                                <>
                                    <p>
                                        <span className="text-gray-900 dark:text-white">Fraud Detection:</span> Developed a more robust buyer‑fraud detection system by implementing machine learning models with VertexAI and optimizing data pipelines with BigQuery and Dataflow. Improvements to data freshness and analysis increased predictive accuracy, while targeted feature selection significantly reduced training iteration time.
                                    </p>
                                    <p>
                                        <span className="text-gray-900 dark:text-white">AI Agent Network:</span> Built a distributed agent framework powered by Neo4j, where specialized AI agents collaborated through graph traversal queries. This enabled intelligent task decomposition and significantly improved the quality and efficiency of automated output. <span className="text-gray-900 dark:text-white">Patent filed.</span>
                                    </p>
                                </>
                            }
                            isLast={true}
                        />
                    </div>
                </section>

                {/* Research Section */}
                <section id="research" className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl text-gray-900 dark:text-white">Research</h2>
                    </div>
                    <div>
                        <TimelineItem
                            icon={getAssetUrl("/images/moe-research/lti-logo.png")}
                            iconAlt="CMU Language Technologies Institute"
                            company="CMU Language Technologies Institute"
                            role=""
                            period="Jan 2026 – Present"
                            description={
                                <p>
                                    Researching dynamic Mixture-of-Experts (MoE) architectures under Chenyan Xiong, designed to seamlessly integrate private-domain knowledge into Large Language Models while preserving public capabilities. Leveraging memorization sinks and expert specialization, the work employs adaptive routing and mid-training expert duplication to autonomously expand model capacity when novel data arises. This strategy unifies decentralized training environments, such as FlexOlmo, with scalable MoE systems to drive continual learning, effectively balancing strong knowledge isolation with positive transfer.
                                </p>
                            }
                        />
                        <TimelineItem
                            icon={getAssetUrl("/images/cern.png")}
                            iconAlt="CERN"
                            company="CMU Cosmology Laboratory & CERN"
                            role="CUDA Researcher"
                            period="Aug 2024 – Aug 2025"
                            description={
                                <>
                                    <div className="mb-3">
                                        <p className="text-gray-900 dark:text-white mb-1">Paper:</p>
                                        <a
                                            href="https://arxiv.org/abs/2511.10442"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700 dark:text-blue-400 hover:underline"
                                        >
                                            FastGraph: Optimized GPU-Enabled Algorithms for Fast Graph Building and Message Passing
                                        </a>
                                    </div>
                                    <p>
                                        Co-authored FastGraph, a GPU-optimized k-nearest neighbor algorithm that accelerates graph construction in low-dimensional spaces (2–10D) using a bin-partitioned, fully GPU-resident architecture with full gradient-flow support. FastGraph achieves a 20–40× speedup over FAISS, ANNOY, and SCANN with virtually no memory overhead, improving GNN workloads including particle clustering, visual tracking, and large-scale graph clustering.
                                    </p>
                                    <p>
                                        Engineered PyTorch autograd and gradient operations in C++/CUDA and integrated JIT serialization, reducing KNN runtime by an additional 10% and enabling end-to-end differentiability inside GPU training pipelines.
                                    </p>
                                </>
                            }
                            isLast={true}
                        />
                    </div>
                </section>

                {/* Projects Section with expand/collapse */}
                <section id="projects" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-2xl text-gray-900 dark:text-white">Projects</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {(projects || [])
                            .slice(0, showAllProjects ? projects.length : 4)
                            .map((project) => (
                                <ProjectCard key={project.id} project={project} showTechnologies={false} />
                            ))}
                    </div>
                    <button onClick={() => setShowAllProjects(!showAllProjects)} className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors duration-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                        {showAllProjects ? 'Minimize' : 'View more'}
                    </button>
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
	const projects = projectFiles
		.map((filename) => {
			const id = filename.replace(".md", "");
			const markdownWithMeta = fs.readFileSync(
				path.join(process.cwd(), "src/content/projects", filename),
				"utf-8"
			);
			const { data: frontmatter } = matter(markdownWithMeta);
			if (frontmatter.ignore === true) return null;
			return {
				id,
				title: frontmatter.title || "Untitled Project",
				description: frontmatter.description || "No description available",
				image: frontmatter.image ? getAssetUrl(frontmatter.image) : null,
				icon: frontmatter.icon ? getAssetUrl(frontmatter.icon) : null,
				github: frontmatter.github || null,
				demo: frontmatter.demo || null,
				technologies: frontmatter.technologies || [],
				ranking: frontmatter.ranking || 999,
			};
		})
		.filter(Boolean)
		.sort((a, b) => a.ranking - b.ranking);

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

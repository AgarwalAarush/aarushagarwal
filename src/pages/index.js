import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import ProjectCard from "../components/ProjectCard";
import Image from "next/image";
import TimelineItem from "../components/TimelineItem";
import { getAssetUrl } from "../lib/assets";

export default function Home({ projects }) {
    const heroCtaCell =
        'inline-flex items-center justify-center border border-gray-200 bg-white px-6 py-4 text-[13px] md:px-5 md:py-3 md:text-[11px] font-medium uppercase tracking-[0.18em] text-gray-900 transition-colors hover:bg-gray-50 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-[#1D1E21] dark:text-white dark:hover:bg-gray-800 dark:focus-visible:ring-gray-500 dark:focus-visible:ring-offset-[#1D1E21] rounded-md -ml-px first:ml-0 relative z-0 hover:z-10';

    return (
        <div className="font-soehne-home min-h-screen bg-white dark:bg-[#1D1E21]">
			<Head>
				<title>Aarush Agarwal - Personal Website</title>
				<meta
					name="description"
					content="Personal website showcasing projects and blog posts"
				/>
			</Head>
            <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">
				{/* Hero Section */}
                <section className="mb-12 md:mb-16">
                    <div className="max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-6">
                        <div className="max-w-2xl text-left md:min-h-60 md:flex md:flex-col md:justify-center">
                            <h1 className="text-[13vw] md:text-6xl text-gray-900 dark:text-white mb-6 whitespace-nowrap">
                                Aarush Agarwal
                            </h1>
                            <div className="inline-flex items-stretch gap-2">
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
                            <div className="w-56 h-56 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                                <Image src={getAssetUrl("/images/profile-pic.jpeg")} alt="Aarush" width={240} height={240} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                        
				</section>

                {/* Experiences Section */}
                <section id="experiences" className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-3xl md:text-2xl text-gray-900 dark:text-white">Experiences</h2>
                    </div>
                    <div>
                        <TimelineItem
                            icon={getAssetUrl("/images/shopify.png")}
                            iconAlt="Shopify"
                            company="Shopify"
                            role="Machine Learning Engineer Intern"
                            period="May 2026 – Aug 2026"
                            description={
                                <p>
                                    <span className="text-gray-900 dark:text-white">Search Relevance:</span> Working on machine learning ranking and query-understanding systems for Shopify&apos;s commerce search stack, combining semantic retrieval, text-similarity features, and offline/online evaluation to improve product discovery across large, multi-tenant catalogs.
                                </p>
                            }
                        />
                        <TimelineItem
                            icon={getAssetUrl("/images/felicis.png")}
                            iconAlt="Felicis"
                            company="Felicis"
                            role="Venture Fellow"
                            period="January 2026 - Present"
                            description={
                                <>
                                    <p>
                                        Selected as a Venture Fellow in a highly competitive program focused on leveraging AI and technology for real-world impact.
                                    </p>
                                    <p>
                                        Conducting startup diligence and market research for the firm, and co-organized VentureHacks, a Felicis x CMU hackathon with $10K+ in prizes, 500+ applicants, and speakers including Felicis partners and a Skild AI founding researcher.
                                    </p>
                                </>
                            }
                        />
                        <TimelineItem
                            icon={getAssetUrl("/images/shopify.png")}
                            iconAlt="Shopify"
                            company="Shopify"
                            role="Machine Learning Engineer Intern"
                            period="May 2025 – Aug 2025"
                            description={
                                <>
                                    <p>
                                        <span className="text-gray-900 dark:text-white">Fraud Detection:</span> Improved buyer-fraud detection accuracy by 3% and reduced training iteration time by 70% through dimensionality reduction, importance-based feature pruning, and BigQuery/Dataflow + Vertex AI pipeline rebuilds.
                                    </p>
                                    <p>
                                        <span className="text-gray-900 dark:text-white">AI Agent Network:</span> Co-filed a patent for a distributed multi-agent system that decomposes tasks with a Neo4j dependency graph and executes subtasks across specialized agents in parallel.
                                    </p>
                                    <p>
                                        <span className="text-gray-900 dark:text-white">Sequence Modeling:</span> Designed transformer-based fraud models with embeddings and temporal attention over transaction sequences.
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
                        <h2 className="text-3xl md:text-2xl text-gray-900 dark:text-white">Research</h2>
                    </div>
                    <div>
                        <TimelineItem
                            icon={getAssetUrl("/images/moe-research/lti-logo.png")}
                            iconAlt="CMU Language Technologies Institute"
                            company="CMU Language Technologies Institute"
                            role=""
                            period="Jan 2026 – Present"
                            description={
                                <>
                                    <p>
                                        Researching dynamic Mixture-of-Experts architectures under Chenyan Xiong, developing adaptive strategies that expand model capacity on out-of-distribution data while mitigating reasoning degradation in continual pretraining.
                                    </p>
                                    <p>
                                        Designing autonomous research agents that propose, execute, and evaluate model-adaptation experiments across tasks and modalities including vision, clinical, and financial time-series data, iteratively committing variants that improve reasoning and task-benchmark performance over dense backbones.
                                    </p>
                                </>
                            }
                        />
                        <TimelineItem
                            icon={getAssetUrl("/images/cern.png")}
                            iconAlt="CERN"
                            company="CMU Cosmology Laboratory & CERN"
                            role="CUDA Researcher"
                            period="Aug 2024 – Oct 2025"
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
                                        First-authored FastGraph, a GPU-resident differentiable k-nearest neighbor algorithm with custom CUDA kernels for low-dimensional graph neural network workflows. FastGraph accelerates graph construction in 2–10D spaces with a bin-partitioned, fully GPU-resident architecture and achieves 20–40× speedups over FAISS, ANNOY, and SCANN.
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

                {/* Projects — vertical list with image thumbnails */}
                <section id="projects" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <h2 className="text-3xl md:text-2xl text-gray-900 dark:text-white">Projects</h2>
                    </div>
                    <div className="mb-6 flex flex-col divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
                        {(projects || []).map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                showTechnologies={false}
                                showImagePreview={false}
                            />
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
				images: frontmatter.images ? frontmatter.images.map(img => getAssetUrl(img)) : null,
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

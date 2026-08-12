import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import TimelineItem from "../components/TimelineItem";
import HomepageHero from "../components/home/HomepageHero";
import ProjectShowcase from "../components/home/ProjectShowcase";
import SectionNavigator from "../components/home/SectionNavigator";
import SectionHeading from "../components/home/SectionHeading";
import { getAssetUrl } from "../lib/assets";

export default function Home({ projects }) {
  return (
    <div className="homepage-shell min-h-screen bg-[#f4f1eb] text-[#171716]">
      <Head>
        <title>Aarush Agarwal — ML Systems, Research, and Products</title>
        <meta
          name="description"
          content="ML systems, AI products, and research by Aarush Agarwal."
        />
      </Head>

      <HomepageHero />

      <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28 xl:pr-[240px]">
        <section id="research" className="scroll-mt-10 pb-28 lg:pb-40">
          <SectionHeading
            number="01"
            eyebrow="Systems / Intelligence"
            title="Research"
          />

          <TimelineItem
            icon={getAssetUrl("/images/moe-research/lti-logo.png")}
            iconAlt="CMU Language Technologies Institute"
            company="CMU Language Technologies Institute"
            role=""
            period="Jan 2026 – Present"
            description={
              <>
                <div>
                  <a
                    href="https://www.cs.cmu.edu/~cxcscmu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CXC Research Group
                  </a>
                </div>
                <p>
                  Researching dynamic Mixture-of-Experts architectures under
                  Chenyan Xiong, developing adaptive strategies that expand
                  model capacity on out-of-distribution data while mitigating
                  reasoning degradation in continual pretraining.
                </p>
                <p>
                  Designing autonomous research agents that propose, execute,
                  and evaluate model-adaptation experiments across tasks and
                  modalities including vision, clinical, and financial
                  time-series data, iteratively committing variants that
                  improve reasoning and task-benchmark performance over dense
                  backbones.
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
                <div>
                  <span>Paper: </span>
                  <a
                    href="https://arxiv.org/abs/2511.10442"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FastGraph: Optimized GPU-Enabled Algorithms for Fast Graph
                    Building and Message Passing
                  </a>
                </div>
                <p>
                  First-authored FastGraph, a GPU-resident differentiable
                  k-nearest neighbor algorithm with custom CUDA kernels for
                  low-dimensional graph neural network workflows. FastGraph
                  accelerates graph construction in 2–10D spaces with a
                  bin-partitioned, fully GPU-resident architecture and achieves
                  20–40× speedups over FAISS, ANNOY, and SCANN.
                </p>
                <p>
                  Engineered PyTorch autograd and gradient operations in
                  C++/CUDA and integrated JIT serialization, reducing KNN
                  runtime by an additional 10% and enabling end-to-end
                  differentiability inside GPU training pipelines.
                </p>
              </>
            }
            isLast
          />
        </section>

        <section id="experience" className="scroll-mt-10 pb-28 lg:pb-40">
          <SectionHeading
            number="02"
            eyebrow="Industry / Practice"
            title="Experience"
            description="Machine-learning engineering and investment work across commerce, fraud, search, and early-stage technology."
          />

          <TimelineItem
            icon="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-shopping-bag-full-color-66166b2e55d67988b56b4bd28b63c271e2b9713358cb723070a92bde17ad7d63.svg"
            iconAlt="Shopify"
            company="Shopify"
            role="Machine Learning Engineer Intern"
            period="May 2026 – Aug 2026"
            description={
              <>
                <p>
                  <span>Search Relevance:</span> Developing ranking systems for
                  Shopify&apos;s commerce search stack. Fine-tuning and
                  distilling LFM 2.5 models, then deploying them for low-latency
                  DNN inference on custom Triton serving infrastructure.
                </p>
                <p>
                  <span>Merchant-Aware Ranking:</span> Designed and implemented
                  a novel auxiliary merchant-aware training objective that
                  teaches the ranker to prioritize a merchant&apos;s first-party
                  catalog for merchant-intent queries. Improved a core
                  merchant-search relevance metric by 10% while reducing the
                  ranking prominence of third-party resellers.
                </p>
              </>
            }
          />
          <TimelineItem
            icon={getAssetUrl("/images/felicis.png")}
            iconAlt="Felicis"
            company="Felicis"
            role="Venture Fellow"
            period="January 2026 – June 2026"
            description={
              <>
                <p>
                  Selected as a Venture Fellow in a highly competitive program
                  focused on leveraging AI and technology for real-world
                  impact.
                </p>
                <p>
                  Conducted startup diligence and market research across AI and
                  emerging technology. Co-organized VentureHacks, a Felicis ×
                  CMU hackathon that attracted 500+ applicants and awarded
                  $10K+ in prizes, with speakers including Felicis partners and
                  a founding researcher at Skild AI.
                </p>
              </>
            }
          />
          <TimelineItem
            icon="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-shopping-bag-full-color-66166b2e55d67988b56b4bd28b63c271e2b9713358cb723070a92bde17ad7d63.svg"
            iconAlt="Shopify"
            company="Shopify"
            role="Machine Learning Engineer Intern"
            period="May 2025 – Aug 2025"
            description={
              <>
                <p>
                  <span>Fraud Detection:</span> Improved buyer-fraud detection
                  accuracy by 3% and reduced training iteration time by 70%
                  through dimensionality reduction, importance-based feature
                  pruning, and BigQuery/Dataflow + Vertex AI pipeline rebuilds.
                </p>
                <p>
                  <span>AI Agent Network:</span> Co-filed a patent for a
                  distributed multi-agent system that decomposes tasks with a
                  Neo4j dependency graph and executes subtasks across
                  specialized agents in parallel.
                </p>
                <p>
                  <span>Sequence Modeling:</span> Designed transformer-based
                  fraud models with embeddings and temporal attention over
                  transaction sequences.
                </p>
              </>
            }
            isLast
          />
        </section>

        <section id="projects" className="scroll-mt-10 pb-16">
          <SectionHeading
            number="03"
            eyebrow="Selected Work"
            title="Projects"
            description="A focused set of systems that connect models, hardware, and interfaces to real outcomes."
          />
          <ProjectShowcase projects={projects} />
        </section>
      </main>

      <SectionNavigator />
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
			const homepage = frontmatter.homepage
				? {
						...frontmatter.homepage,
						cardImage: frontmatter.homepage.cardImage
							? getAssetUrl(frontmatter.homepage.cardImage)
							: null,
					}
				: null;
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
				homepage,
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

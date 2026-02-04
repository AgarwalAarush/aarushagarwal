import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MarkdownOutline from '../components/MarkdownOutline';
import { extractHeadings } from '../lib/markdownOutline';

const notesContent = `
## Transformer Efficiency Techniques

### Flash Attention
- Computes attention in tiles/blocks rather than materializing the full $N \\times N$ attention matrix
- Uses online softmax to compute attention incrementally, recomputing values during backward pass instead of storing them
- Reduces memory from $O(N^2)$ to $O(N)$ while maintaining exact attention (not an approximation)
- Key insight: memory I/O is the bottleneck, not FLOPs—trading compute for memory access is a net win on modern GPUs

### KV Cache
- During autoregressive generation, keys $K$ and values $V$ for previous tokens don't change—cache them instead of recomputing
- Each new token only needs to compute its own $K/V$ and attend to the cached history
- Reduces per-token inference from $O(N)$ to $O(1)$ attention computation
- Trade-off: memory grows linearly with sequence length $L$, which is why techniques like sliding window attention help for long contexts

### Grouped Query Attention (GQA)
- Instead of separate K/V heads per query head (MHA) or one K/V for all queries (MQA), use $G$ groups
- Multiple query heads share the same K/V heads within a group (e.g., $H_q = 8$ query heads, $H_{kv} = 2$ KV heads = 4 queries per KV)
- Reduces KV cache size by factor of $H_q / H_{kv}$ while retaining most of MHA's expressiveness
- Sweet spot between MQA's efficiency and MHA's quality—used in Llama 2 70B, Mistral, etc.

### Rotary Embeddings (RoPE)
- Encodes position by rotating query and key vectors in 2D subspaces based on position index $m$
- Relative position naturally emerges: $q_m \\cdot k_n$ depends on $(m - n)$ due to rotation properties
- The rotation matrix $R_\\theta^m$ applied to position $m$ uses angles $\\theta_i = 10000^{-2i/d}$
- No learned position embeddings—positions are encoded through geometric rotation
- Enables length extrapolation (with modifications like NTK-aware scaling or YaRN) beyond training context

## Notable LLM Architectures & Papers

### Flash Attention
- Tri Dao's IO-aware algorithm that avoids materializing the $N \\\\times N$ attention matrix to HBM
- Tiles computation into blocks that fit in SRAM, computing softmax incrementally via online normalization trick
- Recomputes attention in backward pass rather than storing activations—trades $O(N)$ extra FLOPs for $O(N^2)$ → $O(N)$ memory
- Flash Attention 2 adds better work partitioning across warps and reduces non-matmul FLOPs for ~2x speedup
- Flash Attention 3 uses tensor cores for softmax, warp specialization, and FP8 support for Hopper GPUs

[Paper: FlashAttention: Fast and Memory-Efficient Exact Attention](https://arxiv.org/abs/2205.14135)

### OLMoE
- Mixture-of-Experts variant of OLMo using top-k routing (typically k=2 or k=8 active experts)
- Each token routed to subset of experts—1B active params from 7B total, for example
- Uses auxiliary load balancing loss to prevent expert collapse (all tokens going to few experts)
- Achieves better performance per FLOP than dense models by decoupling parameters from compute

[Paper: OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)

### Montessori Instruct
- Optimizes the teacher LLM to generate synthetic training data tailored to the student's learning preferences
- Uses influence functions to measure how each synthetic data point affects student's reference loss—positive influence = helpful, negative = harmful
- Constructs preference pairs from high/low influence data and trains teacher with DPO to favor generating influential examples
- Key insight: a weaker teacher optimized for the student outperforms a stronger teacher (GPT-4o) using standard synthesis

[Paper: Montessori-Instruct: Generate Influential Training Data Tailored for Student Learning](https://arxiv.org/abs/2410.14208)
`.trim();

// Extract headings for the outline
const headings = extractHeadings(notesContent);

export default function AINotes() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1E21]">
      <Head>
        <title>AI Notes | Aarush Agarwal</title>
        <meta name="description" content="Personal notes on AI concepts and architectures" />
      </Head>

      <main className="py-16 bg-white dark:bg-[#1D1E21] relative min-h-screen">
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left sidebar with outline */}
              <aside className="lg:w-60 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-8">
                  <Link
                    href="/"
                    className="inline-flex items-center text-gray-900 dark:text-white hover:underline transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                  </Link>
                  <MarkdownOutline headings={headings} />
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="mb-10">
                  <h1 className="mb-4 text-2xl text-gray-900 dark:text-white">AI Notes</h1>
                  <p className="mb-6 text-gray-700 dark:text-white">Personal notes on AI concepts, techniques, and architectures.</p>
                </div>

                <article className="prose prose-sm max-w-none markdown-github">
                  <div className="text-black dark:text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]}>
                      {notesContent}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

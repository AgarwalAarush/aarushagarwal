import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import MarkdownOutline from '../components/MarkdownOutline';
import { extractHeadings } from '../lib/markdownOutline';

const notesContent = `
## Transformer Efficiency Techniques

### Flash Attention
- Computes attention in tiles/blocks rather than materializing the full N×N attention matrix
- Uses online softmax to compute attention incrementally, recomputing values during backward pass instead of storing them
- Reduces memory from O(N²) to O(N) while maintaining exact attention (not an approximation)
- Key insight: memory I/O is the bottleneck, not FLOPs—trading compute for memory access is a net win on modern GPUs

### KV Cache
- During autoregressive generation, keys and values for previous tokens don't change—cache them instead of recomputing
- Each new token only needs to compute its own K/V and attend to the cached history
- Reduces per-token inference from O(N) to O(1) attention computation
- Trade-off: memory grows linearly with sequence length, which is why techniques like sliding window attention help for long contexts

### Grouped Query Attention (GQA)
- Instead of separate K/V heads per query head (MHA) or one K/V for all queries (MQA), use groups
- Multiple query heads share the same K/V heads within a group (e.g., 8 query heads, 2 KV heads = 4 queries per KV)
- Reduces KV cache size proportionally while retaining most of MHA's expressiveness
- Sweet spot between MQA's efficiency and MHA's quality—used in Llama 2 70B, Mistral, etc.

### Rotary Embeddings (RoPE)
- Encodes position by rotating query and key vectors in 2D subspaces based on position index
- Relative position naturally emerges: q_m · k_n depends on (m - n) due to rotation properties
- No learned position embeddings—positions are encoded through geometric rotation
- Enables length extrapolation (with modifications like NTK-aware scaling or YaRN) beyond training context

## Notable LLM Architectures & Papers

### Flex Attention
- PyTorch's flexible API for implementing custom attention patterns without writing CUDA kernels
- Specify attention via a score_mod function that modifies attention scores (e.g., causal mask, sliding window, ALiBi)
- Leverages torch.compile to generate efficient fused kernels automatically
- Enables rapid prototyping of attention variants—document masking, prefix LM, etc.—with near-optimal performance

[Paper: FlexAttention (PyTorch Blog)](https://pytorch.org/blog/flexattention/)

### OLMoE
- Mixture-of-Experts variant of OLMo using top-k routing (typically k=2 or k=8 active experts)
- Each token routed to subset of experts—1B active params from 7B total, for example
- Uses auxiliary load balancing loss to prevent expert collapse (all tokens going to few experts)
- Achieves better performance per FLOP than dense models by decoupling parameters from compute

[Paper: OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)

### Montessori Instruct
- Curriculum learning for instruction tuning: order training examples by difficulty
- "Learn to walk before you run"—model sees simpler instructions first, complex ones later
- Difficulty measured by perplexity under a reference model or instruction complexity metrics
- Shows faster convergence and better final performance than random ordering of instruction data

[Paper: From Montessori to Roboschool: Teaching LLMs Step-by-Step](https://arxiv.org/abs/2402.14978)
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
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

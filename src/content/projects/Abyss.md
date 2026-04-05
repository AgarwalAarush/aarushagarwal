---
title: "Abyss"
description: "A voice-first AI assistant that lives on your iPhone, learns you over time through a context graph, and reaches deeper tools through a permissioned macOS bridge — built for the way people actually work."
ranking: 6
demo: "https://www.youtube.com/watch?v=DEMO_LINK"
website: "https://abyss.app"
deck: "https://www.figma.com/deck/DECK_LINK"
image: "/images/abyss/abyss-architecture.png"
images:
  - "/images/abyss/abyss-architecture.png"
  - "/images/abyss/abyss-data-flow.png"
  - "/images/abyss/abyss-infrastructure.png"
icon: "/images/abyss/icon.jpeg"
technologies:
  - Amazon Bedrock
  - Nova Sonic
  - Amazon Titan Embeddings
  - Amazon Neptune Analytics
  - AWS ECS Fargate
  - WhisperKit
  - SwiftUI
  - Node.js
  - TypeScript
  - WebSockets
---

**Abyss** is a voice-first AI assistant built for the way people actually live. Most AI assistants are chat-first and desktop-first — they wait for you to come to them. Abyss flips that: the iPhone is the primary surface, voice is the primary interface, and a context graph built on Amazon Neptune Analytics learns who you are across every session. The result is an assistant that travels with you, earns your trust through careful permissioning, and gets more useful the longer you use it.

### The Problem

The world is moving toward ambient AI — an assistant that knows you, travels with you, and can take real action on your behalf. But almost every major AI product today is still fundamentally a chat interface. It is desktop-first. It forgets you between sessions. It either has no real local access, or unrestricted access to everything.

That is a gap nobody should have to accept. People do their most time-sensitive thinking while commuting, between meetings, on the move. They need an assistant that fits that reality — not one that requires them to sit down at a desk first.

### System Architecture

![Abyss System Architecture](/images/abyss/abyss-architecture.png)

### Data Flow

![Abyss Data Flow](/images/abyss/abyss-data-flow.png)

### AWS Infrastructure

![Abyss Infrastructure](/images/abyss/abyss-infrastructure.png)

### What Abyss Does

Abyss makes AI assistance **ambient, personal, and trustworthy** by combining voice-native interaction, a persistent context graph, and a permissioned local execution layer.

- **Voice-First iPhone Client**: Speak naturally, get results streamed back as a clean transcript. Push-to-talk for quick inputs, VAD auto-detection for hands-free use. On-device WhisperKit transcription keeps latency low.
- **Context Graph Memory**: Backed by Amazon Neptune Analytics and Amazon Titan Embeddings, Abyss builds a semantic knowledge graph across sessions — your preferences, past decisions, open goals, and communication style — so it starts every conversation from where you left off.
- **Permissioned macOS Bridge**: Privileged local actions (shell execution, file read/write, git push, browser automation) are isolated behind a separately paired macOS bridge with individually toggled capabilities and workspace root constraints. Risky operations surface confirmation cards before anything is finalized.
- **Real Integrations**: Gmail triage and draft-before-send, Google Calendar management, Canvas LMS, Cursor Cloud Agents, Brave web search, GitHub-authenticated developer workflows, and Nova Act browser automation.
- **Dynamic Model Routing**: Amazon Bedrock routes requests between Nova Lite and Nova Pro based on task complexity — fast and cheap for everyday tasks, full power for deep coding and agent workflows.

### How It Works

Abyss is a three-layer system with a strict JSON event protocol connecting every component.

#### **iPhone Client**
- SwiftUI voice interface with AVFoundation audio pipeline
- WhisperKit on-device speech transcription; ElevenLabs TTS with system voice fallback
- URLSession WebSockets with auto-reconnect and exponential backoff
- Apple Keychain-backed credential storage; ASWebAuthenticationSession for OAuth flows

#### **Conductor Server**
- Node.js + TypeScript WebSocket server deployed on AWS ECS Fargate
- Orchestrates conversation turns, tool dispatch, and streaming responses via Amazon Bedrock
- Dynamic routing: Nova Lite for lightweight tasks, Nova Pro for bridge execution and agent workflows
- Nova Sonic for real-time bidirectional voice streaming
- Context summarization after 30 turns — compressing older history into a 3–6 sentence summary prepended to every subsequent request

#### **Context Graph**
- Amazon Neptune Analytics stores User, Session, Goal, Decision, Blocker, and MemoryEpisode nodes
- Amazon Titan Text Embeddings V2 ($d = 256$) generates semantic embeddings per goal
- Hybrid vector + graph search retrieves the most relevant prior context on session start
- Falls back to MemoryService summary if Neptune is unavailable

#### **macOS Bridge**
- Swift app with per-capability permission toggles and workspace root constraints
- Bridges shell execution, file operations, git workflows, Claude Code, and Nova Act browser automation
- Pairing is persistent — iOS auto-re-registers paired bridge codes on every reconnect

#### **Inline Card Architecture**
All tool results render as inline transcript cards via ` ```card:TYPE:CARD_ID``` ` fenced blocks — email drafts, calendar events, agent progress, bridge output, and Canvas data surface directly in the conversation without breaking the flow.

### Challenges & Solutions

- **Security without friction**: Designing per-capability permissioning that felt natural rather than bureaucratic required careful UX work — presets, granular toggles, and confirmation cards that interrupt only when something is truly irreversible.
- **Voice latency on mobile**: Chaining WhisperKit → WebSocket → Bedrock → ElevenLabs introduced compounding latency at every hop. Streaming responses as they generate, push-to-talk as a low-latency alternative, and Nova Sonic for end-to-end voice kept the experience responsive.
- **Context that transfers**: Getting Neptune hybrid search to surface the *right* prior context — not just recent context — required careful tuning of neighborhood traversal depth and vector similarity thresholds.
- **Cross-platform protocol consistency**: Keeping Swift and TypeScript protocol libraries in sync across a fast-moving codebase required strict shared JSON schemas and versioned `EventEnvelope` types. A single mismatched field would silently break entire tool flows.

### Outcome

Abyss demonstrates that voice-first, phone-native AI assistance is not a UX experiment — it is the right default for how most people actually spend their time. The same architecture extends naturally to any domain where ambient, permissioned AI access creates value: healthcare coordination, field operations, small business management, and more.

The vision is an assistant that fits in your pocket, earns your trust, and gets more capable the longer you know it.

### Links

- **Website**: [abyss.app](https://abyss.app)
- **Video Demo**: [YouTube](https://www.youtube.com/watch?v=DEMO_LINK)
- **Deck**: [Figma](https://www.figma.com/deck/DECK_LINK)

### Acknowledgements

- **WhisperKit** — On-device speech transcription on iOS
- **Nova Act** — Browser automation on the macOS bridge
- **Amazon Bedrock** — Model inference, Nova Sonic voice, and dynamic routing
- **Amazon Neptune Analytics + Titan Embeddings** — Context graph and semantic retrieval

*Deployed on AWS ECS Fargate with ECR image publishing and ALB-based WebSocket routing.*
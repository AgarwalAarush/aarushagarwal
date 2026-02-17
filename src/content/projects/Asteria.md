---
ranking: 8
title: 'Asteria'
description: 'An AI-Powered Mind-Mapping Platform for Startup Ideation — transforming brainstorming into structured, intelligent graphs with automated insights and collaboration'
github: 'https://github.com/AgarwalAarush/Asteria/'
icon: '/images/asteria-icon.png'
technologies: ['Next.js', 'React Flow', 'TypeScript', 'TailwindCSS', 'Supabase', 'Prisma', 'Zustand', 'AI Integration', 'Zod', 'shadcn/ui', 'Postgres']
---

**The Intelligent Mind-Mapping Platform for Startup Founders**

*Transforming brainstorming into structured knowledge graphs with AI-powered ideation, automated connections, and collaborative insights.*

## 🚀 Overview

Asteria is an **AI-driven mind-mapping platform** designed to help founders and teams generate, evaluate, and organize startup ideas. By combining **interactive graph visualization** with **AI-assisted content generation**, Asteria turns unstructured brainstorming into structured, actionable maps of problems, solutions, markets, and technologies.

**Core Advantages:**
- **Structured Ideation**: Nodes for problems, solutions, markets, tech, themes, and notes
- **AI-Assisted Creativity**: Generate ideas, expand concepts, and discover hidden links
- **Collaborative Workspaces**: Multi-tenant, real-time collaboration for teams
- **Scoring & Evaluation**: Rate ideas on timing, moat, practicality, founder fit, and painkiller impact

## ✨ Key Features

### 🧠 **AI-Augmented Ideation**
- Intelligent node suggestions from OpenAI/Anthropic
- Contextual expansion of concepts into deeper themes
- Automatic relationship generation between related ideas
- Clustering and summarization to identify key opportunities

### 🎛 **Interactive Graph Canvas**
- Built with React Flow for fluid graph editing
- Custom node & edge types (`ideaNode`, `relationEdge`)
- Intuitive shortcuts: press **N** to create nodes, double-click canvas for quick add
- Bulk parent assignment and advanced editing via sliding NodeEditPanel

### 📊 **Evaluation Framework**
- 5-Dimensional scoring system:
  - Painkiller
  - Founder Fit
  - Timing
  - Moat
  - Practicality
- Heatmap visualization (planned) for prioritization

### 🏢 **Collaboration & Organization**
- Multi-tenant **Spaces** for teams/projects
- Tagging system for filtering and categorization
- Real-time updates via Supabase subscriptions
- Planned role-based access controls (Owner, Editor, Viewer)

### 📑 **Knowledge Management**
- Planned **Snippet Capture**: clip web research directly into graphs
- Export to JSON or Obsidian Markdown
- Versioning and diff views for AI-suggested edits

## 🏗 Technical Architecture

### **Frontend (Next.js 15 + React 19)**
- **App Router** for modular navigation
- **TailwindCSS + shadcn/ui** for modern UI
- **Zustand + TanStack Query** for local + server state
- **React Flow** for interactive graph visualization

### **Backend (Supabase + Prisma)**
- PostgreSQL database with schema-managed migrations
- Prisma ORM for strongly-typed queries
- Zod schemas for runtime validation and safe AI outputs
- Supabase Auth for secure multi-tenant access

### **AI Integration**
- Provider abstraction layer for OpenAI / Anthropic
- Context builder gathers graph state for prompts
- Diff-based approval flow for AI suggestions
- Planned RAG snippets with pgvector embeddings

## 🧩 Development Challenges Overcome

### **Graph-Oriented Data Model**
- Multi-tenant schema: Users → Spaces → Nodes & Edges
- Rich relations: solves, depends_on, competes_with, related, enables, contradicts
- Tag system with many-to-many mappings

### **AI Safety & Validation**
- All AI outputs validated via **Zod schemas**
- Confidence scoring and rationale capture for suggested links
- Manual review pipeline for AI proposals

### **Performance & Scalability**
- Sub-100ms interactions in canvas rendering
- Optimized Prisma queries for large node graphs
- Planned indexing for edge traversal at scale

### **Collaboration & Real-Time Sync**
- Supabase live queries for shared editing
- Lock-free optimistic UI updates
- Designed for future CRDT/Yjs offline support

## 🌟 Future Roadmap

### **AI-Powered Research**
- Web snippet collection & embedding-based search
- Automated clustering of external resources into graphs

### **Collaboration Enhancements**
- Role-based access (Owner/Editor/Viewer)
- Multi-user real-time editing with CRDT support
- In-graph commenting & discussion threads

### **Advanced Exports**
- Seamless integration with Obsidian
- JSON/CSV graph exports
- Presentation-ready layouts (hierarchy, timeline, clustering)

### **Analytics & Insights**
- Heatmaps for opportunity scoring
- Theme mining across multiple spaces
- Intelligent prioritization recommendations

## 🏆 Technical Excellence

Asteria demonstrates innovation in **structured ideation, graph-based knowledge management, and AI augmentation**. By merging brainstorming, evaluation, and collaboration, it redefines how founders move from scattered ideas to validated opportunities.  

It represents the **next step in intelligent productivity tools**: structured, collaborative, and AI-native.
*Asteria: Where brainstorming evolves into structured intelligence.*  

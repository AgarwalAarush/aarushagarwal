---
title: "Mimir"
description: "**Winner of the CMU Claude Builder Hackathon** An AI tutoring workspace that promotes deep understanding through full-context reasoning, live guidance, and generative visualizations."
github: "https://github.com/beeler-devs/Mimir"
demo: ""
image: "/images/mimir/example.jpeg"
icon: "/images/mimir/mimir.png"
<<<<<<< HEAD
ranking: 5
=======
ranking: 4
>>>>>>> e678b13d4bcde7299b0a1c55e3336e8112dc9205
technologies:
  - Claude
  - Manim
  - AI Tutoring
  - IDE Integration
  - Voice AI
  - Visualization Systems
  - Full-Context LLMs
---

**Mimir** is an AI-powered tutoring workspace designed to help students *actually learn*, not just extract answers from language models. It provides full-context tutoring, live guidance, and custom visualizations that walk students through problems step by step—mirroring how a great teacher teaches.

Rather than replacing effort, Mimir restores it.

### The Problem

Education today is facing a **learning crisis amplified by AI**.

Students increasingly paste homework into LLMs, copy the final answer, and move on without engaging with the material. What should be a tool for growth has become a shortcut that bypasses the mental struggle required for learning. Traditional AI tools optimize for speed and correctness—not understanding.

The result is a widening gap between *completion* and *comprehension*.

Mimir was built to close that gap.

### Tech Stack
![Mimir Tech Stack](/images/mimir/tech-stack.png)

### What Mimir Does

Mimir turns AI into a **personalized tutor**, not an answer generator, by embedding it directly into a learning workspace.

- **Tutor Mode (Live Guidance)**: An AI tutor with access to the full workspace context guides students through problems step by step—like a real teacher sitting beside them.
- **All-in-One Learning Workspace**: Students can code in a built-in IDE, read textbooks, write notes, solve math problems, and watch lecture videos in one place.
- **Generative Visual Explanations**: A custom visual engine scripts and animates mathematical explanations using Manim, breaking complex topics into digestible, step-by-step visuals.
- **Active Learning Tools**: Automatically generate flashcards, quizzes, and practice problems grounded in the material the student is working on.
- **Voice-Enabled Tutoring**: Conversational, voice-based sessions allow students to ask questions naturally and reason aloud as they work.

### How It Works

Mimir is built around the idea that **learning requires context, feedback, and struggle—not just answers**.

#### **Full-Context Tutoring**

Unlike chat-based AI tools:
- The tutor has access to the entire workspace
- It sees the student’s code, notes, math work, and reference material
- Guidance is contextual and incremental, not solution-dumping

The tutor is explicitly instructed to *guide*, not solve.

#### **Generative Visualization Engine**

Many concepts fail because they’re hard to visualize.
- Mimir uses **Manim** to programmatically generate animated explanations
- Visuals are tailored to the specific concept the student is struggling with
- Complex ideas are deconstructed into sequential steps rather than static diagrams

This bridges the gap between symbolic math and intuitive understanding.

#### **Multimodal Learning Loop**

- Text, code, visuals, and voice are tightly integrated
- Students can switch modalities without losing context
- Voice tutoring enables natural back-and-forth reasoning, mirroring real instruction

#### **System Design**

- LLM reasoning powered by **Claude**
- Workspace-aware prompting ensures responses stay grounded
- Modular architecture allows new learning tools (e.g. quizzes, visualizations) to plug into the same context engine

### Challenges & Solutions

- **Preventing Answer Dumping**: We explicitly designed the tutor to refuse direct solutions and instead scaffold understanding.
- **Maintaining Context**: Keeping the AI grounded in a rich, evolving workspace required careful context construction and prompt design.
- **Visualization Complexity**: Generating accurate, pedagogically useful animations demanded tight coupling between math reasoning and visual scripting.
- **Cognitive Load**: We focused on pacing explanations to support learning without overwhelming the student.

### Outcome

Mimir demonstrates how AI can *strengthen* learning rather than undermine it. By embedding tutoring into the learning process itself—and grounding it in context, visuals, and dialogue—it restores the role of effort, curiosity, and reasoning.

At the **CMU Claude Builder Hackathon**, Mimir was recognized for rethinking how AI should be used in education—not as a shortcut, but as a teacher.

### What’s Next

- **Adaptive Learning Paths**: Automatically adjust tutoring strategies based on student progress and misconceptions.
- **Expanded Visual Library**: Richer, reusable visual explanations across math, CS, and physics.
- **Collaborative Tutoring**: Shared workspaces for study groups and peer learning.
- **Institutional Integrations**: LMS and course-level deployment for classrooms and universities.

**The vision:**  
AI that helps students *think better*, not just finish faster.

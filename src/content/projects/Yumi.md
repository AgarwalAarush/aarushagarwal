---
title: "Yumi"
description: "**3rd Place (Top 3 / 150+ teams) at HackHarvard 2025.** Agentic social food network that learns food profiles to eliminate dining friction."
github: "https://github.com/scrappydevs/yumi"
demo: "https://www.youtube.com/watch?v=taJw4XDSlKU"
image: "/images/yumi/yumi-hero.jpeg"
icon: "/images/yumi/yumi-hero.jpeg"
<<<<<<< HEAD
ranking: 4
=======
ranking: 3
>>>>>>> e678b13d4bcde7299b0a1c55e3336e8112dc9205
technologies:
  - Gemini Flash
  - Netlify
  - Twilio Voice API
  - Google Places API
  - ElevenLabs
  - Sentence Transformers
  - Spatial Search
  - AI Agents
---

**Yumi** is an agentic social food network designed to solve the group dining problem. It learns what people actually care about—flavor, atmosphere, price sensitivity, cultural context—from natural language, then coordinates preferences across friends to surface restaurants that work for everyone.

### The Problem

Food discovery today is fundamentally **misaligned with how humans choose together**.

Search engines and review platforms optimize for popularity and keywords, not personal taste. Group decisions degrade into compromises: the loudest voice wins, niche preferences get ignored, and people fall back to “safe” options. When traveling or exploring new cities, this leads to missing out on authentic local food culture entirely.

The core failure isn’t lack of data — it’s lack of **coordination**.

Yumi was built to fix that.

### Tech Stack
![Yumi Tech Stack](/images/yumi/tech-stack.png)

### What Yumi Does

Yumi makes group dining **personal, social, and coordinated** by combining natural language understanding, agent orchestration, and spatial search.

- **Natural Language Taste Learning**: Users write reviews like they’re texting a friend. An LLM extracts real preferences—flavor profiles, vibe, price tolerance—without forms or filters.
- **Personal Taste Profiles**: Over time, Yumi builds a structured taste representation for each user, continuously refined from free-form input.
- **Group Coordination**: Users mention friends with `@` mentions and Yumi intelligently merges everyone’s preferences instead of optimizing for the average.
- **Agentic Search**: When asked for recommendations (text or voice), AI agents retrieve preferences, call tools, and rank restaurants that satisfy *group-level constraints*.
- **Local Discovery**: Results emphasize culturally relevant, local spots—not algorithmically popular chains.

![Yumi Demo](/images/yumi/yumi-ios.jpeg)

### How It Works

Yumi is built around the idea that **taste is best expressed in language, but decisions require structure**.

#### **Natural Language → Structured Taste**

Instead of forcing users into predefined filters:
- Reviews are stored as natural language
- LLMs extract high-level preference summaries
- These summaries are cached and reused to avoid repeated inference
- Taste evolves as users write more

This approach proved far more robust than brittle JSON extraction pipelines.

#### **Agent-Orchestrated Search**

Yumi uses **LLM function calling** to coordinate the entire recommendation flow.
- Custom tools include:
  - `get_user_preferences`
  - `get_nearby_restaurants`
  - `merge_group_preferences`
- The LLM decides *when* to invoke tools rather than guessing
- Results are grounded in real data, not hallucinated lists

#### **Spatial Intelligence**

To support real-world search:
- We scraped **thousands of Boston restaurants**
- Stored them in **PostgreSQL with PostGIS**
- Used spatial queries to efficiently rank nearby options
- Enabled fast geographic filtering without client-side hacks

#### **End-to-End System**

- **iOS App (SwiftUI)** for reviews, photos, and voice queries
- **FastAPI backend** for orchestration and inference
- **Next.js dashboard** for social interactions
- **Supabase** for auth, storage, and real-time updates
- Deployed to production within 36 hours

### Challenges & Solutions

- **Latency**: Early searches took 15–20 seconds. We reduced this by switching to Gemini Flash, using function calling, and caching taste profiles.
- **Preference Conflicts**: Averaging tastes fails. We implemented a union-first strategy and explicitly guided the LLM to find solutions that work for *everyone*.
- **Extraction Robustness**: Structured parsing broke on edge cases. Natural language summaries proved more resilient and expressive.
- **Cross-Platform Sync**: Coordinating iOS, web, and backend required optimistic UI updates and background processing.

### Outcome

Yumi demonstrates how AI agents can move beyond chat interfaces into **real coordination systems**.

It shows that agents can:
- Learn over time
- Coordinate across multiple users
- Invoke tools intelligently
- Make decisions grounded in real-world constraints

In 36 hours, we shipped a fully functional agentic system spanning mobile, web, backend, and spatial databases—and proved that social AI can do real work.

### What’s Next

- **Proactive Meetup Suggestions**: Agents suggest plans based on overlapping tastes.
- **Voice-Based Reservations**: Automatically call restaurants using voice AI.
- **Reputation-Weighted Preferences**: Learn which friends’ tastes align most closely with yours.
- **City Expansion**: Scale beyond Boston to help people experience local food culture anywhere.

The vision is simple:  
**AI agents handle coordination, so humans can focus on shared experiences.**

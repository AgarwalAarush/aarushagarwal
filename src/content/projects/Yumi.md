---
title: "Yumi"
description: "**3rd Place (Top 3 / 150+ teams) at HackHarvard 2025.** Agentic social food network that learns food profiles to eliminate dining friction."
github: "https://github.com/scrappydevs/yumi"
demo: "https://lnkd.in/gdTvg3eP"
image: "/images/yumi-ios.jpeg"
icon: "/images/yumi-hero.jpeg"
ranking: 3
technologies:
  - Gemini Flash
  - Supabase (Postgres + PostGIS)
  - SwiftUI
  - Next.js
  - Render
  - Netlify
  - Twilio Voice API
  - Google Places API
  - ElevenLabs
  - Sentence Transformers
  - TypeScript
  - TailwindCSS
  - Hugging Face
---

Thrilled to share that we placed **3rd at HackHarvard 2025** out of over 150 teams.  
**Julian Ng-Thow-Hing, David Chung, Dheeraj Vislawath, and I** built **Yumi**, an agentic social food network that learns user taste and merges group preferences to help friends agree on where to eat.
### The Problem
When we arrived in Boston for HackHarvard, we wanted to explore the city’s food culture but ended up defaulting to a chain restaurant.  

Existing apps reduce restaurants to ratings and tags, failing to capture the nuanced preferences people actually have — texture, spice, ambiance, or cultural authenticity. Group decisions devolve into indecision and generic picks. We wanted to build something that truly understands taste and coordinates intelligently.
### What Yumi Does
Yumi is an AI-powered coordination platform that:
- Learns each user’s taste from natural language reviews, interactions, and search behavior.
- Lets users type or speak preferences to get personalized restaurant suggestions.
- Builds a taste graph that visualizes friends’ preferences and similarity.
- Merges multiple users’ profiles when friends are tagged with @mentions, balancing preferences across the group.
- Uses a real-time spatial restaurant database powered by Google Places and PostGIS.
- Handles voice-driven restaurant reservations via Twilio and ElevenLabs.
### My Contributions (Backend Development)
Led the development of Yumi’s data and AI pipeline:
- Built a backend pipeline that **scraped thousands of Boston restaurants** via the Google Maps API, using spatial grid partitioning for coverage.
- Designed and implemented a **data enrichment workflow** that:
  - Passed each restaurant through the **Gemini API** to generate concise, descriptive summaries.
  - Used a **classification model** (trained on Hugging Face) to detect whether uploaded photos contained food or irrelevant content.
  - Employed Gemini again to identify **cuisine types** and **dish-level context** for food images.
- Structured and stored all restaurant data in **Supabase Postgres with PostGIS** for efficient geospatial queries and distance-based ranking.
- Collaborated on **Gemini function-calling integration**, allowing the AI to intelligently retrieve restaurants and merge taste profiles.
### Tech Stack
**Frontend:** SwiftUI (iOS) + Next.js Web Dashboard (React, TailwindCSS)  
**Backend & AI:** Gemini Flash, Google Places API, Supabase/PostGIS, Sentence Transformers, Hugging Face models, ElevenLabs, Twilio Voice API  
**Deployment:** Render (API) + Netlify (Web) + Supabase (Database/Auth)
### Challenges
Merging taste preferences across multiple users was nontrivial. Conflicting attributes like spice tolerance and price sensitivity required a dynamic weighting scheme and structured prompt design for Gemini.  
Integrating real-world restaurant data with AI-labeled context demanded a reliable scraping and enrichment pipeline that could operate within hackathon constraints.
### Outcome
We shipped a working multi-agent system that:
- Automatically builds and updates user taste profiles.
- Accurately labels and categorizes real restaurant data.
- Suggests restaurants that satisfy all members of a group.
- Demonstrates how AI agents can coordinate, learn, and make decisions across multiple users in a real-world setting.
### What’s Next
We’re extending Yumi to:
- Suggest meetups automatically based on overlapping preferences.
- Handle reservations via AI voice calls.
- Learn from real dining feedback to refine profiles.
- Expand beyond Boston to new cities with dynamic scraping and labeling.
### Tagline
**You, Me, and Food — Together we make Yumi.**

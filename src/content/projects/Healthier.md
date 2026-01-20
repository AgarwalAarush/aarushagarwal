---
title: "Healthier"
description: "**Won 2nd Place in Healthcare at NexHacks** An AI-powered care layer that makes senior care observable through multimodal sensing, real-time feedback, and clinician-facing risk insights."
github: "https://github.com/scrappydevs/healthier"
demo: "https://www.youtube.com/watch?v=taJw4XDSlKU"
image: "/images/healthier.png"
ranking: 1
technologies:
  - YOLOv8
  - LiveKit
  - Pose Estimation
  - CoreML
  - Edge Computing
  - Three.js
  - iOS
---

**Healthier** is an AI-powered care continuity platform designed to bridge the gap between in-clinic care plans and what actually happens at home. It turns everyday patient behavior—medication intake, meals, exercises, and daily check-ins—into structured, actionable signals for caregivers and clinicians.

### The Problem

Elder care today is fundamentally **reactive**.

Clinicians set care plans in clinics and hospitals, but once patients return home, visibility collapses. Missed medications, poor nutrition, or improper exercise form often go unnoticed until they compound into emergency events or readmissions. In the US alone, ~125,000 deaths each year are linked to medication non-adherence. Supervised in-person care helps, but at **$6–7k per month**, it’s inaccessible for most families.

The result is a massive observability gap: care is prescribed with intent, but executed without feedback.

Healthier was built to close that gap.

### What Healthier Does

Healthier makes at-home care **observable, measurable, and actionable** by combining multimodal sensing, real-time feedback, and clinician-facing insights.

- **Medication & Meal Tracking**: Seniors scan pills and meals using their phone. Computer vision validates adherence and nutrition intake without manual logging.
- **Exercise Form Feedback**: Using pose estimation, Healthier provides live guidance during physical therapy exercises and flags unsafe or incorrect form.
- **Voice-Based Daily Check-Ins**: A conversational voice agent lets patients journal symptoms, mood, and concerns naturally—lowering friction for daily engagement.
- **Caregiver & Clinician View**: Behind the scenes, Healthier converts raw signals into adherence timelines, risk indicators, and early alerts, surfaced through a live 2D/3D view of homes or facilities.

### How It Works

Healthier is built around the idea that **care data should be captured passively, validated intelligently, and summarized automatically**.

#### **On-Device Intelligence (Edge ML)**

To preserve privacy and reduce latency, critical perception tasks run directly on the patient’s device.
- **Pill Detection**: We trained a custom **YOLOv8** model on a curated dataset of pill images (collected and annotated in-house with a Nano Banana Pro pipeline) to recognize medications via camera scans.
- **On-Device Inference**: The model is converted to **CoreML** and runs locally on iPhone, enabling fast, offline-first pill verification.
- **Exercise Monitoring**: Pose estimation tracks joint alignment and movement patterns to provide real-time feedback during rehab exercises.

#### **Voice & Interaction Layer**

Healthier’s daily check-ins are designed to feel conversational, not clinical.
- **Real-Time Voice Pipeline**: Built with **LiveKit (WebRTC)** for low-latency audio streaming and **OpenAI Whisper** for transcription.
- **Natural Conversations**: Patients speak freely about symptoms or concerns, reducing the burden of structured forms.
- **Structured Summaries**: Conversations are automatically distilled into clinically relevant summaries—highlighting pain changes, missed doses, or emerging risks.

#### **Caregiver & Clinician Intelligence**

Raw multimodal signals are transformed into high-level insights.
- **Adherence & Risk Scoring**: Healthier tracks deviations from care plans and surfaces early warnings before issues escalate.
- **Spatial Context**: A live **2D/3D view** (built with **Three.js**) gives caregivers intuitive situational awareness across rooms or facilities.
- **Real-Time Sync**: Data is synchronized via **Supabase** with WebSocket updates, ensuring caregivers always see the latest state.

### Tech Stack

- **AI & ML**: OpenAI Whisper, Gemini Nano Banana Pro, Claude Sonnet 4.5, YOLOv8, Pose Estimation
- **Edge Computing**: CoreML (on-device inference)
- **Real-Time Systems**: LiveKit (WebRTC), WebSockets
- **Backend**: Supabase (Postgres)
- **Frontend & Visualization**: iOS, Three.js

### Challenges & Solutions

- **Low-Friction Data Capture**: Seniors often struggle with complex interfaces. We designed Healthier around voice, camera scans, and passive sensing to minimize interaction overhead.
- **On-Device Constraints**: Running vision models on mobile required aggressive model optimization and careful tradeoffs between accuracy and latency.
- **Signal → Insight Translation**: Raw sensor data is noisy. We focused on extracting **trend-level signals** and deviations that actually matter to caregivers.

### Outcome

Healthier demonstrates how multimodal AI can transform elder care from reactive to proactive—without requiring constant supervision or expensive in-person monitoring. By making at-home care observable, it enables earlier intervention, better adherence, and greater peace of mind for families and clinicians.

### What’s Next

- **Expanded Risk Models**: Combine adherence, nutrition, mobility, and voice signals into longitudinal risk forecasting.
- **Clinician Workflow Integration**: Deeper integrations with care teams for plan adjustments and feedback loops.
- **Broader Home Intelligence**: Extend spatial and behavioral monitoring to detect fall risk and long-term mobility decline.
---
title: "Medicly"
description: "**Grand Prize (1st Overall) at HackCMU among 200+ teams.** AI‑powered physical therapy analysis platform for patients and clinicians to track recovery together."
github: "https://github.com/scrappydevs/medicly"
demo: "https://www.medicly.dev/"
image: "/images/medicly/demo.jpeg"
icon: "/images/medicly/medicly-icon.png"
ranking: 
technologies:
  - MediaPipe
  - BioDigital Human
  - Claude API
  - Supabase
  - Postgres
  - Computer Vision
---

**Medicly** is an AI-powered physical therapy analysis platform designed to bridge the gap between clinical expertise and at-home rehabilitation. It transforms raw patient movement—captured through live video or uploaded sessions—into real-time feedback, structured assessments, and actionable insights for patients and clinicians.

Instead of static exercise sheets or infrequent clinic visits, Medicly makes rehabilitation **observable, interactive, and adaptive**.

### The Problem

Physical therapy today is fundamentally **underserved outside the clinic**.

Clinicians prescribe exercises with precise intent, but once patients leave the clinic, execution quality drops sharply. Poor form, incomplete range of motion, and inconsistent adherence often go unnoticed until progress stalls or injuries worsen. Access to frequent, high-quality supervision is limited by cost, availability, and geography.

The result is a visibility gap:  
therapy is prescribed carefully, but performed blindly.

Medicly was built to close that gap.

### Tech Stack
![Medicly Tech Stack](/images/medicly/tech-stack.jpg)

### What Medicly Does

Medicly makes physical therapy **measurable and actionable** by combining real-time computer vision, large language models, and interactive visualization.

- **Real-Time Movement Analysis**: Live pose detection tracks joint positions and motion patterns during exercises.
- **AI Form Feedback**: An LLM analyzes movement quality and provides clear, human-readable corrections and guidance.
- **Video-Based Review**: Patients can upload recorded sessions for asynchronous analysis and detailed breakdowns.
- **3D Anatomy Visualization**: Interactive anatomical models help patients understand *why* a movement matters—not just how to do it.
- **Progress Tracking**: Sessions are logged and summarized to support longitudinal monitoring and clinician review.

### How It Works

Medicly is built around the principle that **movement must be captured precisely, interpreted intelligently, and communicated clearly**.

#### **Computer Vision for Motion Capture**

- **Pose Estimation**: We use **MediaPipe** to extract real-time skeletal landmarks from live or recorded video.
- **Motion Features**: Joint angles, alignment, and movement trajectories are computed to assess exercise quality.
- **Low-Latency Streaming**: Real-time processing enables immediate feedback during exercises, not post-hoc correction.

#### **AI Interpretation & Feedback**

Raw pose data alone isn’t useful to patients.
- Landmark sequences are summarized into high-level movement descriptors
- **Claude** analyzes these descriptors in clinical context
- Feedback is returned in natural language, highlighting:
  - Incorrect form
  - Limited range of motion
  - Timing and symmetry issues

This keeps guidance understandable without exposing raw biomechanics.

#### **Anatomical Context**

To bridge understanding:
- **BioDigital Human** 3D models visualize muscles, joints, and motion paths
- Patients can see which muscles are engaged and how incorrect form impacts anatomy
- This improves compliance and long-term learning, not just short-term correction

#### **End-to-End Platform**

- **Frontend**: Web-based interface for live sessions and video uploads
- **Backend**: FastAPI services for video processing and AI analysis
- **Database & Auth**: Supabase for secure storage, session tracking, and user management
- Designed to support both patient-facing and clinician-facing workflows

### Challenges & Solutions

- **Real-Time Performance**: Live video analysis required careful optimization to balance accuracy and latency.
- **Signal → Insight Translation**: Pose landmarks are noisy; we focused on extracting trend-level and clinically relevant signals.
- **User Trust**: Feedback had to feel supportive, not punitive. We emphasized clear explanations and visual grounding.
- **Scalability**: The system supports both live streaming and asynchronous analysis without duplicating pipelines.

### Outcome

Medicly demonstrates how AI can extend clinical expertise beyond the clinic—without replacing clinicians or requiring expensive hardware. By making rehabilitation observable and understandable, it enables better adherence, faster recovery, and more consistent outcomes.

At **CMU Hacks 2025**, Medicly was recognized for translating cutting-edge AI into a real healthcare workflow with immediate impact.

### What’s Next

- **Mobile Apps**: Native iOS and Android experiences for home rehab.
- **Wearable Integration**: Apple Watch and Fitbit data for richer motion context.
- **Advanced Analytics**: Longitudinal progress tracking and predictive recovery insights.
- **Clinic Dashboards**: Multi-patient views for providers managing large caseloads.
- **Insurance Integration**: Support for billing, documentation, and coverage workflows.

**The long-term vision:**  
make high-quality physical therapy accessible anywhere, without sacrificing clinical rigor.
---
title: "ProVision"
description: "AI Moneyball for Table Tennis. Transforms match film and tournament footage captured by 2D camera into actionable insights backed by tracked ball trajectories, 3D biomechanics, and Moneyball-grade analytics in minutes."
ranking: 1
demo: "https://www.youtube.com/watch?v=XPG1tP3K3gs"
website: "https://tryprovision.vercel.app"
deck: "https://www.figma.com/deck/FdaBB10ebZ1kcceXqmSbSM"
image: "/images/provision/hero.png"
icon: "/images/provision/logo.png"
technologies:
  - TrackNet
  - SegFormer++
  - ViTPose
  - MediaPipe
  - YOLOv8
  - SAM2
  - CNN
  - 3D Reconstruction
---

**ProVision** is AI Moneyball for Table Tennis. Over 800 million people watch table tennis—more than the Super Bowl and NBA Finals combined—yet while football and basketball are drowning in analytics, table tennis coaches still spend hours manually reviewing footage, frame by frame. ProVision transforms ordinary 2D tournament footage into in-depth analysis, delivering actionable insights in minutes instead of hours.

### The Problem

Table tennis is technically challenging and commercially ignored. Coaches spend countless hours scrubbing through video by hand to understand player tendencies, shot selection, and technique. Elite-level motion capture and biomechanics analysis typically require $100,000+ labs and manual tagging—inaccessible for most clubs and players. Every table tennis club films matches. Every tournament has cameras. That footage sits unused while coaches and players lack the tools to extract value from it.

ProVision turns existing footage into a gold mine of data for an underserved sport with a massive global audience.

### Tech Stack

![ProVision Tech Stack](/images/provision/tech-stack.png)

### What ProVision Does

ProVision makes match analysis **observable, measurable, and actionable** by combining ball tracking, 3D biomechanics, and advanced analytics.

- **Heatmap Visualization**: Spatiotemporal shot-density maps overlaid on the table surface to reveal positional tendencies, high-probability zones, and directional bias for each player.
- **Advanced Analytics**: Match and stroke-level metrics—forehand/backhand splits, rally length distributions, power analysis, shot quality scores—with longitudinal trend analysis across sessions. Analytics run on player and opponent segments isolated via SAM2 for per-player accuracy.
- **Real-Time Ball Tracking**: Low-latency ball localization and trajectory estimation from monocular video using a CNN-based detection and tracking pipeline, enabling frame-accurate feedback during live or recorded play.
- **Shot Analysis**: Deep analytics using SegFormer++ (Transformer-based semantic segmentation), WASB, and ViTPose for 3D reconstruction of game trajectory.
- **3D Biomechanics Data**: Reconstruction of player kinematics from 2D video, extracting joint-level motion features (speed, acceleration, posture) to quantify technique efficiency.
- **Head-to-Head Advice**: Player similarity modeling and matchup-specific recommendations driven by historical patterns in serve/receive behavior, shot selection, and positional tendencies.

### Demo

![ProVision Analysis Demo](/images/provision/analysis.gif)

### How It Works

ProVision uses a CNN tracking pipeline to turn match footage into live ball trajectory and 3D biomechanics—delivering motion capture insight for speeds over 70 mph with a single cheap camera.

#### **Ball Detection & Tracking**

- **CNN-Based Pipeline**: Built on **TrackNet** and **UpliftingTableTennis** for ball localization and trajectory estimation from monocular video.
- **Frame-Accurate Inference**: Optimized for inference on **A100 SXM GPUs** on Runpod for low-latency, real-time capable processing.
- **Trajectory Estimation**: 3D ball path reconstruction from 2D camera input for shot-level analysis.

#### **Scene & Object Isolation**

- **SAM2 Object Segmentation**: Video object segmentation isolates player, opponent, and others (e.g., judges) in frame, ensuring metrics apply only to objects of interest and avoiding contamination from peripheral actors.

#### **Shot & Biomechanics Analysis**

- **SegFormer++**: Transformer-based semantic segmentation for detailed shot and scene understanding.
- **ViTPose**: 2D pose estimation for player joint localization.
- **WASB**: 3D reconstruction and lifting from 2D video to extract joint-level kinematics.
- **Motion Features**: Speed, acceleration, and posture metrics to quantify technique efficiency.

#### **Analytics & Insights**

- **Moneyball-Grade Metrics**: Heatmaps, rally stats, stroke quality, forehand vs backhand comparisons, and matchup-specific advice without expensive labs or manual tagging.
- **Coaches get actionable insights in minutes instead of hours. Players see exactly where their technique breaks down.**

### Challenges & Solutions

- **Monocular 3D Reconstruction**: Recovering 3D ball trajectory and player biomechanics from a single 2D camera required careful pipeline design and integration of state-of-the-art lifting models.
- **High-Speed Tracking**: Table tennis balls exceed 70 mph. The CNN pipeline was tuned for frame-accurate detection and tracking at challenging speeds.
- **Scalability**: Every club films matches. ProVision is designed to turn existing footage into insights—no special hardware, no manual tagging.

### Outcome

ProVision demonstrates how AI can bring elite-level coaching to table tennis—and by extension, badminton, tennis, ping-pong, and any racket sport. The same technology applies broadly. The vision is to bring Moneyball-grade analytics to hundreds of millions of racket sport players worldwide. Education becomes engaging, not exhausting.

### Links

- **Website**: [tryprovision.vercel.app](https://tryprovision.vercel.app)
- **Video Demo**: [YouTube](https://www.youtube.com/watch?v=XPG1tP3K3gs)
- **ProVision Deck**: [Figma](https://www.figma.com/deck/FdaBB10ebZ1kcceXqmSbSM)

### Acknowledgements

- **TrackNet**: Ball detection and tracking
- **UpliftingTableTennis**: 3D trajectory and scene understanding

*Both repositories were minimally modified and used for inference on A100 SXM GPUs on Runpod.*

---
title: "AutoReflex"
description: "**3rd Place at Hackberry Pi.** Real-time neuromuscular aim-assist that closes the loop from pixels to physical movement in under 15ms. A Jetson Nano runs a 100fps vision pipeline and streams target coordinates over UDP to a Raspberry Pi, which drives a Feetech ST3215 servo and optional TENS muscle stimulation via a 1kHz PID control loop."
ranking: 1
demo: "https://youtu.be/0nmgYhaoP1Q"
image: "/images/autoreflex/autoreflex-cover.png"
technologies:
  - YOLO11n
  - OpenCV
  - PID Control
  - CUDA
  - TENS
  - Feetech SCS/STS
  - pigpio
  - C++
---

**AutoReflex** is a real-time neuromuscular aim-assist system that combines computer vision, servo-driven mechanical actuation, and transcutaneous electrical nerve stimulation (TENS) to physically guide a player's aim. A Jetson Nano detects on-screen targets at 100fps and streams coordinates over UDP to a Raspberry Pi, which runs a 1kHz PID control loop driving a Feetech ST3215 servo and optional solenoid trigger — closing the loop from pixels to physical movement in under 15ms.

### The Problem

Aim assist in competitive gaming is almost universally software-only — a cheat applied in the rendering pipeline, trivially detectable by anti-cheat systems. The question we wanted to answer: what does a *hardware-level* aim-assist look like? One that operates entirely outside the game process, at the level of physical muscle stimulation and mechanical actuation, with end-to-end latency low enough to be useful in real play.

The result is a closed-loop system spanning two compute nodes, a servo motor, and a TENS unit — all synchronized at kilohertz rates.

### Architecture

![AutoReflex System Diagram](/images/autoreflex/diagram.png)

AutoReflex runs as two cooperating nodes over a direct Ethernet link:

- **Vision node (Jetson Nano):** Arducam OV9782 captures at 100fps, runs HSV color thresholding or YOLO11n detection, and transmits 20-byte UDP packets containing target centroid, crosshair position, and blob width.
- **Control node (Raspberry Pi):** Receives packets and runs a 1kHz busy-spin PID loop — driving the ST3215 servo over half-duplex UART at 1 Mbps, firing a solenoid trigger via GPIO on target lock, and modulating TENS (EMS) intensity via two MCP4131 digital potentiometers over SPI.

```
┌──────────────────────┐           UDP (20 bytes)          ┌──────────────────────────────────┐
│     JETSON NANO      │  ───────────────────────────────► │        RASPBERRY PI 4/5          │
│                      │   timestamp | tx | cx | blob_w    │                                  │
│  ┌────────────────┐  │                                   │  1kHz PID Loop                   │
│  │ Arducam OV9782 │  │                                   │                                  │
│  │ 100fps MJPEG   │  │                                   │  ┌──────────┐                    │
│  └───────┬────────┘  │                                   │  │  ST3215  │  Servo (UART 1Mbps)│
│          │           │                                   │  └──────────┘                    │
│  ┌───────▼────────┐  │                                   │  ┌──────────┐                    │
│  │ VisionProcessor│  │                                   │  │ Solenoid │  Trigger (GPIO)    │
│  │  HSV / YOLO    │  │                                   │  └──────────┘                    │
│  └────────────────┘  │                                   │  ┌──────────┐                    │
│                      │                                   │  │   TENS   │  EMS (SPI/MCP4131) │
└──────────────────────┘                                   │  └──────────┘                    │
       10.0.0.1                                            └──────────────────────────────────┘
                                                                   10.0.0.2
```

```circuit-embed

```

### Demo Image

![AutoReflex Demo](/images/autoreflex/box-demo.jpeg)

### How It Works

#### **Vision Pipeline**

The Arducam OV9782 streams 1280×720 MJPEG at 100fps over USB 2.0 into a `FrameGrabber` thread with a shallow queue of depth 2. Pre-allocated numpy buffers eliminate per-frame heap allocation. Detection runs in two modes:

- **HSV thresholding** for Aimlabs cyan targets — ~2ms per frame
- **YOLO11n** for Valorant enemy detection, trained on A100 SXM and quantized for Jetson inference

Each detected frame produces a 20-byte big-endian UDP packet:

| Field | Type | Bytes | Description |
|-------|------|-------|-------------|
| timestamp | double | 8 | CLOCK_MONOTONIC capture time |
| tx | float | 4 | Target centroid X (pixels) |
| cx | float | 4 | Crosshair reference X (pixels) |
| blob_w | float | 4 | Target bounding-rect width (pixels) |

#### **PID State Machine**

The control node runs a 1kHz busy-spin loop (<5µs jitter) with a two-state machine:

| State | Condition | Controller | Purpose |
|-------|-----------|------------|---------|
| **FLICK** | \|error\| > 30px | PD (Kp=3.0) | Fast ballistic move toward target |
| **SETTLE** | \|error\| < 30px | PID (Kp=3.0, Ki=0.15) | Precision lock with integral action |
| **FIRE** | \|error\| < 5px | Solenoid pulse | Target acquired — click |

Overshoot damping halves gains for 10 frames after error sign reversal. Backlash compensation ramps a dead-zone offset over 5 frames on direction change. Fire threshold, flick threshold, and settle gains all scale dynamically with apparent target size (`blob_w`) — tighter for distant small targets, more aggressive for close large ones.

#### **TENS Integration**

Two MCP4131 digital potentiometers over SPI (CE0 + CE1) modulate TENS electrode intensity as a function of pixel error. Large errors trigger stronger muscle stimulation, physically redirecting the arm before the servo completes its mechanical slew. This creates a two-channel correction: electrical (fast, ~1ms) and mechanical (slower, ~10ms).

### Latency Budget

| Stage | Time | Notes |
|-------|------|-------|
| Camera capture | ~10ms | 100fps MJPEG, hardware-timed |
| HSV detection | ~2ms | Pre-allocated buffers, no malloc |
| UDP transit | <1ms | Direct Ethernet, no routing |
| PID compute | <1µs | All stack, no heap |
| Servo write | ~9µs | 9 bytes @ 1 Mbps |
| **End-to-end** | **~13ms** | **Pixel to servo movement** |

### Hardware

| Component | Role | Interface |
|-----------|------|-----------|
| NVIDIA Jetson Nano | Vision processing (HSV/YOLO) | USB (camera), Ethernet (UDP) |
| Arducam OV9782 | 100fps global shutter camera | USB 2.0 (MJPEG) |
| Raspberry Pi 4/5 | Real-time servo control | Ethernet (UDP), UART, GPIO, SPI |
| Feetech ST3215 | 12-bit digital servo (4096 steps/360°) | Half-duplex UART @ 1 Mbps |
| Solenoid | Mouse click actuator | GPIO via MOSFET driver |
| MCP4131 × 2 | Digital potentiometer (TENS intensity) | SPI (CE0 + CE1) |
| TENS unit | Transcutaneous electrical stimulation | Modulated by MCP4131 |

### Challenges & Solutions

- **1kHz determinism on Linux:** Achieving <5µs jitter on a non-RTOS required a busy-spin loop with CPU affinity pinning rather than timer-based sleep, trading a core for real-time guarantees.
- **Half-duplex UART at 1 Mbps:** The Feetech SCS/STS protocol uses a shared TX/RX line. Direction switching timing is critical — too slow and packets corrupt; too fast and the servo doesn't respond. First-order position smoothing absorbs the residual jitter.
- **TENS safety:** Intensity is hard-capped at MCP4131 wiper value 40 (out of 127). The TENS output is purely modulated through the potentiometer — the unit's own safety circuitry remains in the loop.
- **Dynamic scaling with blob width:** A naive fixed-threshold controller overshoots on close targets and undershoots on distant ones. Scaling all thresholds and gains proportionally to `blob_w` linearizes the response across ranges.

### Outcome

AutoReflex placed 3rd at HackberryPi and demonstrates that hardware-level aim assist — operating entirely outside the game process — is feasible at latencies competitive with human reaction time. The same Jetson-to-Pi UDP architecture, PID state machine, and TENS integration pattern applies directly to any real-time physical control problem: robotic manipulation, prosthetics, or closed-loop rehabilitation devices.

![AutoReflex Electrical Diagram](/images/autoreflex/architecture.png)

### Links

- **Video Demo**: [YouTube](https://youtu.be/0nmgYhaoP1Q)

### Acknowledgements

- **pigpio** — Raspberry Pi GPIO library with microsecond-level timing
- **Ultralytics YOLO** — Object detection framework
- **Feetech SCS/STS Protocol** — Servo communication protocol
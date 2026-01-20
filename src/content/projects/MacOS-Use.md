---
ranking: 6
title: 'Intelligent macOS Automation Engine'
description: 'A Modern Computer Use Architecture (Built for Nova) - Cost-efficient, scalable automation using LLM visual reasoning and progressive refinement algorithms'
icon: '/images/macos-automation-icon.png'
github: 'https://github.com/AgarwalAarush/macOS-Automation'
demo: null
technologies: ['macOS Automation', 'LLM Integration', 'Progressive Refinement', 'Image Processing', 'System Integration']
---


## A Modern Computer Use Architecture (Built for Nova)

This macOS automation system takes a different approach from traditional pixel-perfect coordinate systems. By leveraging the visual reasoning capabilities of Large Language Models, it creates a **cost-efficient, scalable, and intelligent** automation framework.

Unlike brittle automation solutions that break with UI changes, this system uses **semantic understanding** to locate interface elements, making it resilient to design updates, theme changes, and dynamic layouts. Through **progressive refinement algorithms** and **contextual padding strategies**, it achieves precise targeting while maintaining computational efficiency.

## 🧠 Core Innovation: Progressive Refinement Architecture

### Key Algorithm Properties

- **Progressive Refinement**: Coarse-to-fine localization through iterative zooming
- **Context Preservation**: Padding maintains surrounding context for better LLM decisions  
- **Coordinate Continuity**: Maintains precise coordinate tracking throughout all transformations
- **Efficiency**: Avoids processing full screenshot at maximum resolution

### The Iterative Quadrant Algorithm

The core feature is **iterative quadrant analysis** - a multi-stage localization process:

1. **Coarse Localization**: Captures full application screenshot with grid overlay
2. **LLM Analysis**: Model identifies which grid section contains the target element
3. **Context-Aware Cropping**: Intelligently crops region with boundary-aware padding
4. **Refinement Iteration**: Repeats with progressively finer grids until pixel-perfect
5. **Coordinate Resolution**: Maps final coordinates back to screen space with precision

This reduces the amount of image data processed compared to full-resolution analysis, resulting in approximately 50% lower API costs compared to OpenAI's computer use model.

## ⚙️ Core Algorithms Explained

This section details the two primary algorithms that power the mouse automation engine: iterative refinement for locating elements, and coordinate calculation for mapping the location to a precise screen coordinate.

### Iterative Refinement Algorithm

This algorithm progressively zooms in on a target element within a screenshot over several iterations. It's designed to find elements accurately without processing the entire high-resolution screenshot at each step.

The process unfolds in three phases:

1.  **Initialization**: The process starts with the initial bounds of the entire search area (e.g., a full application window screenshot).
2.  **Iterative Refinement Loop**: This is the core of the algorithm. For each iteration:
    *   **Grid Overlay**: A grid (`gridWidth` x `gridWidth`) is drawn over the current image region.
    *   **LLM Analysis**: The grid-overlaid image is sent to a vision model, which identifies the grid cell most likely to contain the `target` element. Partioning the image into grids has proven to be a more effective manner of extracting visual reasoning from smaller models.
    *   **Region Update**: The algorithm calculates the coordinates of the selected cell. This smaller region becomes the new focus area.
    *   **Context-Aware Cropping**: For the next iteration, the system crops the *original* full screenshot to this new, smaller region. Crucially, it adds padding (`paddingFactor`) around the cropped area to preserve surrounding context, which helps the LLM make better decisions. This cropped image is then used as the input for the next loop.
3.  **Final Resolution**: After the final iteration, the algorithm has a small, precise region containing the target. It calculates the center point of this region, which represents the final coordinate relative to the screenshot.

### Coordinate Calculation & Click Execution

This is the high-level process that translates a natural language command (e.g., "Click the submit button") into a precise mouse click.

The execution flow is as follows:

1.  **Application Activation**: The target application is brought to the foreground.
2.  **Screenshot & Pre-processing**:
    *   A screenshot of the application window is captured.
    *   To improve analysis, edge pixels are removed from the screenshot to discard window chrome like title bars.
3.  **Iterative Refinement**: The `iterativeQuadrantAnalysisEnhanced` function is called on the cleaned screenshot to get the target's coordinates *relative* to the screenshot image.
4.  **Screen Coordinate Transformation**: This is the final and most critical step to ensure accuracy.
    *   The system gets the real-time position and size of the application window on the screen.
    *   It calculates scaling factors by comparing the screenshot's dimensions to the actual window's dimensions. This is essential for handling Retina (HiDPI) displays where the screenshot resolution may be a multiple (e.g., 2x) of the window's point-based size.
    *   The relative coordinates from the refinement step are scaled down using these factors.
    *   Finally, the application window's top-left screen position (its origin) is added to the scaled coordinates. This transforms the relative image coordinate into an absolute screen coordinate.
5.  **Execution**: The system executes a mouse click at the final, absolute screen coordinates.

Together, these two systems enable a quick, cheap, and highly-efficient method of extracting visual reasoning from LLMs for mouse clicks. 

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Task Input    │───▶│  LLM Planner    │───▶│  Tool Executor  │
│  "Click submit" │    │  Determines     │    │  Executes       │
│                 │    │  Action Chain   │    │  Each Action    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Screenshot     │◀───│  Click Handler  │───▶│  Coordinate     │
│  Manager        │    │  Iterative      │    │  Calculator     │
│                 │    │  Analysis       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

#### **LLMAPIClient**
- Handles communication with OpenAI's vision models
- Text prompts, image analysis, structured JSON responses

#### **ScreenshotManager** 
- Captures application window screenshots
- App-specific window detection

#### **ImageProcessor**
- Image transformations and cropping
- Boundary-aware padding, context preservation
- Coordinate consistency across transformations

#### **QuadrantManager**
- Creates visual grid overlays and coordinate mapping
- Maps between image coordinates and screen coordinates

#### **AutomationManager**
- Executes system interactions
- Mouse clicks, keyboard input, application activation

## 🛠 Available Tools

The system provides a comprehensive toolkit for macOS automation:

| Tool | Description | Parameters |
|------|-------------|------------|
| `click` | Intelligent clicking on UI elements | `target`: Description of element, `appName`: Target application |
| `type` | Text input with keyboard simulation | `text`: Text to type, `appName`: Target application |
| `screenshot` | Application window capture | `appName`: Target application |
| `activate_app` | Bring application to foreground | `appName`: Application to activate |

## 📋 Example Tasks

The system understands natural language instructions:

```swift
// Web automation
"Click the search box in Safari and type 'machine learning'"

// Document editing  
"Open TextEdit and write 'Dear John, Thank you for your email'"

// System interaction
"Take a screenshot of Activity Monitor"

// Multi-step workflows
"Open Calculator, enter 150 + 250, then click equals"
```

## Limitations

- Requires accessibility permissions for system interaction
- Performance depends on target application's window focus
- Complex UI elements may require multiple refinement iterations
- Currently optimized for standard macOS applications

## License

MIT License - Feel free to build upon this automation architecture.

*Improving computer interaction through AI-powered automation.*

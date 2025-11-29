Tech Context – Micro-Velocity
=============================

> This file will evolve as we commit to specific tools/engines. For now, it records intentions and constraints.

## Platform & Device Assumptions

- **Primary platform**: Mobile (iOS and Android).
- **Input**: Touch (single or dual-thumb tapping).
- **Performance target**:
  - Smooth animations at 60 FPS where possible.
  - Very low perceived input latency for taps.

## Candidate Technology Directions

At this stage, multiple options are viable. We will refine and lock one in when implementation begins.

- **Option A – Unity**
  - Pros:
    - Mature engine for rhythm/timing games.
    - Good cross-platform support.
    - Rich tooling for animation and audio.
  - Cons:
    - Heavier project structure and build pipeline.

- **Option B – Flutter**
  - Pros:
    - Great for smooth UIs and animations.
    - Single codebase, good mobile support.
    - Dart is straightforward for stateful UI + timing.
  - Cons:
    - Less game-focused; timing needs careful handling.

- **Option C – React Native / Expo**
  - Pros:
    - JavaScript/TypeScript stack.
    - Good ecosystem, hot reload for iteration.
  - Cons:
    - Need to manage timing/latency carefully for rhythm precision.

The final choice will depend on your preferences and any existing ecosystem you want to leverage.

## Early Technical Priorities

- **Accurate Beat Timing**
  - Use high-resolution timers where available.
  - Decouple rendering FPS from beat calculations.

- **Latency Management**
  - Minimize delays between tap and feedback (audio/visual).
  - Consider simple audio design that is robust to minor device latency variations.

- **Config-Driven Tuning**
  - Central configuration for:
    - BPM ranges.
    - Perfect/good/miss windows (in ms).
    - Adaptation thresholds.

## Tooling & Workflow (Placeholder)

- Source control: Git.
- Project documentation: `memory-bank/` and `.cursor/rules/`.
- Build/CI specifics: To be defined once tech stack is chosen.



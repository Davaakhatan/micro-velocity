System Patterns – Micro-Velocity
================================

> This file captures intended architecture and design patterns. It will evolve as implementation decisions are made.

## Initial Architectural Direction

- **Client-First Game**:
  - Core loop (tempo detection, input, feedback, visuals) runs fully on-device.
  - No hard dependency on backend for a first playable prototype.

- **Game Architecture Style (Mobile)**:
  - Likely options:
    - Unity/Unreal or similar engine, OR
    - Native mobile with a game loop (e.g., iOS/Android with custom rendering), OR
    - Cross-platform framework with good timing/animation (e.g., Flutter, React Native + game/animation libs).
  - Final choice will be documented in `techContext.md`.

## Core Subsystems (Conceptual)

1. **Tempo Engine**
   - Responsible for:
     - Storing current BPM and beat phase.
     - Advancing beat timing each frame / tick.
     - Evaluating tap events against beat windows (perfect, good, miss).
   - Pattern:
     - Central `TempoManager` or equivalent singleton/service.

2. **Input & Timing Evaluation**
   - Single tap input channel (screen taps).
   - Each tap stamped with high-resolution time.
   - Compared against current beat with configurable tolerance windows.
   - Pattern:
     - Event-driven input handler that passes timestamps to `TempoManager`.

3. **Feedback Layer**
   - Visual and audio cues produced from evaluation results:
     - Perfect: subtle highlight, soft sound.
     - Offbeat: softer or dissonant cue.
   - Screen slowdown / assistance:
     - Adjusts animation speed / visual complexity when error rate increases.
   - Pattern:
     - Observer/listener pattern subscribing to tempo evaluation events.

4. **Session & Progress Tracking**
   - Tracks:
     - Duration of session.
     - Aggregate “time in sync” (e.g., % beats in perfect/good window).
   - Stores:
     - Lightweight local session summaries.
   - Pattern:
     - `SessionManager` managing state, with simple persistence layer (local storage/PlayerPrefs/etc.).

5. **Adaptation Logic**
   - Adjusts:
     - BPM within a small band.
     - Visual density or challenge factors.
   - Objective:
     - Maintain flow: not too easy, not too hard.
   - Pattern:
     - Small rules engine or heuristic module driven by recent performance metrics.

## Design Principles

- **Deterministic Timing First**:
  - All beat logic based on a stable internal clock.
  - Render/animation layer consumes timing, but does not define it.

- **Minimal Surface Area**:
  - Few UI screens:
    - Calibration
    - Main play
    - Simple summary/pauses

- **Configurable Tuning**
  - Tolerance windows, BPM ranges, and adaptation rules should be defined centrally (e.g., config file or constants module) for easy iteration.

## Future Extensibility (Not Required Now)

- Online leaderboards for “time in sync”.
- Shared “tempos” players can challenge each other with.
- Deeper cosmetic unlocks and themes.



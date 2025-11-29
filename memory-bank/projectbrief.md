Micro-Velocity – The Anti-Idle Game
===================================

## Core Concept

Micro-Velocity is a **mobile rhythm/tempo game** where **faster does not mean better**. Instead of spam-clicking or grinding like a traditional idle/auto game, players must tap in time with a **personalized BPM** (beats per minute) that is recalibrated each session.

The goal is not high APM, but to enter and sustain a **flow state** by staying “in sync” with the beat.

## High-Level Vision

- **Platform**: Mobile (initially touch-based; potentially extendable to haptics and wearables later).
- **Core Loop**: 
  - Session begins with a short calibration where the game infers or suggests a personal tempo.
  - Player taps along to this personalized BPM.
  - Every **perfectly timed beat** gives subtle, non-overwhelming feedback.
  - **Missed/late/early taps** gently slow down or modify the visual field, making it easier to get back in sync rather than punishing hard.
  - Over time, the system subtly adjusts or challenges the player’s tempo to maintain flow.
- **Hook**: The “addiction” comes from feeling perfectly synchronized and entering flow, **not** from constant flashy rewards or exponential numbers.

## Why This Exists / Differentiation

- Most rhythm games:
  - Use fixed tracks and patterns.
  - Demand memorization or very high precision at a fixed difficulty.
  - Reward speed and complexity.
- Micro-Velocity:
  - **Adapts to the player’s natural rhythm** each session.
  - Encourages **stability and presence**, not frantic action.
  - Uses **minimalist, clean feedback** instead of visual overload.
  - Treats “failure” (missed beats) as a gentle assist (screen slowing, clarity increase) rather than a harsh penalty.

This is effectively a **“flow trainer” disguised as a game**, exploring the space between rhythm games, meditation apps, and anti-idle design.

## Core Requirements (First Playable)

1. **Tempo Calibration**
   - Simple sequence at session start to infer a comfortable BPM for the player.
   - Option to manually pick tempo or accept suggested tempo.

2. **Beat Loop**
   - Continuous loop with:
     - Beat timing logic (window for perfect, good, miss).
     - Visual representation of the beat (e.g., pulsing circle, orbiting marker, or bar).
     - Tapping input mapped to timing evaluation.

3. **Adaptive Feedback**
   - Minimal but clear feedback on:
     - Perfect hit (e.g., subtle glow, small sound, tiny particle).
     - Slightly off vs. clear miss.
   - Screen slowdown / smoothing effect when the player desyncs, to help them recover.

4. **Session Flow**
   - Start: calibration → short tutorial → main loop.
   - During play: possible slow drift in difficulty (tempo adjustments, visual density).
   - End: simple summary of “time in sync”, not high scores or complex stats.

5. **Mobile-First UX**
   - One-thumb or two-thumb play.
   - Works well in both short and medium sessions (e.g., 2–10 minutes).

## Non-Goals (for Initial Scope)

- Not a content-heavy music game with many tracks.
- Not an idle/incremental game with complex meta-progression trees.
- Not a heavily monetized system; early focus is on **feel** and **core loop quality**.

## Success Criteria (Early Versions)

- Players report:
  - Feeling “pulled into” a rhythm.
  - Wanting to try “one more session” to chase that perfect in-sync run.
  - Low cognitive overload (calm but engaging).
- Technically:
  - Stable beat timing and input detection with low perceived latency.
  - Robust behavior across a range of device refresh rates.



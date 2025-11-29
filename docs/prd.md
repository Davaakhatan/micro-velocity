# Product Requirements Document (PRD)
## Micro-Velocity

## Overview

Micro-Velocity is a mobile rhythm/tempo game that challenges the traditional "faster is better" paradigm. Instead of rewarding speed or spam-clicking, it focuses on personalized rhythm synchronization and flow state achievement. The game adapts to each player's natural tempo through session-based BPM calibration, creating a meditative yet engaging experience.

## Goals

### Primary Goals
- Create a flow state-inducing mobile game that rewards rhythm and presence over speed
- Provide a calming, focused alternative to overstimulating mobile games
- Build an adaptive tempo system that personalizes to each player's natural rhythm
- Achieve smooth, low-latency performance on mobile devices (60 FPS target)

### Secondary Goals
- Minimize visual and audio overload while maintaining engagement
- Replace harsh failure states with supportive recovery mechanics
- Enable satisfying 2-10 minute play sessions
- Create a foundation for potential future extensions (cosmetics, social features)

## Problem Statement

Modern mobile games tend to:
- Reward constant interaction, spam-tapping, or grinding
- Over-stimulate with excessive visual and audio feedback
- Optimize for retention via extrinsic rewards (loot, upgrades, streaks)

This feels exhausting or shallow for players seeking something focused, calming, but still challenging.

## Core Features

### 1. Tempo Calibration (MVP)
- Short calibration sequence at session start to infer comfortable BPM
- Option to manually pick tempo or accept suggested tempo
- Ability to "lock in" a favorite BPM over time (future)

### 2. Beat Loop System (MVP)
- Continuous rhythm loop with configurable timing windows:
  - Perfect hit window
  - Good hit window
  - Miss evaluation
- Visual beat representation (pulsing circle, orbiting marker, or bar)
- Touch input mapped to timing evaluation

### 3. Adaptive Feedback (MVP)
- Minimal but clear feedback on hit quality:
  - Perfect: subtle glow, small sound, tiny particle effect
  - Good: softer feedback
  - Miss: gentle dissonant cue
- Screen slowdown/smoothing when player desyncs to aid recovery
- No harsh failure states

### 4. Session Flow (MVP)
- Start: Calibration → Short tutorial → Main loop
- During play: Possible slow drift in difficulty (tempo adjustments, visual density)
- End: Simple summary showing "time in sync" percentage

### 5. Mobile-First UX (MVP)
- Single-thumb or dual-thumb play support
- Optimized for 2-10 minute sessions
- Minimal UI: Calibration, Main Play, Summary/Pause screens

### 6. Adaptive Difficulty (Future)
- Subtle BPM adjustments within a small band
- Visual density changes based on performance
- Maintain flow state: not too easy, not too hard

### 7. Progression System (Future)
- Track "time in sync" streaks
- Unlock light cosmetic variations (colors, shapes, trails)
- Avoid heavy currencies or complex upgrade trees initially

## User Stories

### Core Experience
- As a player, I want the game to adapt to my natural rhythm so I don't feel pressured to tap faster than comfortable
- As a player, I want subtle feedback when I hit beats perfectly so I feel synchronized without being overwhelmed
- As a player, I want the game to help me recover when I miss beats rather than punishing me

### Session Management
- As a player, I want to complete meaningful sessions in 2-10 minutes so I can play during short breaks
- As a player, I want a simple calibration process that quickly finds my comfortable tempo
- As a player, I want to see how long I stayed "in sync" at the end of a session

### Feel and Flow
- As a player, I want to enter a flow/trance-like state where the UI "disappears"
- As a player, I want the experience to feel calming and focused, not frantic
- As a player, I want to feel better after a session, not exhausted

## Target Users

### Primary Audience
- Players who enjoy rhythm/music games but find them too punishing or visually noisy
- Users of mindfulness/meditation apps who want a more game-like loop
- Mobile gamers seeking subtle, skill-based games playable in short sessions

### User Behaviors
- Play in 2-10 minute bursts
- Seek a "zone" or flow state rather than big rewards
- Appreciate minimalist, aesthetically pleasing visuals and audio
- Value presence and focus over speed and grinding

## Success Metrics

### Qualitative Metrics
- Players report feeling "pulled into" a rhythm
- Users want to try "one more session" to chase perfect sync
- Low cognitive overload (calm but engaging experience)
- Positive feedback on "feeling better" after sessions

### Technical Metrics
- Stable beat timing with low perceived input latency (<50ms ideal)
- Consistent 60 FPS on target devices
- Robust behavior across various device refresh rates
- Session completion rate >70%

### Engagement Metrics (Future)
- Average session length: 5-8 minutes target
- Sessions per day: 2-4 sessions
- 7-day retention rate
- "Time in sync" improvement over sessions

## Non-Goals (Initial Scope)

- Not a content-heavy music game with many tracks
- Not an idle/incremental game with complex meta-progression trees
- Not a heavily monetized system (early focus on feel and core loop quality)
- No online multiplayer or real-time social features
- No complex storyline or narrative elements

## Technical Requirements

### Platform
- Primary: iOS and Android mobile devices
- Input: Touch (single or dual-thumb tapping)

### Performance
- 60 FPS target frame rate
- Very low perceived input latency for taps
- High-resolution timers for beat accuracy
- Rendering FPS decoupled from beat calculations

### Tech Stack Options (Decision Pending)
- Option A: Unity (mature rhythm game support, cross-platform)
- Option B: Flutter (smooth UI/animations, Dart timing)
- Option C: React Native/Expo (JS/TS stack, good ecosystem)

## Dependencies

### Internal
- Technology stack decision (Unity vs Flutter vs React Native)
- Audio design direction (meditative vs gamey)
- Visual design language (color palette, shapes, animations)
- Default session length and pause/resume behavior

### External
- Device audio latency handling
- Cross-device timing precision
- App store guidelines compliance

## Timeline

### Phase 1: Foundation & Documentation (Complete)
- Memory Bank initialization (complete)
- Core concept definition (complete)
- Tech stack decision: React Native + Expo

### Phase 2: First Playable Prototype
- Tempo engine implementation
- Tap evaluation logic
- Minimal visual prototype
- Basic audio feedback

### Phase 3: MVP Polish
- Full calibration flow
- Session summary screen
- Performance optimization
- Device testing across hardware

### Phase 4: Testing & Iteration
- User testing for flow state achievement
- Timing window tuning
- Visual/audio polish
- Latency optimization

## Open Questions

1. Which engine/framework should we commit to for v1?
2. How "meditative" vs "gamey" should the initial version feel (audio design, color palette)?
3. What default session length should we target?
4. How should pause/resume behavior work?
5. What are the optimal timing windows (in ms) for perfect/good/miss evaluation?
6. How aggressive should the adaptive difficulty adjustments be?

## Risks & Mitigation

### Risk: Input Latency Issues
- Mitigation: High-resolution timers, extensive device testing, configurable latency compensation

### Risk: "Flow" Not Achievable
- Mitigation: Extensive playtesting, iterative timing window tuning, adaptive difficulty

### Risk: Too Simple/Boring
- Mitigation: Careful visual/audio design, subtle progression elements, session variety

### Risk: Tech Stack Mismatch
- Mitigation: Early prototyping in chosen stack, validate timing precision before full build

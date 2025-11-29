# Design Decisions
## Micro-Velocity

This document tracks all major design and technical decisions made for the Micro-Velocity project, including rationale and alternatives considered.

## Tech Stack Decision

### Decision: React Native + Expo

**Date**: November 2025

**Rationale**:

1. **Timing Precision Requirements**
   - React Native provides `performance.now()` with sub-millisecond precision
   - Critical for rhythm games requiring <50ms input latency
   - Proven in timing-critical applications

2. **Development Velocity**
   - Hot reload enables rapid iteration on gameplay feel
   - Familiar JavaScript/TypeScript stack for solo developer
   - Largest mobile development community for troubleshooting

3. **Cross-Platform Efficiency**
   - Single codebase for iOS and Android
   - Expo managed workflow simplifies deployment
   - Consistent behavior across platforms

4. **Animation Ecosystem**
   - `react-native-reanimated` provides 60fps smooth animations
   - Native performance for visual feedback
   - Rich library ecosystem for UI polish

5. **Audio Handling**
   - `expo-av` and `react-native-sound` for low-latency audio
   - Proven libraries with good latency compensation
   - Community support for rhythm game audio needs

**Alternatives Considered**:

- **Unity**
  - Pros: Best-in-class for rhythm games, mature tooling
  - Cons: Overkill for 2D minimal design, C# learning curve, slower iteration
  - Decision: Too heavy for minimalist scope

- **Flutter**
  - Pros: Excellent UI/animations, good performance
  - Cons: Smaller ecosystem for timing-critical games, less community support for rhythm games
  - Decision: React Native has better proven track record for timing precision

**Trade-offs Accepted**:
- Slightly larger app size than native
- Need careful latency testing across devices
- Potential bridge overhead (mitigated by using native modules where needed)

## Design Direction

### Decision: Zen-Minimalist with Subtle Gamification

**Date**: November 2025

**Rationale**:

The design balances the "flow state" meditation goal with enough visual reward to maintain engagement without overwhelming the player.

**Philosophy**: "Calm Focus" - meditative base with subtle energy

**Why Not Pure Meditation**:
- Needs enough feedback to feel like a game
- Players need clear performance indicators
- Subtle rewards maintain motivation

**Why Not Traditional Game**:
- Avoid frantic, overwhelming aesthetics
- Support flow state rather than adrenaline
- Distinguish from typical rhythm games

## Color Palette

### Primary Colors

**Background**: Deep navy to dark purple gradient
- Primary: `#1a1a2e` (Deep navy)
- Secondary: `#16213e` (Dark purple-blue)
- Rationale: Calming, reduces eye strain, creates depth without distraction

**Accent Colors**:
- Primary: `#00d4ff` and `#00fff5` (Soft cyan/teal)
- Rationale: Cool, calming, high contrast against dark background
- Use: Beat indicators, UI elements, neutral feedback

**Perfect Hit**: `#ffb347` (Warm amber)
- Rationale: Warm without being aggressive, feels rewarding but not overwhelming
- Differentiates from the cool-toned UI

**Miss/Error**: Desaturated blue-gray
- Rationale: No harsh red - keeps calm atmosphere even on mistakes
- Subtle enough to not feel punishing

**Alternatives Considered**:
- Bright vibrant colors: Rejected as too stimulating
- Pure monochrome: Rejected as too sterile
- Warm color scheme: Rejected as less calming

## Timing Parameters

### BPM Range Decision

**Minimum**: 60 BPM (1 beat per second)
- Rationale: Very slow, meditative, accessible to all players
- Based on: Resting heart rate range

**Default**: 90 BPM
- Rationale: Natural human rhythm, comfortable for most
- Based on: Average walking pace

**Maximum**: 140 BPM
- Rationale: Challenging but not frantic, maintains flow possibility
- Avoids: Speed-tapping territory that contradicts core concept

**Alternatives Considered**:
- Higher max (180+ BPM): Rejected as too frantic for flow state
- Lower default (70 BPM): Rejected as potentially too slow for engagement

### Hit Window Sizes

**Perfect**: ±50ms (100ms total window)
- Rationale: Achievable with practice, feels rewarding
- Based on: Human reaction time research (190-250ms average)

**Good**: ±100ms (200ms total window)
- Rationale: Forgiving enough for flow maintenance
- Allows recovery without punishment

**Miss**: >100ms
- Rationale: Clear failure threshold without being punishing

**Research Basis**:
- Rhythm game industry standards
- Human temporal perception studies
- Playtesting feedback from similar games

### Calibration Algorithm

**Method**: Median of 10 taps
- Rationale: Removes outliers better than mean
- 10 taps provides statistical reliability without tedium

**Alternatives Considered**:
- Mean/average: Rejected due to outlier sensitivity
- 8 taps: Less reliable
- 16 taps: Too tedious for each session

## Session Structure

### Default Session Length: 5 minutes (300 seconds)

**Rationale**:
- Long enough for flow state entry
- Short enough for mobile context
- Matches typical meditation session length

**User Control**: To be determined
- May allow user selection in future
- Current focus: optimize 5-minute experience

### Pause Behavior: TBD

**Options Under Consideration**:
1. Allow pause mid-session (preserve flow metrics)
2. Enforce completion (stronger commitment)
3. Auto-pause on app background

**Decision Deferred**: Needs playtesting to determine impact on flow state

## Audio Design

### Library Selection: TBD

**Candidates**:
- `expo-av`: Integrated with Expo, good defaults
- `react-native-sound`: Lower latency, more control

**Testing Needed**:
- Actual latency measurements on real devices
- iOS vs Android comparison
- Integration complexity

### Sound Design Philosophy

**Perfect Hit**: Soft, pleasant tone
- Not jarring or loud
- Reinforces without interrupting

**Good Hit**: Subtler version of perfect
- Clear differentiation
- Non-punishing

**Miss**: Optional gentle dissonance
- May be optional in settings
- Never harsh or startling

## Adaptive Difficulty

### Increase Trigger: 85% perfect rate for 20 seconds
- Rationale: High consistency indicates player ready for challenge
- Gradual increase maintains flow

### Decrease Trigger: 25% miss rate for 15 seconds
- Rationale: Struggling player needs assistance
- Faster response than increase (player frustration prevention)

### Adjustment Amount: ±3-5 BPM
- Rationale: Noticeable but not jarring
- Preserves flow state continuity

## Typography

### Font Selection: Clean Sans-Serif

**Primary Candidates**:
- Inter
- SF Pro (iOS native)
- Roboto (Android native)

**Rationale**: Maximum readability, modern, minimal distraction

**Usage**:
- UI text: Medium weight
- Metrics: Light weight for subtlety
- Emphasis: Semibold (sparingly)

## Future Decisions Required

1. Haptic feedback intensity levels
2. Session pause/resume behavior
3. Audio library final selection (expo-av vs react-native-sound)
4. Default session length (fixed vs user-selectable)
5. Calibration UI style (metronome vs prompts)
6. Background ambience (subtle vs silent)
7. Particle effect intensity and count
8. Streak display prominence

## Decision Review Process

All decisions in this document should be:
- Revisited after first playable prototype
- Validated through playtesting
- Adjusted based on actual player feedback
- Updated with new data as available

---

**Document Status**: Living document, updated as decisions are made and validated.

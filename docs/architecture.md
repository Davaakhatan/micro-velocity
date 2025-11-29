# Architecture
## Micro-Velocity System Design

## System Overview

Micro-Velocity is a client-first mobile game with no hard backend dependency for the MVP. The core architecture focuses on precise timing, low latency, and smooth visual feedback to enable flow state gameplay.

### Architectural Principles

1. **Deterministic Timing First**: All beat logic based on stable internal clock, not render frames
2. **Minimal Surface Area**: Few screens, simple state management
3. **Configurable Tuning**: Central configuration for all timing and gameplay parameters
4. **Event-Driven Feedback**: Observer pattern for responsive audio/visual feedback
5. **Performance-Critical**: 60 FPS target with decoupled timing and rendering

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Mobile Client                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Presentation Layer                     │ │
│  │  - UI Screens (Calibration, Play, Summary)         │ │
│  │  - Visual Feedback (Particles, Glows, Animations)  │ │
│  │  - Audio Playback                                   │ │
│  └─────────────────┬──────────────────────────────────┘ │
│                    │                                     │
│  ┌─────────────────▼──────────────────────────────────┐ │
│  │              Game Logic Layer                       │ │
│  │  - Tempo Engine                                     │ │
│  │  - Input Evaluation                                 │ │
│  │  - Adaptation Logic                                 │ │
│  │  - Session Manager                                  │ │
│  └─────────────────┬──────────────────────────────────┘ │
│                    │                                     │
│  ┌─────────────────▼──────────────────────────────────┐ │
│  │              Core Services                          │ │
│  │  - High-Resolution Timer                            │ │
│  │  - Event Bus / Observer System                      │ │
│  │  - Configuration Manager                            │ │
│  │  - Local Persistence                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Core Subsystems

### 1. Tempo Engine

**Responsibility**: Manages beat timing, BPM, and beat phase tracking.

**Components**:
- `TempoManager`: Central singleton/service for tempo state
- `BeatClock`: High-resolution timing system
- `BeatEvaluator`: Evaluates tap timing against beat windows

**Key Functions**:
- Store and update current BPM and beat phase
- Advance beat timing independent of frame rate
- Calculate next beat timestamp
- Provide beat window boundaries (perfect/good/miss)

**Pattern**: Singleton or service locator for global tempo state

```
┌──────────────────────────────────────┐
│         TempoManager                 │
├──────────────────────────────────────┤
│ - currentBPM: float                  │
│ - beatPhase: float                   │
│ - lastBeatTime: timestamp            │
├──────────────────────────────────────┤
│ + updateBeat(deltaTime)              │
│ + evaluateTap(timestamp): HitQuality │
│ + adjustBPM(delta)                   │
│ + reset(newBPM)                      │
└──────────────────────────────────────┘
```

### 2. Input & Timing Evaluation

**Responsibility**: Capture touch input with precise timestamps and evaluate against beat windows.

**Components**:
- `InputHandler`: Platform-specific touch input capture
- `TimingEvaluator`: Compares tap time vs beat time
- `HitWindow`: Configurable tolerance windows

**Key Functions**:
- Capture tap events with high-resolution timestamps
- Calculate timing delta (tap time - beat time)
- Classify into Perfect/Good/Miss based on windows
- Apply latency compensation if needed

**Pattern**: Event-driven with observer notifications

```
Input Event → InputHandler → TimingEvaluator → HitQuality Event
                                    ↓
                              TempoManager (beat reference)
```

**Configuration**:
```
PerfectWindow: ±40ms
GoodWindow: ±80ms
Miss: >80ms
```

### 3. Feedback Layer

**Responsibility**: Provide visual and audio feedback based on hit quality and game state.

**Components**:
- `VisualFeedbackController`: Manages particles, glows, animations
- `AudioFeedbackController`: Triggers sound effects
- `ScreenEffectController`: Handles slowdown/smoothing
- `FeedbackObserver`: Subscribes to hit quality events

**Key Functions**:
- Listen to hit quality events (perfect/good/miss)
- Trigger appropriate visual effects
- Play synchronized audio cues
- Adjust screen animation speed on desync

**Pattern**: Observer pattern subscribing to timing events

```
HitQuality Event → FeedbackObserver
                        ↓
    ┌──────────────────┼──────────────────┐
    ↓                  ↓                  ↓
Visual Effects    Audio Cues      Screen Effects
```

**Visual Feedback Spec**:
- Perfect: Subtle glow + small particle burst
- Good: Softer glow
- Miss: Gentle dissonant visual (no harsh red/X)

**Screen Assistance**:
- Track recent miss rate
- If miss rate > threshold, slow down visuals by 10-20%
- Simplify visual complexity to aid recovery

### 4. Session & Progress Tracking

**Responsibility**: Manage session lifecycle and track performance metrics.

**Components**:
- `SessionManager`: Session state and lifecycle
- `PerformanceTracker`: Aggregate metrics
- `SessionStorage`: Local persistence

**Key Functions**:
- Start/stop session timing
- Track total beats and hits per quality
- Calculate "time in sync" percentage
- Store session summaries locally
- Generate session summary data

**Pattern**: Service with simple state machine

```
Session States: Calibration → Tutorial → Playing → Paused → Summary
```

**Tracked Metrics**:
- Session duration
- Total beats
- Perfect hits count
- Good hits count
- Miss count
- Time in sync % (perfect + good / total)
- Current streak

**Storage**:
- Local storage (SharedPreferences/UserDefaults/localStorage)
- Lightweight JSON session summaries
- No server dependency for MVP

### 5. Adaptation Logic

**Responsibility**: Adjust difficulty to maintain flow state.

**Components**:
- `AdaptationController`: Rules engine for adjustments
- `PerformanceMonitor`: Recent performance analysis
- `DifficultyTuner`: BPM and visual density adjustments

**Key Functions**:
- Monitor recent performance (sliding window)
- Detect if player too comfortable or struggling
- Subtly adjust BPM within configured band (±5-10 BPM)
- Modify visual density/complexity
- Maintain engagement without frustration

**Pattern**: Heuristic rules engine

**Adaptation Rules**:
```
If perfect_rate > 90% for 30 seconds:
  - Increase BPM by 2-5
  - Increase visual density slightly

If miss_rate > 30% for 20 seconds:
  - Decrease BPM by 2-5
  - Simplify visuals
  - Trigger slowdown effect
```

## Data Flow

### Typical Frame Update

```
1. Timer System updates (high-resolution)
2. TempoManager.updateBeat(deltaTime)
   - Advance beat phase
   - Check if new beat occurred
   - Emit beat event if needed
3. Input events processed
   - Timestamp captured
   - TimingEvaluator.evaluate(timestamp, currentBeat)
   - HitQuality determined
   - HitQuality event emitted
4. Feedback Layer responds
   - Visual effects triggered
   - Audio cues played
   - Screen effects updated
5. Performance tracking updated
   - Session metrics incremented
   - Adaptation logic evaluates
6. Render layer updates
   - Visual feedback rendered
   - UI updated (60 FPS target)
```

### Calibration Flow

```
1. User starts session
2. CalibrationScreen displayed
3. User taps along with prompts (8-16 beats)
4. System captures tap intervals
5. Calculate average interval → inferred BPM
6. Present suggested BPM to user
7. User accepts or manually adjusts
8. TempoManager initialized with chosen BPM
9. Tutorial screen (optional, brief)
10. Transition to main play
```

### Session Summary Flow

```
1. User ends session or session timeout
2. SessionManager finalizes metrics
3. Calculate final "time in sync" %
4. Generate session summary object
5. Store to local persistence
6. Display SummaryScreen with:
   - Session duration
   - Time in sync %
   - Longest streak
   - (Optional) Beat distribution chart
7. Return to calibration or exit
```

## Technology Stack

### Decision Pending

The architecture is designed to be implementable in multiple tech stacks:

#### Option A: Unity
- **Tempo Engine**: C# MonoBehaviour singleton
- **Input**: Unity Input System with touch support
- **Timing**: Time.realtimeSinceStartup for high-resolution
- **Feedback**: Particle systems, AudioSource components
- **Storage**: PlayerPrefs or JSON serialization

#### Option B: Flutter
- **Tempo Engine**: Dart service with ChangeNotifier
- **Input**: GestureDetector with timestamp
- **Timing**: Stopwatch or DateTime.now() with high precision
- **Feedback**: AnimationController, CustomPainter for visuals
- **Storage**: shared_preferences or sqflite

#### Option C: React Native / Expo
- **Tempo Engine**: JavaScript/TypeScript service class
- **Input**: TouchableWithoutFeedback with performance.now()
- **Timing**: performance.now() for high-resolution
- **Feedback**: Animated API, react-native-reanimated
- **Storage**: AsyncStorage or expo-sqlite

### Final Stack Decision Criteria
1. **Timing precision**: Can achieve <10ms timing variance?
2. **Input latency**: Touch-to-feedback <50ms?
3. **Animation smoothness**: Consistent 60 FPS?
4. **Development velocity**: Team familiarity and iteration speed?
5. **Cross-platform**: iOS + Android with single codebase?

## Configuration Management

### Central Config Structure

All tunable parameters defined in central configuration:

```javascript
GameConfig = {
  timing: {
    perfectWindow: 40,      // ms
    goodWindow: 80,         // ms
    bpmMin: 60,             // BPM
    bpmMax: 180,            // BPM
    bpmDefault: 90,         // BPM
    adaptationBand: 10,     // ±BPM for adaptation
  },
  calibration: {
    tapCount: 8,            // beats to capture
    minBPM: 60,
    maxBPM: 180,
  },
  adaptation: {
    evaluationWindow: 30,   // seconds
    perfectThreshold: 0.9,  // 90% for increase
    missThreshold: 0.3,     // 30% for decrease
    bpmIncrementStep: 3,
    bpmDecrementStep: 5,
  },
  session: {
    defaultDuration: 300,   // seconds (5 min)
    assistSlowdownFactor: 0.8,
  },
  visual: {
    particleCount: 5,
    glowDuration: 200,      // ms
    slowdownSpeed: 0.7,
  }
}
```

## Security Considerations

**MVP Scope** (Client-only):
- Local storage only (no sensitive data)
- No user accounts or authentication
- No network communication

**Future Considerations**:
- If adding online features: HTTPS only
- Session data privacy: no PII collection
- Secure storage for user preferences
- App store compliance (privacy policies)

## Scalability

**Current Design** (MVP):
- Single-player, client-only
- No backend infrastructure
- Minimal local storage

**Future Scalability Path**:
1. **Backend API**: Session sync, leaderboards
2. **Database**: User profiles, session history
3. **CDN**: Asset delivery (themes, sounds)
4. **Analytics**: Telemetry for tuning (privacy-compliant)
5. **Social Features**: Challenge sharing, friend systems

**Performance Scalability**:
- Particle pooling for visual effects
- Audio clip preloading and reuse
- Efficient render loops (avoid overdraw)
- Memory management for long sessions

## Infrastructure

**MVP**:
- No server infrastructure required
- Local device storage only
- App stores: Apple App Store, Google Play Store

**Development**:
- Git for source control
- CI/CD: GitHub Actions or similar (for builds)
- Testing: Device farm for cross-device testing
- Analytics: Optional (Firebase Analytics or similar)

## Testing Strategy

### Unit Testing
- TempoManager beat calculation logic
- TimingEvaluator hit quality classification
- Adaptation logic rules
- Session metrics calculations

### Integration Testing
- Calibration flow end-to-end
- Session lifecycle (start → play → summary)
- Feedback layer responsiveness
- Configuration loading

### Performance Testing
- Frame rate stability (target: 60 FPS)
- Input latency measurement
- Memory usage over time
- Battery consumption

### Device Testing
- Cross-device timing precision
- Audio latency compensation
- Various screen sizes and aspect ratios
- iOS and Android platform differences

## Future Considerations

### Potential Extensions (Post-MVP)

1. **Online Leaderboards**
   - Backend API for session submission
   - "Time in sync" global rankings
   - Friend comparisons

2. **Shared Tempo Challenges**
   - Pre-defined BPM challenges
   - Community challenge creation
   - Social sharing

3. **Advanced Cosmetics**
   - Unlockable themes (visual + audio)
   - Particle effect variations
   - Background ambience options

4. **Haptic Feedback**
   - Beat haptic pulses
   - Hit quality haptic responses
   - Device vibration support

5. **Wearable Integration**
   - Heart rate monitoring for BPM suggestion
   - Wearable haptic feedback
   - Activity ring integration

6. **Analytics & Tuning**
   - Telemetry for timing window optimization
   - A/B testing for visual feedback
   - Performance heatmaps

## Open Technical Questions

1. **Latency Compensation**: How much device-specific audio latency compensation is needed?
2. **Timer Precision**: Which timer API provides best precision on target platforms?
3. **Frame Budget**: Can we maintain 60 FPS with particle effects on lower-end devices?
4. **Touch Precision**: What's the actual touch timestamp precision on iOS vs Android?
5. **Background Behavior**: How should the game handle app backgrounding during a session?
6. **Battery Impact**: What's acceptable battery drain per hour of gameplay?

---

**Document Status**: Living document, will be updated as implementation decisions are made and architecture evolves.

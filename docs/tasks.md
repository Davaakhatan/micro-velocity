# Tasks
## Micro-Velocity Development Roadmap

## Immediate Priorities

### Current Phase: Specification & Design
- [ ] Complete design-decisions.md with tech stack rationale
- [ ] Complete visual-design.md with full design system
- [ ] Complete timing-spec.md with all timing parameters
- [ ] Create tech-stack.md with React Native + Expo setup guide
- [ ] Create getting-started.md with environment setup instructions
- [ ] Generate wireframes for 3 main screens
- [ ] Generate architecture and timing flow diagrams

## To Do

### Foundation & Planning
- [x] Decide on initial tech stack: React Native + Expo selected
- [ ] Update techContext.md with final tech stack decision and rationale
- [ ] Define exact calibration flow and UX wireframes (in progress)
- [ ] Specify beat evaluation windows (perfect/good/miss in ms) (in progress)
- [ ] Design minimal UI wireframes for: Calibration → Play → Summary (in progress)
- [x] Define audio design direction: Zen-minimalist with subtle gamification
- [x] Choose color palette and visual design language: Deep navy/purple with cyan/teal
- [ ] Determine default session length and pause/resume behavior

### Core Systems Implementation
- [ ] Implement Tempo Engine
  - [ ] Central TempoManager singleton/service
  - [ ] BPM storage and beat phase tracking
  - [ ] Beat timing advancement (frame/tick independent)
  - [ ] Tap event evaluation against beat windows
  - [ ] High-resolution timer integration
- [ ] Implement Input & Timing System
  - [ ] Touch input handler with timestamp capture
  - [ ] Event-driven architecture for tap events
  - [ ] Latency compensation system
  - [ ] Perfect/good/miss window evaluation
- [ ] Implement Feedback Layer
  - [ ] Visual feedback system (perfect/good/miss cues)
  - [ ] Audio feedback integration
  - [ ] Screen slowdown/smoothing on desync
  - [ ] Observer/listener pattern for tempo events
- [ ] Implement Session Manager
  - [ ] Session duration tracking
  - [ ] "Time in sync" percentage calculation
  - [ ] Local storage/persistence layer
  - [ ] Session summary data structure
- [ ] Implement Adaptation Logic
  - [ ] BPM adjustment within configured band
  - [ ] Visual density adaptation
  - [ ] Flow state maintenance heuristics
  - [ ] Performance metrics collection

### Calibration System
- [ ] Design calibration sequence flow
- [ ] Implement BPM detection algorithm
- [ ] Build calibration UI
- [ ] Add manual tempo override option
- [ ] Implement "suggested tempo" presentation
- [ ] Add tutorial sequence after calibration

### Visual Systems
- [ ] Design and implement beat visualization (pulsing circle/orbiting marker/bar)
- [ ] Create particle effects for perfect hits
- [ ] Implement glow effects for feedback
- [ ] Build slowdown/smoothing visual effects
- [ ] Design and implement minimal UI screens
- [ ] Optimize for 60 FPS performance

### Audio Systems
- [ ] Design audio palette (sounds for perfect/good/miss)
- [ ] Implement audio playback with low latency
- [ ] Handle device-specific audio latency variations
- [ ] Create subtle background ambience (optional)
- [ ] Test audio sync across devices

### Session & UX Flow
- [ ] Build session start flow (calibration → tutorial → play)
- [ ] Implement main play loop
- [ ] Create session summary screen
- [ ] Design and implement pause/resume functionality
- [ ] Add session exit/save flow

### Configuration & Tuning
- [ ] Create central configuration system
  - [ ] BPM ranges configuration
  - [ ] Timing window definitions (ms)
  - [ ] Adaptation thresholds
  - [ ] Visual/audio parameters
- [ ] Build dev tools for real-time tuning (optional)

### Testing & Optimization
- [ ] Device testing plan (iOS/Android, various models)
- [ ] Input latency testing across devices
- [ ] Frame rate stability testing
- [ ] Timing window tuning based on user feedback
- [ ] Performance profiling and optimization
- [ ] Battery usage optimization

### Polish & Launch Prep
- [ ] Visual polish pass
- [ ] Audio polish pass
- [ ] UX flow refinement
- [ ] App store assets preparation
- [ ] App store compliance review
- [ ] Privacy policy and legal requirements

## In Progress

### Specification Documents
- [ ] Create design-decisions.md
- [ ] Create visual-design.md
- [ ] Create timing-spec.md
- [ ] Create tech-stack.md
- [ ] Create getting-started.md

### Visual Assets
- [ ] Generate wireframes
- [ ] Generate diagrams

## Completed

### Phase 1: Concept & Documentation
- [x] Define core game concept (anti-idle tempo game)
- [x] Establish personalized BPM as core mechanic
- [x] Define flow state as primary goal
- [x] Identify target users and use cases
- [x] Document problem space and differentiation
- [x] Define success criteria
- [x] Document non-goals and scope boundaries
- [x] Establish Memory Bank documentation system
- [x] Create docs directory with structured documentation
- [x] Initialize Memory Bank structure
- [x] Create projectbrief.md
- [x] Create productContext.md
- [x] Create systemPatterns.md
- [x] Create techContext.md
- [x] Create activeContext.md
- [x] Create progress.md
- [x] Create comprehensive PRD
- [x] Create tasks roadmap
- [x] Create architecture documentation
- [x] Make tech stack decision (React Native + Expo)
- [x] Define design direction (Zen-minimalist)
- [x] Establish color palette
- [x] Remove emojis from all documentation

## Blocked

_No blocked items currently_

---

## Future Considerations (Post-MVP)

### Progression System
- [ ] Design cosmetic unlock system
- [ ] Implement "time in sync" streak tracking
- [ ] Create color/shape/trail variations
- [ ] Design unlock conditions and progression curve

### Social Features
- [ ] Online leaderboards for "time in sync"
- [ ] Shared tempo challenges
- [ ] Friend comparison features

### Extended Features
- [ ] Multiple visual themes
- [ ] BPM "lock in" and favorites system
- [ ] Session history and analytics
- [ ] Haptic feedback integration
- [ ] Wearable device support
- [ ] Extended session modes

### Monetization (Future)
- [ ] Define monetization strategy
- [ ] Cosmetic IAP design
- [ ] Premium themes/modes
- [ ] Ad integration (if applicable)

---

## Notes

- **Current Phase**: Concept & Documentation Setup
- **Next Major Milestone**: Tech stack decision and first playable prototype
- **Critical Path**: Tech stack → Tempo engine → Input system → Visual feedback → First playable
- **Known Risks**: Input latency, flow state achievability, device timing variations

Active Context – Micro-Velocity
===============================

## Current Focus

- **Tech Stack Decision and First Playable Specification**
- Finalize:
  - Technology stack: React Native + Expo
  - Visual design system: Zen-minimalist aesthetic
  - Timing parameters: BPM ranges and hit windows
  - Wireframes and technical diagrams
  - Development environment setup

## Recent Decisions

- The game is defined as:
  - A **mobile, tempo-based "anti-idle" game** where faster tapping is not rewarded.
  - Core experience: maintaining rhythm with a **personalized BPM** that changes each session.
  - Players are rewarded with **flow and subtle feedback**, not constant big rewards.
  - Missed beats lead to **soft assistance** (slowing visuals) rather than harsh failure.

- Documentation structure:
  - `projectbrief.md` holds high-level scope and success criteria.
  - `productContext.md` clarifies user problems, experience goals, and emotional tone.
  - `systemPatterns.md` outlines conceptual architecture and key subsystems.
  - `techContext.md` tracks platform and technology choices/constraints.
  - `progress.md` will log what's implemented and what's next.
  - `docs/` directory created with PRD, architecture, and task roadmap.

- **Tech Stack Selected**: React Native + Expo
  - Best for timing-critical rhythm games (sub-millisecond precision)
  - Fast iteration with hot reload, familiar JS/TS stack
  - Cross-platform: single codebase for iOS + Android
  - Rich animation ecosystem (react-native-reanimated)

- **Design Direction**: Zen-Minimalist with Subtle Gamification
  - Deep navy/purple gradient background
  - Soft cyan/teal primary colors
  - Warm amber accents for perfect hits
  - No harsh failure colors (no red)

- **No Emojis Policy**: All documentation must be emoji-free for professional consistency

## Next Steps (Planned)

- **Complete specification documents**:
  - Design decisions documentation
  - Visual design system specification
  - Timing parameters (BPM, hit windows, calibration)
  - React Native + Expo tech stack guide
  - Getting started guide with environment setup

- **Generate visual assets**:
  - Wireframes: Calibration, main play, session summary
  - Diagrams: System architecture, timing flow

- **Begin implementation** (Week 1-2):
  - Set up React Native + Expo development environment
  - Create project scaffold and folder structure
  - Build skeleton UI (no logic yet)

- **First Prototype** (Week 3-4):
  - Implement tempo engine with performance.now() timing
  - Build calibration flow (10-tap median algorithm)
  - Add basic tap detection and evaluation

## Open Questions

- Audio library selection: expo-av vs react-native-sound for lowest latency?
- Haptic feedback intensity: How strong should perfect/good/miss haptics be?
- Calibration UI: Visual metronome vs simple tap prompts?
- Session pause behavior: Allow mid-session pause or enforce full completion?
- Default session length: 5 minutes (300 seconds) or user-selectable?



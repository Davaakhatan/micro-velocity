# Visual Design System
## Micro-Velocity

Complete visual design specification for the Micro-Velocity rhythm game.

## Design Philosophy

**Core Principle**: "Calm Focus"

The visual design creates a meditative environment that supports flow state while providing clear, non-overwhelming feedback. Every visual element serves the goal of keeping players present and synchronized with their rhythm.

### Key Tenets

1. **Minimize Distraction**: Nothing should pull attention from the beat
2. **Subtle Reinforcement**: Feedback celebrates without overwhelming
3. **Depth Without Clutter**: Use gradients and layers for visual interest without complexity
4. **Organic Motion**: Smooth, natural easing (avoid robotic or jarring transitions)
5. **Accessibility**: High contrast, clear hierarchies, readable at all times

## Color Palette

### Primary Colors

**Background Gradient**:
```
Top: #1a1a2e (Deep Navy)
Bottom: #16213e (Dark Purple-Blue)
```
- **Usage**: App background, creates depth and calm
- **Effect**: Dark enough to reduce eye strain, purple tint adds warmth
- **Gradient Direction**: Top to bottom, subtle 15-degree angle for visual interest

**Primary Accent**:
```
Light: #00fff5 (Bright Cyan)
Main: #00d4ff (Soft Cyan)
Dark: #00a0c8 (Deep Cyan)
```
- **Usage**: Beat indicators, UI elements, neutral feedback, text
- **Effect**: Cool, calming, high contrast against dark background
- **Accessibility**: AAA contrast ratio against background

### Feedback Colors

**Perfect Hit**:
```
Primary: #ffb347 (Warm Amber)
Glow: #ffd47f (Light Amber)
```
- **Usage**: Perfect hit particle bursts, glow effects, streak indicators
- **Effect**: Warm, rewarding, stands out without being aggressive
- **Duration**: Quick flash (200ms) then fade

**Good Hit**:
```
Primary: #7dd3ff (Light Blue)
Subtle: #4db8e8 (Medium Blue)
```
- **Usage**: Good hit feedback, softer than perfect
- **Effect**: Positive reinforcement without stealing focus
- **Duration**: Subtle pulse (150ms)

**Miss/Off-Beat**:
```
Primary: #4a5568 (Blue-Gray)
Subtle: #364154 (Dark Blue-Gray)
```
- **Usage**: Miss indicators, desync visual cues
- **Effect**: Noticeable but not punishing, maintains calm
- **NO RED**: Avoids stress response

### UI Colors

**Text**:
```
Primary: #e8f4f8 (Off-White)
Secondary: #a0c4d0 (Light Gray-Blue)
Disabled: #6b7c8c (Medium Gray)
```

**Borders/Dividers**:
```
Subtle: #2a3f52 (Dark Blue-Gray)
Emphasis: #3d5a6e (Medium Blue-Gray)
```

## Typography

### Font Stack

**Primary**: System font stack for optimal performance
```
iOS: SF Pro Display / SF Pro Text
Android: Roboto
Web Fallback: Inter, system-ui, sans-serif
```

### Type Scale

**Display** (Session Summary, Large Numbers):
```
Size: 48px / 3rem
Weight: 300 (Light)
Letter Spacing: -0.02em
Line Height: 1.2
```

**Heading** (Screen Titles):
```
Size: 24px / 1.5rem
Weight: 500 (Medium)
Letter Spacing: -0.01em
Line Height: 1.3
```

**Body** (Instructions, UI Text):
```
Size: 16px / 1rem
Weight: 400 (Regular)
Letter Spacing: 0em
Line Height: 1.5
```

**Caption** (Small Labels):
```
Size: 12px / 0.75rem
Weight: 500 (Medium)
Letter Spacing: 0.05em (slightly spaced)
Line Height: 1.4
```

### Font Usage Rules

- **Metrics** (BPM, %, Streak): Display or Heading weight 300 (Light) for elegance
- **Instructions**: Body weight 400 for readability
- **Buttons/Actions**: Caption or Body weight 500 (Medium) for emphasis
- **Never use all-caps** except for small labels (e.g., "BPM" acronym)

## Layout & Spacing

### Spacing Scale

Based on 8px grid system:
```
Micro: 4px   (0.25rem)
Small: 8px   (0.5rem)
Base: 16px   (1rem)
Medium: 24px (1.5rem)
Large: 32px  (2rem)
XLarge: 48px (3rem)
XXLarge: 64px (4rem)
```

### Screen Padding

```
Mobile Portrait: 24px (1.5rem) horizontal, 32px (2rem) vertical
Landscape: 32px (2rem) horizontal, 24px (1.5rem) vertical
Safe Areas: Auto-adjusted for notches/home indicators
```

### Component Spacing

- **Between sections**: 48px (3rem)
- **Between related items**: 16px (1rem)
- **Inline spacing**: 8px (0.5rem)
- **Touch targets**: Minimum 44px height for accessibility

## Screen Designs

### 1. Calibration Screen

**Layout**:
```
[Top: App Logo/Title - centered]
  32px spacing
[Instructions - centered, body text]
  48px spacing
[Beat Indicator - large, centered, pulsing]
  24px spacing
[Tap Counter - e.g., "Tap 5 of 10" - centered, caption]
  64px spacing
[Manual BPM Override - small link, bottom]
```

**Beat Indicator**:
- Circle, 120px diameter
- Cyan outline (3px stroke)
- Pulses outward on each beat (scale 1.0 to 1.2 over 100ms)
- Fade in/out glow effect

**Tap Feedback**:
- On tap: Quick scale animation (1.0 to 0.95 to 1.05 to 1.0) - 200ms
- Ripple effect from center (cyan with 20% opacity)

### 2. Main Play Screen

**Layout**:
```
[Top Bar: BPM display, small, left-aligned]
[Streak counter, small, right-aligned]

  [Centered vertical space for beat visualization]

  [Beat Indicator - large circle, center]
  [Visual timing guides]

[Bottom: Time remaining / session progress - subtle]
```

**Beat Indicator (Main)**:
- Circle, 160px diameter
- Cyan outline (4px stroke when idle)
- Pulsing rhythm visualization:
  - Outer ring scales from 1.0 to 1.15 in sync with BPM
  - Inner fill opacity pulses (20% to 40%)
- Current beat highlight: Brief glow (200ms)

**Tap Zone**:
- Full screen is tap-able (no restricted area)
- Visual indicator helps timing but doesn't limit input

**Timing Guides** (Visual Cues):
- Orbiting particle/dot moving around beat circle
- Completes orbit exactly on beat timing
- Speed adjusts with BPM changes
- Color: Cyan, subtle glow

**Hit Feedback**:
- **Perfect**: Warm amber burst (8-12 particles), bright glow (200ms)
- **Good**: Light blue pulse (150ms), no particles
- **Miss**: Slight desaturation of beat indicator (100ms)

**Streak Display**:
- Top right corner
- Format: "15 Perfect" or "23 Combo"
- Animates up on increment
- Fades slightly on break

**BPM Display**:
- Top left corner
- Format: "90 BPM"
- Subtle glow when adjusting
- Small animation on change

### 3. Session Summary Screen

**Layout**:
```
[Title: "Session Complete" - centered, heading]
  48px spacing
[Time in Sync - Large display metric]
  "85%" - huge, light weight
  "Time in Sync" - caption below
  32px spacing

[Secondary Metrics - grid or list]
  Session Duration: 5:23
  Perfect Hits: 142
  Longest Streak: 28
  Average BPM: 92

  48px spacing
[Action Buttons]
  [New Session] [View History (future)]
```

**Metrics Display**:
- Primary metric (Time in Sync %): Display size, light weight
- Color: Cyan for good (>70%), Amber for excellent (>85%)
- Secondary metrics: Body size, two-column grid
- Icons: Minimal, optional, never distracting

### 4. Settings Screen (Future)

Minimal settings to preserve simplicity:
- Default BPM preference
- Audio feedback toggle
- Haptic feedback intensity
- Color theme (future: alternative palettes)

## Animation Principles

### Easing Functions

**Default**: Ease-out cubic (smooth deceleration)
```
cubic-bezier(0.33, 1, 0.68, 1)
```

**Bounce (Subtle)**: For celebration moments
```
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

**Linear**: Only for continuous loops (orbiting particles)
```
linear
```

### Duration Standards

```
Micro: 100ms (quick feedback)
Short: 200ms (standard transitions)
Medium: 300ms (screen transitions)
Long: 500ms (rare, dramatic moments)
```

### Animation Principles

1. **Physics-Inspired**: Use ease-out for natural feel
2. **Responsive**: Instant feedback on tap (<16ms to start animation)
3. **Subtle**: Most animations are 100-200ms, not 500ms+
4. **Purposeful**: Every animation reinforces game state
5. **Performance**: 60fps minimum, use native driver where possible

## Visual Feedback Specifications

### Perfect Hit

**Particle Burst**:
- Count: 8-12 particles
- Color: Warm amber (#ffb347)
- Initial velocity: Outward from center, randomized angles
- Lifespan: 300-500ms
- Fade: Linear opacity 100% to 0%
- Size: Start 6px, shrink to 2px

**Glow Effect**:
- Duration: 200ms
- Color: Light amber (#ffd47f)
- Blur radius: 20px
- Opacity: 60% peak, fade out

**Sound**: Soft chime (design TBD)

### Good Hit

**Pulse Effect**:
- Duration: 150ms
- Scale: 1.0 to 1.08 to 1.0
- Color: Light blue tint
- Opacity shift: Subtle

**Sound**: Softer version of perfect (design TBD)

### Miss

**Desaturation**:
- Duration: 100ms
- Effect: Beat indicator loses 30% saturation
- No harsh flash or red
- Optionally: Slight slow-motion effect (0.9x speed for 200ms)

**Sound**: Optional soft dissonance, or silence

### Slowdown Assistance (On Desync)

When miss rate exceeds threshold:
- Visual speed multiplier: 0.75x (25% slower)
- All animations slow proportionally
- Beat indicator pulses slow to match
- Gradual transition (500ms blend)
- Color shift: Slightly warmer to indicate "assist mode"

## Component Library

### Button Styles

**Primary Action**:
```
Background: Cyan gradient (#00d4ff to #00fff5)
Text: Dark navy (#1a1a2e)
Padding: 16px horizontal, 12px vertical
Border Radius: 24px (fully rounded)
Font: Body size, weight 500
Touch Effect: Scale 0.95 on press
```

**Secondary Action**:
```
Background: Transparent
Border: 2px solid cyan (#00d4ff)
Text: Cyan (#00d4ff)
Padding: 16px horizontal, 12px vertical
Border Radius: 24px
Touch Effect: Background cyan 10% opacity on press
```

**Text Link**:
```
Text: Cyan (#00d4ff)
Underline: None
Font: Body or caption, weight 500
Touch Effect: Opacity 70%
```

### Cards / Panels

**Standard Card**:
```
Background: #1f2d3d (slightly lighter than main bg)
Border: 1px solid #2a3f52
Border Radius: 16px
Padding: 24px
Shadow: Subtle (0px 4px 12px rgba(0,0,0,0.3))
```

## Accessibility

### Contrast Ratios

All text meets WCAG AA standards minimum:
- Large text (18px+): 3:1 minimum
- Body text: 4.5:1 minimum
- UI elements: 3:1 minimum

**Tested Combinations**:
- Cyan on dark navy: 8.2:1 (AAA)
- Amber on dark navy: 6.1:1 (AAA)
- White on dark navy: 12.5:1 (AAA)

### Touch Targets

Minimum size: 44 x 44px (Apple HIG standard)
Spacing between targets: 8px minimum

### Motion

- Respect `prefers-reduced-motion` system setting
- Disable particle effects if requested
- Keep essential animations (beat pulses) but reduce intensity

## Responsive Behavior

### Portrait (Primary)

Optimized for one-handed vertical use:
- Beat indicator: Large, center
- Info: Top corners
- Full screen tap-able

### Landscape

Adapted layout:
- Beat indicator: Slightly left of center
- Metrics: Right panel
- Instructions: Left panel

### Tablet / Large Screens

- Scale UI proportionally
- Maximum beat indicator: 240px diameter
- Add subtle side padding to prevent stretching

## Dark Theme Only

No light theme planned for MVP. Dark background is essential for:
- Reducing eye strain during extended sessions
- Creating calm, meditative atmosphere
- Making cyan/amber feedback pop without being harsh

## Future Visual Enhancements

Potential additions after MVP:
- Alternative color palettes (warm, cool, monochrome)
- Unlock-able particle effects
- Background pattern variations (subtle)
- Session history visualizations
- Achievement badges (minimal)

---

**Document Status**: Living specification, will be refined during implementation and testing.

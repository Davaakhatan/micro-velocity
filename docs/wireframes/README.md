# Wireframes
## Micro-Velocity UI/UX Wireframes

This directory contains wireframes for all screens in Micro-Velocity.

## Planned Wireframes

### 1. Calibration Flow (`calibration-flow.png`)

Shows the complete calibration sequence:
- Welcome screen with instructions
- Beat indicator for tapping
- Progress indicator (e.g., "Tap 5 of 10")
- Results screen with detected BPM
- Manual override option

**Key Elements**:
- Clear, centered instructions
- Large tap zone (full screen tap-able)
- Visual beat pulse guide
- Tap counter
- "Manual BPM" link at bottom

### 2. Main Play Screen (`main-play-screen.png`)

The core gameplay interface:
- Minimalist layout, maximum focus on beat
- Central beat indicator (large pulsing circle)
- Orbiting timing guide particle
- BPM display (top left, small)
- Streak counter (top right, small)
- Session time remaining (bottom, subtle)

**Key Elements**:
- 160px diameter beat circle
- Cyan color scheme
- Clean, uncluttered space
- Full-screen tap zone
- Subtle hit feedback overlay

### 3. Session Summary (`session-summary.png`)

Post-session results screen:
- "Session Complete" title
- Large "Time in Sync" percentage (main metric)
- Secondary metrics in grid:
  - Session duration
  - Perfect hits count
  - Longest streak
  - Average BPM
- Action buttons:
  - "New Session" (primary)
  - "View History" (secondary, future)

**Key Elements**:
- Celebration layout
- Clear metric hierarchy
- Positive color coding (cyan for good, amber for excellent)
- Easy path to next session

## Wireframe Specifications

All wireframes follow these standards:

**Screen Size**: iPhone 14 Pro (393 x 852 pt) portrait
**Safe Areas**: Accounted for notch and home indicator
**Color Palette**: As defined in visual-design.md
**Typography**: System fonts (SF Pro / Roboto)

## Tools for Creating Wireframes

Recommended tools:
- **Figma**: https://figma.com (collaborative, web-based)
- **Sketch**: https://sketch.com (macOS only)
- **Adobe XD**: https://adobe.com/products/xd
- **Excalidraw**: https://excalidraw.com (quick, simple)

## How to Generate Wireframes

### Option 1: Design Tools

Use Figma/Sketch/XD with these specs:
1. Create artboard: 393 x 852 px
2. Apply color palette from visual-design.md
3. Use 8px grid system for spacing
4. Export as PNG or SVG

### Option 2: AI Generation

You can use AI image generation with prompts like:

```
Create a mobile app wireframe for a minimalist rhythm game:
- Dark navy/purple gradient background (#1a1a2e to #16213e)
- Large circular beat indicator in center (cyan color)
- Minimal UI with top status bar
- Clean, zen aesthetic
- Portrait orientation
- Style: Modern, minimal, dark theme
```

### Option 3: Hand Sketches

Even hand-drawn wireframes scanned/photographed are valuable for initial planning.

## Naming Convention

```
[screen-name]-[variation].png

Examples:
calibration-flow.png
calibration-flow-v2.png
main-play-screen.png
main-play-screen-landscape.png
session-summary.png
```

## Next Steps

1. Create wireframes using preferred tool
2. Save to this directory
3. Review against visual-design.md specs
4. Iterate based on feedback
5. Use as reference during implementation

## Status

- [ ] Calibration flow wireframe
- [ ] Main play screen wireframe
- [ ] Session summary wireframe
- [ ] Landscape variations (future)
- [ ] Tablet adaptations (future)

---

**Note**: Wireframes will be created and added to this directory as the design phase progresses.

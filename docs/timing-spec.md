# Timing Specification
## Micro-Velocity

Complete technical specification for all timing-related systems in Micro-Velocity.

## Overview

Timing precision is critical for Micro-Velocity's rhythm-based gameplay. This document defines all timing parameters, algorithms, and implementation requirements to achieve sub-50ms perceived latency and accurate beat evaluation.

## Core Timing Requirements

### Performance Targets

- **Input Latency**: <50ms from touch to visual feedback
- **Timing Precision**: <10ms variance in beat calculations
- **Frame Rate**: Consistent 60 FPS (16.67ms per frame)
- **Audio Latency**: <100ms on modern devices
- **Timer Resolution**: Sub-millisecond (use `performance.now()`)

## BPM (Beats Per Minute)

### Range Specifications

```javascript
BPM_MIN = 60      // 1 beat per second (slow, meditative)
BPM_DEFAULT = 90  // 1.5 beats per second (natural rhythm)
BPM_MAX = 140     // 2.33 beats per second (challenging)
```

### Beat Interval Calculations

```javascript
// Beat interval in milliseconds
beatInterval = 60000 / BPM

Examples:
60 BPM  = 1000ms per beat (1 second)
90 BPM  = 666.67ms per beat
120 BPM = 500ms per beat (0.5 seconds)
140 BPM = 428.57ms per beat
```

### BPM Precision

- Store as float: Allow decimal precision (e.g., 92.5 BPM)
- Display as integer: Round for UI display
- Calculate with float: Use full precision internally

## Hit Window Specifications

### Window Sizes (in milliseconds)

```javascript
WINDOW_PERFECT = 50    // ±50ms from exact beat time
WINDOW_GOOD = 100      // ±100ms from exact beat time
WINDOW_MISS = 101      // >100ms is considered a miss
```

### Window Visualization

```
Timeline (milliseconds relative to perfect beat):

-100  -50   0   +50  +100
 |     |    |    |     |
 [GOOD][PERFECT][GOOD]
       <--50ms-->
 <-----100ms----->

Outside ±100ms = MISS
```

### Hit Quality Evaluation

```javascript
function evaluateTap(tapTime, beatTime) {
  const delta = Math.abs(tapTime - beatTime);

  if (delta <= WINDOW_PERFECT) {
    return 'PERFECT';  // ±50ms
  } else if (delta <= WINDOW_GOOD) {
    return 'GOOD';     // ±100ms
  } else {
    return 'MISS';     // >100ms
  }
}
```

### Early vs Late

While not displayed to user, track internally for analytics:

```javascript
function evaluateTapDetailed(tapTime, beatTime) {
  const delta = tapTime - beatTime;  // Signed value

  if (Math.abs(delta) <= WINDOW_PERFECT) {
    return {
      quality: 'PERFECT',
      timing: delta < 0 ? 'early' : 'late',
      offset: delta
    };
  }
  // ... etc
}
```

## Calibration System

### Calibration Parameters

```javascript
CALIBRATION_TAP_COUNT = 10       // Number of taps to collect
CALIBRATION_MIN_INTERVAL = 300   // Min ms between taps (200 BPM)
CALIBRATION_MAX_INTERVAL = 2000  // Max ms between taps (30 BPM)
```

### Calibration Algorithm

**Method**: Median of tap intervals (removes outliers)

```javascript
function calibrateBPM(tapTimestamps) {
  // Calculate intervals between consecutive taps
  const intervals = [];
  for (let i = 1; i < tapTimestamps.length; i++) {
    intervals.push(tapTimestamps[i] - tapTimestamps[i-1]);
  }

  // Remove outliers: Filter intervals outside reasonable range
  const validIntervals = intervals.filter(interval =>
    interval >= CALIBRATION_MIN_INTERVAL &&
    interval <= CALIBRATION_MAX_INTERVAL
  );

  // Sort and find median
  validIntervals.sort((a, b) => a - b);
  const median = validIntervals[Math.floor(validIntervals.length / 2)];

  // Convert to BPM
  const bpm = 60000 / median;

  // Clamp to valid range
  return Math.max(BPM_MIN, Math.min(BPM_MAX, bpm));
}
```

### Calibration Confidence

Track variance to determine calibration quality:

```javascript
function calculateConfidence(intervals) {
  const median = getMedian(intervals);
  const deviations = intervals.map(i => Math.abs(i - median));
  const avgDeviation = deviations.reduce((a,b) => a+b) / deviations.length;

  // Low deviation = high confidence
  if (avgDeviation < 50) return 'HIGH';
  if (avgDeviation < 100) return 'MEDIUM';
  return 'LOW';
}
```

If confidence is LOW, suggest user re-calibrate.

## Tempo Engine

### Beat Clock Implementation

```javascript
class TempoEngine {
  constructor(bpm) {
    this.bpm = bpm;
    this.beatInterval = 60000 / bpm;
    this.startTime = performance.now();
    this.currentBeatIndex = 0;
  }

  // Get the timestamp of the next beat
  getNextBeatTime() {
    return this.startTime + (this.beatInterval * (this.currentBeatIndex + 1));
  }

  // Update on each frame
  update(currentTime) {
    const nextBeatTime = this.getNextBeatTime();

    if (currentTime >= nextBeatTime) {
      this.onBeat();
      this.currentBeatIndex++;
    }
  }

  // Get current beat phase (0.0 to 1.0)
  getBeatPhase(currentTime) {
    const timeSinceLastBeat = (currentTime - this.startTime) % this.beatInterval;
    return timeSinceLastBeat / this.beatInterval;
  }
}
```

### Frame-Independent Timing

**Critical**: Beat timing must NOT depend on frame rate.

```javascript
// WRONG: Incrementing on each frame
beatTime += deltaTime;  // Will drift!

// CORRECT: Calculate from absolute time
beatTime = startTime + (beatInterval * beatIndex);
```

### High-Resolution Timer

Always use `performance.now()` for timing:

```javascript
const currentTime = performance.now();  // Sub-millisecond precision
```

Never use:
- `Date.now()` (millisecond precision only)
- `setTimeout/setInterval` (unreliable timing)

## Adaptive Difficulty

### Performance Monitoring

Track recent performance in sliding window:

```javascript
EVALUATION_WINDOW_SIZE = 20    // Last 20 beats
EVALUATION_WINDOW_TIME = 20000 // or 20 seconds, whichever first
```

### Adaptation Thresholds

```javascript
// Increase difficulty when player is doing well
PERFECT_RATE_INCREASE_THRESHOLD = 0.85   // 85% perfect hits
INCREASE_DURATION_REQUIRED = 20000       // Sustained for 20 seconds

// Decrease difficulty when player is struggling
MISS_RATE_DECREASE_THRESHOLD = 0.25      // 25% miss rate
DECREASE_DURATION_REQUIRED = 15000       // Faster response (15 seconds)
```

### BPM Adjustment

```javascript
BPM_INCREMENT_STEP = 3      // Increase by 3-5 BPM
BPM_DECREMENT_STEP = 5      // Decrease by 5 BPM (faster assistance)
BPM_ADJUSTMENT_MAX = 20     // Never adjust more than ±20 from start BPM
```

### Adaptation Algorithm

```javascript
function evaluateAdaptation(recentHits, currentBPM, startBPM) {
  const perfectRate = recentHits.filter(h => h === 'PERFECT').length / recentHits.length;
  const missRate = recentHits.filter(h => h === 'MISS').length / recentHits.length;

  // Check if we should increase difficulty
  if (perfectRate >= PERFECT_RATE_INCREASE_THRESHOLD) {
    const newBPM = Math.min(
      currentBPM + BPM_INCREMENT_STEP,
      startBPM + BPM_ADJUSTMENT_MAX,
      BPM_MAX
    );
    return newBPM;
  }

  // Check if we should decrease difficulty
  if (missRate >= MISS_RATE_DECREASE_THRESHOLD) {
    const newBPM = Math.max(
      currentBPM - BPM_DECREMENT_STEP,
      startBPM - BPM_ADJUSTMENT_MAX,
      BPM_MIN
    );
    return newBPM;
  }

  return currentBPM; // No change
}
```

### Smooth BPM Transitions

When adjusting BPM, transition smoothly over 2-3 seconds:

```javascript
function transitionBPM(oldBPM, newBPM, duration = 2000) {
  const startTime = performance.now();

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1.0);

    // Ease-out transition
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentBPM = oldBPM + (newBPM - oldBPM) * eased;

    if (progress < 1.0) {
      requestAnimationFrame(update);
    }
  }

  update();
}
```

## Slowdown Assistance

### Trigger Conditions

Activate visual slowdown when:

```javascript
SLOWDOWN_MISS_THRESHOLD = 0.30    // 30% miss rate
SLOWDOWN_CHECK_WINDOW = 10        // Last 10 beats
```

### Slowdown Effect

```javascript
SLOWDOWN_FACTOR = 0.75            // 75% speed (25% slower)
SLOWDOWN_TRANSITION_TIME = 500    // 500ms blend in/out
```

### Implementation

Apply time multiplier to animations only (NOT to beat timing):

```javascript
// Animations run at reduced speed
animationSpeed = baseSpeed * slowdownFactor;

// Beat timing remains accurate
beatTime = calculateBeatTime();  // Unaffected
```

## Session Timing

### Session Duration

```javascript
DEFAULT_SESSION_DURATION = 300    // 5 minutes (300 seconds)
SESSION_WARNING_TIME = 30         // Warn 30 seconds before end
```

### Session Metrics

Track throughout session:

```javascript
{
  startTime: timestamp,
  endTime: timestamp,
  duration: milliseconds,
  totalBeats: number,
  perfectHits: number,
  goodHits: number,
  misses: number,
  longestStreak: number,
  bpmStart: number,
  bpmEnd: number,
  bpmAverage: number
}
```

### Time in Sync Calculation

```javascript
function calculateTimeInSync(hits) {
  const successfulHits = hits.filter(h => h === 'PERFECT' || h === 'GOOD').length;
  const totalHits = hits.length;
  return (successfulHits / totalHits) * 100;  // Percentage
}
```

## Audio Timing

### Audio Latency Compensation

Different platforms have different audio latency:

```javascript
// Platform-specific compensation (to be measured)
const AUDIO_LATENCY_IOS = 50;        // ~50ms typical
const AUDIO_LATENCY_ANDROID = 100;   // ~100ms typical (varies widely)
```

### Audio Sync Strategy

Play audio cue slightly before visual beat:

```javascript
const audioTriggerTime = visualBeatTime - AUDIO_LATENCY;
scheduleAudioCue(audioTriggerTime);
```

### Testing Required

Audio latency varies by:
- Device model
- Audio library (expo-av vs react-native-sound)
- Android manufacturer

Must test on real devices and potentially offer user calibration.

## Input Handling

### Touch Timestamp

Capture high-resolution timestamp immediately on touch:

```javascript
onTouchStart = (event) => {
  const tapTime = performance.now();
  this.evaluateTap(tapTime);
};
```

### Input Buffering

Don't process multiple taps within minimum interval:

```javascript
MIN_TAP_INTERVAL = 100;  // Ignore taps within 100ms of previous

if (tapTime - lastTapTime < MIN_TAP_INTERVAL) {
  return; // Ignore accidental double-tap
}
```

## Performance Optimization

### Timing Critical Code

Keep timing calculations in tight loops:

```javascript
// Pre-calculate values
const beatInterval = 60000 / bpm;
const windowPerfect = 50;
const windowGood = 100;

// Fast evaluation in game loop
function evaluateTap(tapTime, beatTime) {
  const delta = Math.abs(tapTime - beatTime);
  return delta <= windowPerfect ? 'PERFECT' :
         delta <= windowGood ? 'GOOD' : 'MISS';
}
```

### Avoid in Timing Code

- Async operations
- Heavy calculations
- DOM reads/writes
- Network calls
- Logging (in production)

## Testing & Validation

### Unit Tests

Test timing logic with precise values:

```javascript
describe('Beat Evaluation', () => {
  it('should evaluate perfect hit at ±50ms', () => {
    expect(evaluateTap(1000, 950)).toBe('PERFECT');   // -50ms
    expect(evaluateTap(1000, 1050)).toBe('PERFECT');  // +50ms
  });

  it('should evaluate good hit at ±100ms', () => {
    expect(evaluateTap(1000, 900)).toBe('GOOD');      // -100ms
    expect(evaluateTap(1000, 1100)).toBe('GOOD');     // +100ms
  });

  it('should evaluate miss beyond ±100ms', () => {
    expect(evaluateTap(1000, 880)).toBe('MISS');      // -120ms
    expect(evaluateTap(1000, 1120)).toBe('MISS');     // +120ms
  });
});
```

### Performance Tests

Measure actual latency on devices:

```javascript
// Latency test: Touch to visual feedback
const touchTime = performance.now();
requestAnimationFrame(() => {
  const renderTime = performance.now();
  const latency = renderTime - touchTime;
  console.log(`Input latency: ${latency}ms`);
});
```

### Calibration Tests

Verify calibration algorithm accuracy:

```javascript
// Simulate perfect taps at 90 BPM (666.67ms intervals)
const intervals = [667, 666, 667, 667, 666, 667, 666, 667, 666];
const bpm = calibrateBPM(simulateTaps(intervals));
expect(bpm).toBeCloseTo(90, 1);  // Within 1 BPM
```

## Constants Reference

```javascript
// File: src/constants/timing.js

export const TIMING = {
  // BPM Limits
  BPM_MIN: 60,
  BPM_MAX: 140,
  BPM_DEFAULT: 90,

  // Hit Windows (ms)
  WINDOW_PERFECT: 50,
  WINDOW_GOOD: 100,

  // Calibration
  CALIBRATION_TAP_COUNT: 10,
  CALIBRATION_MIN_INTERVAL: 300,
  CALIBRATION_MAX_INTERVAL: 2000,

  // Adaptation
  PERFECT_RATE_THRESHOLD: 0.85,
  MISS_RATE_THRESHOLD: 0.25,
  BPM_INCREMENT: 3,
  BPM_DECREMENT: 5,
  BPM_ADJUSTMENT_MAX: 20,
  EVALUATION_WINDOW_SIZE: 20,
  EVALUATION_WINDOW_TIME: 20000,

  // Slowdown
  SLOWDOWN_FACTOR: 0.75,
  SLOWDOWN_MISS_THRESHOLD: 0.30,
  SLOWDOWN_CHECK_WINDOW: 10,
  SLOWDOWN_TRANSITION_TIME: 500,

  // Session
  DEFAULT_SESSION_DURATION: 300,
  SESSION_WARNING_TIME: 30,

  // Input
  MIN_TAP_INTERVAL: 100,
};
```

---

**Document Status**: Technical specification ready for implementation. Values may be tuned based on playtesting.

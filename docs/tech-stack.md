# Tech Stack Guide
## Micro-Velocity - React Native + Expo

Complete technology stack specification and setup guide for Micro-Velocity.

## Technology Stack Overview

### Core Framework

**React Native with Expo**
- Version: Latest stable (Expo SDK 50+)
- Language: TypeScript
- Navigation: React Navigation v6
- State Management: React Context + Hooks (simple, no Redux needed for MVP)

### Key Libraries

**Timing & Performance**:
- `performance.now()` (built-in, sub-millisecond precision)
- `requestAnimationFrame` (for game loop)

**Animation**:
- `react-native-reanimated` v3 (60fps native animations)
- `react-native-gesture-handler` (touch input)

**Audio**:
- TBD: `expo-av` OR `react-native-sound`
  - Need to test latency on real devices
  - Will document findings and make final choice

**Storage**:
- `@react-native-async-storage/async-storage` (session data)

**Haptics**:
- `expo-haptics` (tactile feedback)

**Development**:
- TypeScript (type safety)
- ESLint + Prettier (code quality)
- Jest + React Native Testing Library (testing)

## Why React Native + Expo?

### Strengths for Micro-Velocity

1. **Timing Precision**
   - `performance.now()` provides sub-millisecond timestamps
   - Proven in rhythm games and timing-critical apps
   - JavaScript event loop handles timing well when used correctly

2. **Fast Iteration**
   - Expo Go for instant testing on device
   - Hot reload for rapid gameplay tuning
   - Over-the-air updates for beta testing

3. **Cross-Platform**
   - Single codebase for iOS + Android
   - Consistent behavior (when done right)
   - Shared business logic and UI

4. **Animation Performance**
   - `react-native-reanimated` runs on native thread
   - 60fps smooth animations
   - Gesture handling with `gesture-handler`

5. **Developer Experience**
   - Familiar web technologies (JS/TS, React)
   - Huge community and library ecosystem
   - Excellent debugging tools

### Trade-offs Accepted

- **Slightly larger app size** than native (acceptable for our scope)
- **JavaScript bridge overhead** (mitigated by using native modules for timing)
- **Android fragmentation** (need testing on various devices)

## Project Structure

```
micro-velocity/
├── app/                      # Expo Router (or src/ if using React Navigation)
│   ├── (tabs)/              # Tab navigation
│   ├── index.tsx            # Entry point
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # React components
│   │   ├── BeatIndicator.tsx
│   │   ├── CalibrationScreen.tsx
│   │   ├── PlayScreen.tsx
│   │   └── SummaryScreen.tsx
│   ├── engine/              # Game engine (timing logic)
│   │   ├── TempoEngine.ts
│   │   ├── BeatEvaluator.ts
│   │   └── AdaptationEngine.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useTempo.ts
│   │   ├── useCalibration.ts
│   │   └── useSession.ts
│   ├── services/            # Services
│   │   ├── AudioService.ts
│   │   ├── StorageService.ts
│   │   └── HapticsService.ts
│   ├── constants/           # Constants and config
│   │   ├── timing.ts
│   │   ├── colors.ts
│   │   └── config.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── utils/               # Utility functions
│       └── calculations.ts
├── assets/                  # Images, fonts, sounds
│   ├── sounds/
│   └── fonts/
├── tests/                   # Test files
│   ├── engine/
│   └── components/
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Installation & Setup

### Prerequisites

```bash
# Node.js 18+ (check version)
node --version

# npm or yarn
npm --version

# Expo CLI
npm install -g expo-cli

# iOS (macOS only)
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# Android
# Install Android Studio
# Set up Android SDK and emulator
```

### Create Project

```bash
# Create new Expo project with TypeScript
npx create-expo-app micro-velocity --template expo-template-blank-typescript

cd micro-velocity

# Install dependencies
npm install
```

### Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Animation
npm install react-native-reanimated react-native-gesture-handler

# Storage
npm install @react-native-async-storage/async-storage

# Haptics (included in Expo)
# expo-haptics is already available

# Audio (test both, decide later)
npm install expo-av
# OR
npm install react-native-sound

# Development
npm install --save-dev @types/react @types/react-native
npm install --save-dev jest @testing-library/react-native
npm install --save-dev eslint prettier
```

### Configure TypeScript

`tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Configure Reanimated

`babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // Must be last
  };
};
```

### ESLint + Prettier

`.eslintrc.js`:
```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

`.prettierrc`:
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true
}
```

## Running the App

### Development

```bash
# Start Expo dev server
npm start

# iOS simulator (macOS only)
npm run ios

# Android emulator
npm run android

# Expo Go on physical device
# Scan QR code from npm start
```

### Testing

```bash
# Run tests
npm test

# Test with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Performance Configuration

### React Native Performance

Enable Hermes JavaScript engine (`app.json`):
```json
{
  "expo": {
    "jsEngine": "hermes",
    "android": {
      "enableHermes": true
    },
    "ios": {
      "jsEngine": "hermes"
    }
  }
}
```

### Reanimated Configuration

Use `useSharedValue` and `withTiming` for smooth animations:

```typescript
import {useSharedValue, withTiming} from 'react-native-reanimated';

const scale = useSharedValue(1);

// Smooth animation on native thread
scale.value = withTiming(1.2, {duration: 200});
```

### Game Loop Implementation

```typescript
import {useEffect, useRef} from 'react';

function useGameLoop(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
}
```

## Audio Implementation

### Option A: expo-av

```typescript
import {Audio} from 'expo-av';

// Initialize
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  shouldDuckAndroid: false,
});

// Load sound
const {sound} = await Audio.Sound.createAsync(
  require('./assets/sounds/perfect-hit.mp3'),
  {shouldPlay: false}
);

// Play with low latency
await sound.playAsync();
```

### Option B: react-native-sound

```typescript
import Sound from 'react-native-sound';

// Load sound
const sound = new Sound('perfect-hit.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.error('Failed to load sound', error);
  }
});

// Play
sound.play();
```

**Decision**: Test both on real devices, measure latency, choose best.

## Storage Implementation

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save session
await AsyncStorage.setItem('session_history', JSON.stringify(sessions));

// Load sessions
const data = await AsyncStorage.getItem('session_history');
const sessions = data ? JSON.parse(data) : [];
```

## Haptics Implementation

```typescript
import * as Haptics from 'expo-haptics';

// Perfect hit
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Good hit
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Miss (optional, or none)
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
```

## Platform-Specific Considerations

### iOS

- Audio latency: ~50ms typical
- Use `soundshouldPlay` for instant playback
- Test on real device (simulator has different latency)

### Android

- Audio latency: Varies widely (50-200ms depending on device)
- May need user calibration option
- Test on multiple manufacturers (Samsung, Pixel, OnePlus)

## Build & Deployment

### Development Build

```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### App Store Submission

Follow Expo's guide:
- https://docs.expo.dev/submit/ios/
- https://docs.expo.dev/submit/android/

## Testing Strategy

### Unit Tests

Test timing logic in isolation:

```typescript
// tests/engine/BeatEvaluator.test.ts
import {evaluateTap} from '@/engine/BeatEvaluator';

describe('Beat Evaluation', () => {
  it('should return PERFECT for ±50ms', () => {
    expect(evaluateTap(1000, 950)).toBe('PERFECT');
  });
});
```

### Component Tests

```typescript
import {render, fireEvent} from '@testing-library/react-native';
import BeatIndicator from '@/components/BeatIndicator';

test('beat indicator pulses on beat', () => {
  const {getByTestId} = render(<BeatIndicator />);
  const indicator = getByTestID('beat-indicator');
  // Assert animations
});
```

### Device Testing

- Test on minimum 3 iOS devices (iPhone SE, iPhone 12, iPhone 14)
- Test on minimum 5 Android devices (various manufacturers)
- Measure actual latency on each
- Document device-specific quirks

## Performance Monitoring

### React DevTools

```bash
npm install --save-dev @react-devtools/core
```

### Performance Profiling

```typescript
// Measure component render time
import {Profiler} from 'react';

<Profiler id="PlayScreen" onRender={onRenderCallback}>
  <PlayScreen />
</Profiler>
```

### FPS Monitoring

```typescript
// Monitor frame rate in development
if (__DEV__) {
  setInterval(() => {
    console.log('FPS:', global.nativePerformanceNow());
  }, 1000);
}
```

## Debugging

### Remote Debugging

```bash
# Open React DevTools
npm run devtools

# Debug in Chrome
# Press 'j' in terminal to open debugger
```

### Network Debugging

No network calls in MVP, but for future:
```bash
# Use Reactotron or Flipper
npm install --save-dev reactotron-react-native
```

## Common Issues & Solutions

### Issue: Animations laggy

**Solution**: Use `react-native-reanimated` on native thread, not Animated API

### Issue: Touch latency high

**Solution**:
- Use `react-native-gesture-handler`
- Avoid heavy computations in touch handlers
- Profile and optimize

### Issue: Audio latency varies

**Solution**:
- Measure on each platform
- Consider user calibration option
- Pre-load sounds

### Issue: Timer drift

**Solution**:
- Always use `performance.now()` absolute time
- Never accumulate `deltaTime`
- Recalculate beat times from start time

## Resources

- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Reanimated: https://docs.swmansion.com/react-native-reanimated/

## Next Steps

1. Set up project with template
2. Install dependencies
3. Create basic folder structure
4. Implement TempoEngine (timing-spec.md)
5. Build skeleton UI (visual-design.md)
6. Test on real devices
7. Iterate based on feel

---

**Document Status**: Implementation guide ready. Update with actual performance measurements during development.

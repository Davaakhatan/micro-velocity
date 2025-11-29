# Getting Started with Micro-Velocity
## Quick Start Guide

This guide will get you from zero to running the Micro-Velocity prototype.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+**: Download from https://nodejs.org
- **Git**: For version control
- **Code Editor**: VS Code recommended
- **Mobile Device** or **Emulator**: For testing

### Platform-Specific Requirements

**macOS** (for iOS development):
- Xcode (latest version from App Store)
- CocoaPods: `sudo gem install cocoapods`

**Windows/Linux** (Android only):
- Android Studio
- Android SDK
- Android Emulator configured

## Step 1: Install Tools

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
```

## Step 2: Create Project

```bash
# Navigate to your projects folder
cd ~/Projects

# Create new Expo project
npx create-expo-app micro-velocity --template expo-template-blank-typescript

# Navigate into project
cd micro-velocity
```

## Step 3: Install Dependencies

```bash
# Install all required packages
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-reanimated react-native-gesture-handler
npm install @react-native-async-storage/async-storage
npm install expo-av

# Install development dependencies
npm install --save-dev @types/react @types/react-native
npm install --save-dev jest @testing-library/react-native
npm install --save-dev eslint prettier
```

## Step 4: Configure Project

### Update `babel.config.js`

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

### Update `app.json`

```json
{
  "expo": {
    "name": "Micro-Velocity",
    "slug": "micro-velocity",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "jsEngine": "hermes",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.microvelocity"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.yourname.microvelocity"
    }
  }
}
```

### Create `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

## Step 5: Set Up Project Structure

```bash
# Create folder structure
mkdir -p src/{components,engine,hooks,services,constants,types,utils}
mkdir -p assets/{sounds,fonts}
mkdir -p tests/{engine,components}
```

## Step 6: Create Constants

Create `src/constants/timing.ts`:

```typescript
export const TIMING = {
  BPM_MIN: 60,
  BPM_MAX: 140,
  BPM_DEFAULT: 90,
  WINDOW_PERFECT: 50,
  WINDOW_GOOD: 100,
  CALIBRATION_TAP_COUNT: 10,
  // ... (copy from timing-spec.md)
};
```

Create `src/constants/colors.ts`:

```typescript
export const COLORS = {
  background: {
    top: '#1a1a2e',
    bottom: '#16213e',
  },
  primary: {
    light: '#00fff5',
    main: '#00d4ff',
    dark: '#00a0c8',
  },
  perfect: '#ffb347',
  good: '#7dd3ff',
  miss: '#4a5568',
  // ... (copy from visual-design.md)
};
```

## Step 7: Implement Core Engine

Create `src/engine/TempoEngine.ts`:

```typescript
export class TempoEngine {
  private bpm: number;
  private beatInterval: number;
  private startTime: number;
  private currentBeatIndex: number;

  constructor(bpm: number) {
    this.bpm = bpm;
    this.beatInterval = 60000 / bpm;
    this.startTime = performance.now();
    this.currentBeatIndex = 0;
  }

  getNextBeatTime(): number {
    return this.startTime + this.beatInterval * (this.currentBeatIndex + 1);
  }

  update(currentTime: number): boolean {
    const nextBeatTime = this.getNextBeatTime();

    if (currentTime >= nextBeatTime) {
      this.currentBeatIndex++;
      return true; // Beat occurred
    }
    return false;
  }

  getBeatPhase(currentTime: number): number {
    const timeSinceStart = currentTime - this.startTime;
    const timeSinceLastBeat = timeSinceStart % this.beatInterval;
    return timeSinceLastBeat / this.beatInterval;
  }

  setBPM(newBPM: number): void {
    this.bpm = newBPM;
    this.beatInterval = 60000 / newBPM;
  }
}
```

Create `src/engine/BeatEvaluator.ts`:

```typescript
import {TIMING} from '../constants/timing';

export type HitQuality = 'PERFECT' | 'GOOD' | 'MISS';

export function evaluateTap(tapTime: number, beatTime: number): HitQuality {
  const delta = Math.abs(tapTime - beatTime);

  if (delta <= TIMING.WINDOW_PERFECT) {
    return 'PERFECT';
  } else if (delta <= TIMING.WINDOW_GOOD) {
    return 'GOOD';
  } else {
    return 'MISS';
  }
}
```

## Step 8: Create Simple Test App

Update `App.tsx`:

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {TempoEngine} from './src/engine/TempoEngine';
import {evaluateTap, HitQuality} from './src/engine/BeatEvaluator';
import {COLORS} from './src/constants/colors';

export default function App() {
  const [engine] = useState(() => new TempoEngine(90));
  const [lastHit, setLastHit] = useState<HitQuality | null>(null);
  const [beatCount, setBeatCount] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const gameLoop = () => {
      const currentTime = performance.now();
      const beatOccurred = engine.update(currentTime);

      if (beatOccurred) {
        setBeatCount((count) => count + 1);
      }

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [engine]);

  const handleTap = () => {
    const tapTime = performance.now();
    const beatTime = engine.getNextBeatTime();
    const result = evaluateTap(tapTime, beatTime);
    setLastHit(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Micro-Velocity Prototype</Text>
      <Text style={styles.beats}>Beats: {beatCount}</Text>
      <Pressable style={styles.tapZone} onPress={handleTap}>
        <Text style={styles.tapText}>TAP HERE</Text>
      </Pressable>
      {lastHit && (
        <Text style={[styles.result, styles[lastHit.toLowerCase()]]}>
          {lastHit}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.top,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: COLORS.primary.main,
    marginBottom: 20,
  },
  beats: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  tapZone: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.primary.dark,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
  },
  perfect: {
    color: COLORS.perfect,
  },
  good: {
    color: COLORS.good,
  },
  miss: {
    color: COLORS.miss,
  },
});
```

## Step 9: Run the App

```bash
# Start development server
npm start

# Then choose platform:
# - Press 'i' for iOS simulator (macOS only)
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on physical device
```

## Step 10: Verify It Works

You should see:
- A dark background (zen design)
- Beat counter incrementing every ~667ms (90 BPM)
- Tap zone in center
- Tap feedback showing PERFECT/GOOD/MISS

## Next Steps

### Immediate

1. **Add Visual Beat Indicator**
   - Pulsing circle that scales with beat
   - Use `react-native-reanimated`

2. **Implement Calibration**
   - Create calibration screen
   - 10-tap BPM detection

3. **Add Audio**
   - Test `expo-av` latency
   - Add perfect/good/miss sounds

### Short Term

4. **Build Full Screens**
   - Calibration
   - Main Play
   - Session Summary

5. **Add Persistence**
   - Save session history
   - Use AsyncStorage

6. **Implement Adaptive Difficulty**
   - BPM adjustment based on performance

## Documentation Reference

Now that you have the basics running, refer to detailed specs:

- **Visual Design**: `docs/visual-design.md`
- **Timing Logic**: `docs/timing-spec.md`
- **Tech Details**: `docs/tech-stack.md`
- **Architecture**: `docs/architecture.md`
- **Full Requirements**: `docs/prd.md`

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### iOS build fails

```bash
# Reinstall pods
cd ios
pod install
cd ..
npm run ios
```

### Android build fails

```bash
# Clean gradle
cd android
./gradlew clean
cd ..
npm run android
```

### Animation performance issues

- Make sure `react-native-reanimated/plugin` is last in `babel.config.js`
- Restart metro bundler: `npx expo start --clear`

## Getting Help

- Documentation: Check all docs in `docs/` folder
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- GitHub Issues: (create repo and track issues)

## Development Workflow

1. Make changes to code
2. Save (hot reload updates instantly)
3. Test on device/emulator
4. Iterate quickly
5. Commit frequently

```bash
# Good commit practice
git add .
git commit -m "feat: add beat evaluation logic"
```

## Ready to Build

You now have:
- Development environment set up
- Basic prototype running
- Core timing engine implemented
- Foundation for full game

Next: Follow the 8-week development timeline in `docs/prd.md` and build out each feature systematically.

---

**Good luck building Micro-Velocity!**

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import {TempoEngine} from './src/engine/TempoEngine';
import {evaluateTap, HitQuality} from './src/engine/BeatEvaluator';
import {COLORS} from './src/constants/colors';
import {BeatIndicator} from './src/components/BeatIndicator';

export default function App() {
  const [engine] = useState(() => new TempoEngine(60));
  const [lastHit, setLastHit] = useState<HitQuality | null>(null);
  const [beatCount, setBeatCount] = useState(0);
  const [beatOccurred, setBeatOccurred] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const gameLoop = () => {
      const currentTime = performance.now();
      const beatHappened = engine.update(currentTime);

      if (beatHappened) {
        setBeatCount((count) => count + 1);
        setBeatOccurred(true);
        setTimeout(() => setBeatOccurred(false), 50);
      }

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [engine]);

  const handleTap = async () => {
    const tapTime = performance.now();
    const beatTime = engine.getNextBeatTime();
    const result = evaluateTap(tapTime, beatTime);
    setLastHit(result);

    // Update streak
    if (result === 'PERFECT' || result === 'GOOD') {
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        setBestStreak((prevBest) => Math.max(prevBest, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    // Haptic feedback based on hit quality
    if (result === 'PERFECT') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (result === 'GOOD') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>BPM</Text>
          <Text style={styles.statValue}>60</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>STREAK</Text>
          <Text style={[styles.statValue, streak > 5 && styles.streakActive]}>
            {streak}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>BEST</Text>
          <Text style={styles.statValue}>{bestStreak}</Text>
        </View>
      </View>

      <View style={styles.tapArea}>
        <BeatIndicator size={240} onBeat={beatOccurred} />
        <Pressable style={styles.tapZone} onPress={handleTap}>
          <Text style={styles.tapText}>TAP</Text>
        </Pressable>
      </View>

      {lastHit && (
        <Text style={[styles.result, styles[lastHit.toLowerCase() as 'perfect' | 'good' | 'miss']]}>
          {lastHit}
        </Text>
      )}

      <Text style={styles.beats}>Beats: {beatCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.top,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 32,
    color: COLORS.text.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  streakActive: {
    color: COLORS.perfect,
  },
  tapArea: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: COLORS.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  result: {
    fontSize: 48,
    fontWeight: 'bold',
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
  beats: {
    fontSize: 14,
    color: COLORS.text.disabled,
  },
});

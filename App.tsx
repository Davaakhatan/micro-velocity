import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import {TempoEngine} from './src/engine/TempoEngine';
import {evaluateTap, HitQuality} from './src/engine/BeatEvaluator';
import {COLORS} from './src/constants/colors';
import {BeatIndicator} from './src/components/BeatIndicator';
import AudioService from './src/services/AudioService';
import StorageService from './src/services/StorageService';

export default function App() {
  const [engine] = useState(() => new TempoEngine(60));
  const [lastHit, setLastHit] = useState<HitQuality | null>(null);
  const [beatCount, setBeatCount] = useState(0);
  const [beatOccurred, setBeatOccurred] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [currentBPM, setCurrentBPM] = useState(60);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Initialize audio and load high score
  useEffect(() => {
    AudioService.init();

    // Load high score
    StorageService.getStats().then(stats => {
      setHighScore(stats.highScore);
    });

    return () => {
      AudioService.cleanup();
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const gameLoop = () => {
      const currentTime = performance.now();
      const beatHappened = engine.update(currentTime);

      if (beatHappened) {
        setBeatCount((count) => count + 1);
        setBeatOccurred(true);
        setTimeout(() => setBeatOccurred(false), 50);
        // Play metronome click
        AudioService.playBeat();
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

    // Update streak and score
    if (result === 'PERFECT' || result === 'GOOD') {
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        setBestStreak((prevBest) => Math.max(prevBest, newStreak));

        // Update multiplier based on streak
        const newMultiplier = Math.min(Math.floor(newStreak / 5) + 1, 8);
        setMultiplier(newMultiplier);

        // Increase BPM every 10 streak (max 90 BPM)
        if (newStreak % 10 === 0 && newStreak > 0) {
          const newBPM = Math.min(60 + Math.floor(newStreak / 10) * 5, 90);
          setCurrentBPM(newBPM);
          engine.setBPM(newBPM);
        }

        return newStreak;
      });

      // Add score: PERFECT = 100, GOOD = 50, multiplied
      const basePoints = result === 'PERFECT' ? 100 : 50;
      setScore((prevScore) => {
        const newScore = prevScore + basePoints * multiplier;

        // Check for new high score
        if (newScore > highScore && !isNewHighScore) {
          setIsNewHighScore(true);
          setHighScore(newScore);
          StorageService.updateHighScore(newScore);
        }

        return newScore;
      });

      // Track perfect hits
      if (result === 'PERFECT') {
        StorageService.incrementPerfects();
      }
    } else {
      setStreak(0);
      setMultiplier(1);
      // Reset BPM on miss
      setCurrentBPM(60);
      engine.setBPM(60);
    }

    // Haptic and audio feedback based on hit quality
    if (result === 'PERFECT') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      AudioService.playPerfect();
    } else if (result === 'GOOD') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      AudioService.playGood();
    } else {
      AudioService.playMiss();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            {isNewHighScore ? 'NEW HIGH!' : 'SCORE'}
          </Text>
          <Text style={[styles.statValue, isNewHighScore && styles.newHighScore]}>
            {score.toLocaleString()}
          </Text>
          {!isNewHighScore && highScore > 0 && (
            <Text style={styles.highScoreLabel}>Best: {highScore.toLocaleString()}</Text>
          )}
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>BPM</Text>
          <Text style={[styles.statValue, currentBPM > 60 && styles.bpmActive]}>
            {currentBPM}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>x{multiplier}</Text>
          <Text style={[styles.statValue, streak > 5 && styles.streakActive]}>
            {streak}
          </Text>
        </View>
      </View>

      <View style={styles.tapArea}>
        <BeatIndicator size={240} onBeat={beatOccurred} />
        <Pressable style={styles.tapZone} onPress={handleTap}>
          <Text style={styles.tapText}>TAP</Text>
        </Pressable>
      </View>

      <View style={styles.feedback}>
        {lastHit && (
          <Text style={[styles.result, styles[lastHit.toLowerCase() as 'perfect' | 'good' | 'miss']]}>
            {lastHit}
          </Text>
        )}
        <Text style={styles.beats}>Best Streak: {bestStreak}</Text>
      </View>
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
  multiplierActive: {
    color: COLORS.primary.light,
  },
  bpmActive: {
    color: COLORS.good,
  },
  newHighScore: {
    color: COLORS.perfect,
  },
  highScoreLabel: {
    fontSize: 10,
    color: COLORS.text.disabled,
    marginTop: 2,
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
  feedback: {
    alignItems: 'center',
    gap: 8,
  },
  beats: {
    fontSize: 14,
    color: COLORS.text.disabled,
  },
});

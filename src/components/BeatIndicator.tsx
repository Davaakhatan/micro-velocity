import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {COLORS} from '../constants/colors';

interface BeatIndicatorProps {
  size: number;
  onBeat: boolean;
}

export function BeatIndicator({size, onBeat}: BeatIndicatorProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (onBeat) {
      // Reset and pulse animation when beat occurs
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [onBeat, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{scale: scaleAnim}],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: COLORS.primary.light,
    backgroundColor: 'transparent',
  },
});

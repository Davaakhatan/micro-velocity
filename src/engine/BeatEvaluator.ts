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

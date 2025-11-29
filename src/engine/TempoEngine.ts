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

  getBPM(): number {
    return this.bpm;
  }

  getBeatCount(): number {
    return this.currentBeatIndex;
  }
}

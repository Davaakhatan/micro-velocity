import { Audio } from 'expo-av';

class AudioService {
  private isEnabled = true;
  private sounds: { [key: string]: Audio.Sound } = {};

  async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Pre-load sounds for low latency
      await this.loadSound('beat', require('../../assets/sounds/beat.wav'));
      await this.loadSound('perfect', require('../../assets/sounds/perfect.wav'));
      await this.loadSound('good', require('../../assets/sounds/good.wav'));
      await this.loadSound('miss', require('../../assets/sounds/miss.wav'));
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private async loadSound(key: string, source: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds[key] = sound;
    } catch (error) {
      console.error(`Failed to load sound ${key}:`, error);
    }
  }

  async playSound(key: string, volume: number = 1.0) {
    if (!this.isEnabled) return;

    try {
      const sound = this.sounds[key];
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.setVolumeAsync(volume);
        await sound.playAsync();
      }
    } catch (error) {
      console.error(`Failed to play sound ${key}:`, error);
    }
  }

  playBeat() {
    this.playSound('beat', 0.3);
  }

  playPerfect() {
    this.playSound('perfect', 0.6);
  }

  playGood() {
    this.playSound('good', 0.5);
  }

  playMiss() {
    this.playSound('miss', 0.4);
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  async cleanup() {
    for (const sound of Object.values(this.sounds)) {
      await sound.unloadAsync();
    }
    this.sounds = {};
  }
}

export default new AudioService();

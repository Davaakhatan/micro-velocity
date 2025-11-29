import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStats {
  highScore: number;
  bestStreak: number;
  totalGames: number;
  totalPerfects: number;
}

class StorageService {
  private readonly STATS_KEY = '@micro_velocity_stats';

  async getStats(): Promise<GameStats> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.STATS_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }

    // Return default stats
    return {
      highScore: 0,
      bestStreak: 0,
      totalGames: 0,
      totalPerfects: 0,
    };
  }

  async saveStats(stats: Partial<GameStats>): Promise<void> {
    try {
      const currentStats = await this.getStats();
      const updatedStats = { ...currentStats, ...stats };
      const jsonValue = JSON.stringify(updatedStats);
      await AsyncStorage.setItem(this.STATS_KEY, jsonValue);
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  async updateHighScore(score: number): Promise<boolean> {
    const stats = await this.getStats();
    if (score > stats.highScore) {
      await this.saveStats({ highScore: score });
      return true; // New high score!
    }
    return false;
  }

  async updateBestStreak(streak: number): Promise<void> {
    const stats = await this.getStats();
    if (streak > stats.bestStreak) {
      await this.saveStats({ bestStreak: streak });
    }
  }

  async incrementTotalGames(): Promise<void> {
    const stats = await this.getStats();
    await this.saveStats({ totalGames: stats.totalGames + 1 });
  }

  async incrementPerfects(count: number = 1): Promise<void> {
    const stats = await this.getStats();
    await this.saveStats({ totalPerfects: stats.totalPerfects + count });
  }

  async clearStats(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STATS_KEY);
    } catch (error) {
      console.error('Failed to clear stats:', error);
    }
  }
}

export default new StorageService();

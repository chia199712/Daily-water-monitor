/**
 * User settings service for managing user preferences
 */

export interface UserSettingsData {
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  reminderEnabled: boolean;
  reminderInterval: number;
  workingHours: {
    start: number;
    end: number;
  };
}

export class UserSettings {
  private readonly SETTINGS_KEY = 'user-settings';
  private settings: UserSettingsData;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): UserSettingsData {
    return {
      weight: 70,
      height: 170,
      activityLevel: 'moderate',
      reminderEnabled: true,
      reminderInterval: 60,
      workingHours: {
        start: 9,
        end: 18
      }
    };
  }

  /**
   * Save user settings
   */
  saveSettings(settingsData: UserSettingsData): void {
    this.settings = { ...settingsData };
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Get current user settings
   */
  getSettings(): UserSettingsData {
    return { ...this.settings };
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        this.settings = { ...this.getDefaultSettings(), ...parsedSettings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  /**
   * Reset settings to default values
   */
  resetToDefaults(): void {
    this.settings = this.getDefaultSettings();
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }

  /**
   * Validate weight input
   */
  validateWeight(weight: number): void {
    if (weight <= 0) {
      throw new Error('體重必須大於0');
    }
    if (weight > 250) {
      throw new Error('體重不能超過250kg');
    }
  }

  /**
   * Validate height input
   */
  validateHeight(height: number): void {
    if (height <= 0) {
      throw new Error('身高必須大於0');
    }
    if (height < 100 || height > 250) {
      throw new Error('身高必須在100-250cm之間');
    }
  }

  /**
   * Calculate recommended water intake based on height and weight
   * Formula: (height(cm) + weight(kg)) × 10CC
   */
  calculateRecommendedWaterIntake(height: number, weight: number): number {
    return (height + weight) * 10;
  }

  /**
   * Calculate recommended water intake based on weight and activity level (legacy method)
   */
  calculateRecommendedWaterIntakeByActivity(
    weight: number, 
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  ): number {
    // Water intake multipliers based on activity level (ml per kg)
    const multipliers = {
      sedentary: 30,
      light: 35,
      moderate: 40,
      active: 45,
      very_active: 50
    };
    
    return weight * multipliers[activityLevel];
  }
}
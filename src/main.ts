import { registerSW } from 'virtual:pwa-register';
import './styles.css';

// Import services
import { WaterRecord } from './services/waterRecord';
import { DataStorage } from './services/dataStorage';
import { UserSettings, UserSettingsData } from './services/userSettings';
import { GoalSetting } from './services/goalSetting';
import { DataStatistics } from './services/dataStatistics';

// Import utilities
import { getRelativeTime } from './utils/date';
import { sanitizeWaterAmount, ValidationMessages } from './utils/validation';

// 註冊 PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('發現新版本，是否立即更新？')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('app 可以離線用了');
  },
});

// Page types
type PageType = 'home' | 'stats' | 'settings';

// app 主程式
class App {
  private container: HTMLElement;
  private currentPage: PageType = 'home';
  
  // Services
  private waterRecord!: WaterRecord;
  private dataStorage!: DataStorage;
  private userSettings!: UserSettings;
  private goalSetting!: GoalSetting;
  private dataStatistics!: DataStatistics;

  constructor() {
    this.container = document.getElementById('app')!;
    this.initServices();
    this.init();
  }

  private initServices(): void {
    // Initialize services
    this.waterRecord = new WaterRecord();
    this.dataStorage = new DataStorage();
    this.userSettings = new UserSettings();
    this.goalSetting = new GoalSetting();
    this.dataStatistics = new DataStatistics(this.waterRecord, this.goalSetting);
    
    // Load existing data
    this.loadStoredData();
  }

  private loadStoredData(): void {
    try {
      // Load water records
      const storedRecords = this.dataStorage.loadWaterRecords();
      storedRecords.forEach(record => {
        this.waterRecord.addRecord(record.amount, record.timestamp, record.note);
      });

      // Load user settings and apply goal
      const settings = this.userSettings.getSettings();
      const recommendedGoal = this.userSettings.calculateRecommendedWaterIntake(
        settings.height, 
        settings.weight
      );
      // Only set goal if no custom goal has been set
      if (this.goalSetting.getDailyGoal() === 2000) {
        this.goalSetting.setDailyGoal(recommendedGoal);
      }
      
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Failed to load stored data:', error);
    }
  }

  private saveData(): void {
    try {
      const records = this.waterRecord.getRecords();
      this.dataStorage.saveWaterRecords(records);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private async init(): Promise<void> {
    try {
      // 清除 loading
      this.clearLoadingScreen();
      
      // 畫 UI
      this.render();
      
      // 設定 event listeners
      this.setupEventListeners();
      
      // Update UI with current data
      this.updateUI();
      
      console.log('app 開好了');
    } catch (error) {
      console.error('app 開不起來:', error);
      this.showError('app 壞了，請重新整理');
    }
  }

  private clearLoadingScreen(): void {
    this.container.innerHTML = '';
  }

  private render(): void {
    switch (this.currentPage) {
      case 'home':
        this.renderHomePage();
        break;
      case 'stats':
        this.renderStatsPage();
        break;
      case 'settings':
        this.renderSettingsPage();
        break;
    }
  }

  private renderSettingsPage(): void {
    const settings = this.userSettings.getSettings();
    
    this.container.innerHTML = `
      <header class="app-header">
        <h1>設定</h1>
        <div class="status-indicator" id="networkStatus">
          <span class="status-dot online"></span>
          <span class="status-text">線上</span>
        </div>
      </header>
      
      <main class="app-main">
        <section class="settings-form">
          <div class="form-group">
            <label for="heightInput">身高 (公分)</label>
            <input type="number" id="heightInput" value="${settings.height}" min="100" max="250" step="1">
            <small>用於計算建議飲水量</small>
          </div>

          <div class="form-group">
            <label for="weightInput">體重 (公斤)</label>
            <input type="number" id="weightInput" value="${settings.weight}" min="20" max="300" step="0.1">
            <small>用於計算建議飲水量</small>
          </div>

          <div class="form-group">
            <label for="activityLevel">活動量</label>
            <select id="activityLevel">
              <option value="sedentary" ${settings.activityLevel === 'sedentary' ? 'selected' : ''}>久坐 (辦公室工作)</option>
              <option value="light" ${settings.activityLevel === 'light' ? 'selected' : ''}>輕度活動 (偶爾運動)</option>
              <option value="moderate" ${settings.activityLevel === 'moderate' ? 'selected' : ''}>中度活動 (規律運動)</option>
              <option value="active" ${settings.activityLevel === 'active' ? 'selected' : ''}>高度活動 (頻繁運動)</option>
              <option value="very_active" ${settings.activityLevel === 'very_active' ? 'selected' : ''}>非常活躍 (專業運動員)</option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="reminderEnabled" ${settings.reminderEnabled ? 'checked' : ''}>
              啟用飲水提醒
            </label>
          </div>

          <div class="form-group">
            <label for="reminderInterval">提醒間隔 (分鐘)</label>
            <input type="number" id="reminderInterval" value="${settings.reminderInterval}" min="15" max="480" step="15">
          </div>

          <div class="form-group">
            <label>工作時間設定</label>
            <div class="time-inputs">
              <input type="number" id="workStart" value="${settings.workingHours.start}" min="0" max="23" placeholder="開始時間">
              <span>-</span>
              <input type="number" id="workEnd" value="${settings.workingHours.end}" min="0" max="23" placeholder="結束時間">
            </div>
            <small>提醒只在工作時間內發送</small>
          </div>

          <div class="goal-setting-section">
            <h3>每日飲水目標設定</h3>
            
            <div class="current-goal">
              <label for="customGoal">自訂每日目標 (ml)</label>
              <input type="number" id="customGoal" value="${this.goalSetting.getDailyGoal()}" min="500" max="10000" step="50">
              <button class="apply-btn" id="applyCustomGoal">設定目標</button>
            </div>
            
            <div class="recommended-goal">
              <h4>建議飲水量 (身高+體重)×10</h4>
              <div class="goal-display" id="recommendedGoal">
                ${this.userSettings.calculateRecommendedWaterIntake(settings.height, settings.weight)}ml
              </div>
              <button class="apply-btn" id="applyRecommendedGoal">應用建議目標</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="save-btn" id="saveSettings">儲存設定</button>
            <button class="reset-btn" id="resetSettings">重設為預設值</button>
          </div>
        </section>
      </main>

      <nav class="app-nav">
        <button class="nav-btn" data-page="home">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">首頁</span>
        </button>
        <button class="nav-btn" data-page="stats">
          <span class="nav-icon">📊</span>
          <span class="nav-text">統計</span>
        </button>
        <button class="nav-btn active" data-page="settings">
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">設定</span>
        </button>
      </nav>
    `;
  }

  private setupEventListeners(): void {
    // 網路狀態
    window.addEventListener('online', () => this.updateNetworkStatus(true));
    window.addEventListener('offline', () => this.updateNetworkStatus(false));
    
    // Navigation
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Navigation buttons
      const navBtn = target.closest('.nav-btn') as HTMLButtonElement;
      if (navBtn) {
        const page = navBtn.dataset.page as PageType;
        this.navigateToPage(page);
        return;
      }

      // Settings page buttons
      if (target.closest('#saveSettings')) {
        this.saveSettings();
        return;
      }

      if (target.closest('#resetSettings')) {
        this.resetSettings();
        return;
      }

      if (target.closest('#applyRecommendedGoal')) {
        this.applyRecommendedGoal();
        return;
      }

      if (target.closest('#applyCustomGoal')) {
        this.applyCustomGoal();
        return;
      }
    });

    // Height and weight change listeners for settings page
    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === 'heightInput' || target.id === 'weightInput') {
        this.updateRecommendedGoal();
      }
    });
    
    // 設定網路狀態
    this.updateNetworkStatus(navigator.onLine);
  }

  private navigateToPage(page: PageType): void {
    this.currentPage = page;
    this.render();
    this.updateNetworkStatus(navigator.onLine);
    
    if (page === 'home') {
      this.updateUI();
    } else if (page === 'stats') {
      this.updateStatsUI();
    }
  }

  private saveSettings(): void {
    try {
      const heightInput = document.getElementById('heightInput') as HTMLInputElement;
      const weightInput = document.getElementById('weightInput') as HTMLInputElement;
      const activityLevelSelect = document.getElementById('activityLevel') as HTMLSelectElement;
      const reminderEnabledInput = document.getElementById('reminderEnabled') as HTMLInputElement;
      const reminderIntervalInput = document.getElementById('reminderInterval') as HTMLInputElement;
      const workStartInput = document.getElementById('workStart') as HTMLInputElement;
      const workEndInput = document.getElementById('workEnd') as HTMLInputElement;

      const settings: UserSettingsData = {
        height: parseFloat(heightInput.value),
        weight: parseFloat(weightInput.value),
        activityLevel: activityLevelSelect.value as any,
        reminderEnabled: reminderEnabledInput.checked,
        reminderInterval: parseInt(reminderIntervalInput.value),
        workingHours: {
          start: parseInt(workStartInput.value),
          end: parseInt(workEndInput.value)
        }
      };

      // Validate inputs
      this.userSettings.validateHeight(settings.height);
      this.userSettings.validateWeight(settings.weight);

      this.userSettings.saveSettings(settings);
      this.updateRecommendedGoal();
      this.showSuccessMessage('設定已儲存');
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showErrorMessage(`儲存失敗: ${error instanceof Error ? error.message : '請檢查輸入值'}`);
    }
  }

  private resetSettings(): void {
    if (confirm('確定要重設為預設值嗎？')) {
      try {
        this.userSettings.resetToDefaults();
        this.renderSettingsPage();
        this.showSuccessMessage('設定已重設為預設值');
      } catch (error) {
        console.error('Failed to reset settings:', error);
        this.showErrorMessage('重設失敗，請重試');
      }
    }
  }

  private updateRecommendedGoal(): void {
    const heightInput = document.getElementById('heightInput') as HTMLInputElement;
    const weightInput = document.getElementById('weightInput') as HTMLInputElement;
    const recommendedGoalEl = document.getElementById('recommendedGoal');

    if (heightInput && weightInput && recommendedGoalEl) {
      const height = parseFloat(heightInput.value);
      const weight = parseFloat(weightInput.value);
      
      if (height > 0 && weight > 0) {
        const recommendedGoal = this.userSettings.calculateRecommendedWaterIntake(height, weight);
        recommendedGoalEl.textContent = `${recommendedGoal}ml`;
      }
    }
  }

  private applyRecommendedGoal(): void {
    const settings = this.userSettings.getSettings();
    const recommendedGoal = this.userSettings.calculateRecommendedWaterIntake(
      settings.height, 
      settings.weight
    );
    
    this.goalSetting.setDailyGoal(recommendedGoal);
    
    // Update the custom goal input to reflect the change
    const customGoalInput = document.getElementById('customGoal') as HTMLInputElement;
    if (customGoalInput) {
      customGoalInput.value = recommendedGoal.toString();
    }
    
    this.showSuccessMessage(`每日目標已更新為 ${recommendedGoal}ml`);
  }

  private applyCustomGoal(): void {
    try {
      const customGoalInput = document.getElementById('customGoal') as HTMLInputElement;
      if (customGoalInput) {
        const customGoal = parseInt(customGoalInput.value);
        this.goalSetting.setDailyGoal(customGoal);
        this.showSuccessMessage(`每日目標已設定為 ${customGoal}ml`);
      }
    } catch (error) {
      console.error('Failed to set custom goal:', error);
      this.showErrorMessage(`設定失敗: ${error instanceof Error ? error.message : '請輸入有效數值'}`);
    }
  }

  // Placeholder methods (需要完整實作的其他方法)
  private renderHomePage(): void {
    this.container.innerHTML = `<div>首頁 - 待完整實作</div>`;
  }

  private renderStatsPage(): void {
    this.container.innerHTML = `<div>統計 - 待完整實作</div>`;
  }

  private updateUI(): void {
    // 待實作
  }

  private updateStatsUI(): void {
    // 待實作
  }

  private updateNetworkStatus(isOnline: boolean): void {
    const statusIndicator = document.getElementById('networkStatus');
    if (statusIndicator) {
      const dot = statusIndicator.querySelector('.status-dot') as HTMLElement;
      const text = statusIndicator.querySelector('.status-text') as HTMLElement;
      
      if (isOnline) {
        dot.className = 'status-dot online';
        text.textContent = '線上';
      } else {
        dot.className = 'status-dot offline';
        text.textContent = '離線';
      }
    }
  }

  private showSuccessMessage(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  private showError(message: string): void {
    this.container.innerHTML = `
      <div class="error-screen">
        <div class="error-icon">⚠️</div>
        <h2>發生錯誤</h2>
        <p>${message}</p>
        <button onclick="location.reload()" class="retry-btn">重新載入</button>
      </div>
    `;
  }
}

// 開始
new App();
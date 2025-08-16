import { registerSW } from 'virtual:pwa-register';
import './styles.css';

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

// app 主程式
class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('app')!;
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // 清除 loading
      this.clearLoadingScreen();
      
      // 畫 UI
      this.render();
      
      // 設定 event listeners
      this.setupEventListeners();
      
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
    this.container.innerHTML = `
      <header class="app-header">
        <h1>每日飲水量監控</h1>
        <div class="status-indicator" id="networkStatus">
          <span class="status-dot online"></span>
          <span class="status-text">線上</span>
        </div>
      </header>
      
      <main class="app-main">
        <section class="water-tracker">
          <div class="today-progress">
            <div class="progress-circle">
              <svg class="progress-ring" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" stroke-width="8"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3498db" stroke-width="8" 
                        stroke-dasharray="314" stroke-dashoffset="314" class="progress-bar"/>
              </svg>
              <div class="progress-text">
                <span class="progress-percentage">0%</span>
                <span class="progress-label">完成度</span>
              </div>
            </div>
            <div class="today-stats">
              <div class="stat-item">
                <span class="stat-value" id="todayTotal">0ml</span>
                <span class="stat-label">今日飲水</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="dailyGoal">2000ml</span>
                <span class="stat-label">每日目標</span>
              </div>
            </div>
          </div>
        </section>

        <section class="quick-actions">
          <h2>快速記錄</h2>
          <div class="action-buttons">
            <button class="action-btn" data-amount="250">
              <span class="btn-icon">🥃</span>
              <span class="btn-text">250ml</span>
            </button>
            <button class="action-btn" data-amount="500">
              <span class="btn-icon">🥤</span>
              <span class="btn-text">500ml</span>
            </button>
            <button class="action-btn" data-amount="750">
              <span class="btn-icon">🍶</span>
              <span class="btn-text">750ml</span>
            </button>
            <button class="action-btn custom-btn" id="customAmount">
              <span class="btn-icon">⚖️</span>
              <span class="btn-text">自訂</span>
            </button>
          </div>
        </section>

        <section class="recent-records">
          <h2>最近記錄</h2>
          <div class="records-list" id="recordsList">
            <div class="empty-state">
              <span class="empty-icon">💧</span>
              <p>還沒有飲水記錄，開始記錄吧！</p>
            </div>
          </div>
        </section>
      </main>

      <nav class="app-nav">
        <button class="nav-btn active" data-page="home">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">首頁</span>
        </button>
        <button class="nav-btn" data-page="stats">
          <span class="nav-icon">📊</span>
          <span class="nav-text">統計</span>
        </button>
        <button class="nav-btn" data-page="settings">
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
    
    // 設定網路狀態
    this.updateNetworkStatus(navigator.onLine);
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
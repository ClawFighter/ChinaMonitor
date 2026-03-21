// China Monitor — Theme Manager

export class ThemeManager {
  private themeToggle: HTMLElement | null = null;
  private currentTheme: 'light' | 'dark' = 'dark';

  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
  }

  init(): void {
    if (!this.themeToggle) {
      console.error('Theme toggle button not found');
      return;
    }

    this.loadTheme();
    this.setupThemeToggle();
    
    // Auto-switch theme based on local time (7:00-19:00 light, else dark)
    this.autoSwitchThemeByTime();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }
    this.applyTheme();
  }

  private autoSwitchThemeByTime(): void {
    const hour = new Date().getHours();
    // 7:00-19:00 use light theme, else dark theme
    const timeBasedTheme = (hour >= 7 && hour < 19) ? 'light' : 'dark';
    
    // Only auto-switch if user hasn't manually set a theme
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      this.currentTheme = timeBasedTheme;
      this.applyTheme();
    }
    
    // Check every minute to auto-switch at 7:00 and 19:00
    setInterval(() => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const hour = new Date().getHours();
        const timeBasedTheme = (hour >= 7 && hour < 19) ? 'light' : 'dark';
        if (this.currentTheme !== timeBasedTheme) {
          this.currentTheme = timeBasedTheme;
          this.applyTheme();
        }
      }
    }, 60 * 1000); // Check every minute
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    this.updateIcon();
  }

  private updateIcon(): void {
    if (!this.themeToggle) return;
    const icon = this.themeToggle.querySelector('i');
    if (icon) {
      icon.className = this.currentTheme === 'dark' 
        ? 'fa-solid fa-sun' 
        : 'fa-solid fa-moon';
    }
  }

  private setupThemeToggle(): void {
    if (!this.themeToggle) return;
    
    this.themeToggle.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
    });
  }
}

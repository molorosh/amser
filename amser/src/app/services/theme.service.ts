import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'amser-dark-mode';
  
  darkMode = signal(this.loadDarkMode());

  private loadDarkMode(): boolean {
    const stored = localStorage.getItem(this.DARK_MODE_KEY);
    const isDark = stored === 'true';
    this.applyTheme(isDark);
    return isDark;
  }

  toggleDarkMode(enabled: boolean) {
    this.darkMode.set(enabled);
    localStorage.setItem(this.DARK_MODE_KEY, String(enabled));
    this.applyTheme(enabled);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}

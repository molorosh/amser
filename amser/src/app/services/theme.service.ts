import { Injectable, inject, signal } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { createSetting } from '../models/setting';

const DARK_MODE_SETTING = 'DarkModeEnabled';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private persistence = inject(PersistenceService);
  
  darkMode = signal(false);

  constructor() {
    this.initializeDarkMode();
  }

  private async initializeDarkMode() {
    await this.persistence.whenReady();
    const setting = await this.persistence.getSetting(DARK_MODE_SETTING);
    const isDark = setting?.settingValue === 'true';
    this.darkMode.set(isDark);
    this.applyTheme(isDark);
  }

  async toggleDarkMode(enabled: boolean) {
    this.darkMode.set(enabled);
    await this.persistence.saveSetting(
      createSetting(DARK_MODE_SETTING, String(enabled))
    );
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

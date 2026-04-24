import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ThemeService } from '../../services/theme.service';
import { PersistenceService } from '../../services/persistence.service';
import { createSetting } from '../../models/setting';

export const WORKDAYS_SETTING = 'workdays';

interface DayOption {
  label: string;
  value: number;
  checked: boolean;
}

@Component({
  selector: 'app-genz-settings-page',
  imports: [FormsModule, ToggleSwitch, Checkbox],
  templateUrl: './genz-settings-page.html',
  styleUrl: './genz-settings-page.scss',
})
export class GenzSettingsPage implements OnInit {
  private themeService = inject(ThemeService);
  private persistence = inject(PersistenceService);

  darkMode = computed(() => this.themeService.darkMode());

  days = signal<DayOption[]>([
    { label: 'Mon', value: 1, checked: false },
    { label: 'Tue', value: 2, checked: false },
    { label: 'Wed', value: 3, checked: false },
    { label: 'Thu', value: 4, checked: false },
    { label: 'Fri', value: 5, checked: false },
    { label: 'Sat', value: 6, checked: false },
    { label: 'Sun', value: 0, checked: false },
  ]);

  async ngOnInit() {
    await this.persistence.whenReady();
    const setting = await this.persistence.getSetting(WORKDAYS_SETTING);
    if (setting?.settingValue) {
      const savedDays: number[] = JSON.parse(setting.settingValue);
      this.days.update(days =>
        days.map(d => ({ ...d, checked: savedDays.includes(d.value) }))
      );
    }
  }

  onDarkModeChange(value: boolean) {
    this.themeService.toggleDarkMode(value);
  }

  async onWorkdayChange(dayValue: number, checked: boolean) {
    this.days.update(days =>
      days.map(d => d.value === dayValue ? { ...d, checked } : d)
    );
    const selectedDays = this.days()
      .filter(d => d.checked)
      .map(d => d.value);
    await this.persistence.saveSetting(
      createSetting(WORKDAYS_SETTING, JSON.stringify(selectedDays))
    );
  }
}

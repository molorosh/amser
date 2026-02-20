import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-genz-settings-page',
  imports: [FormsModule, ToggleSwitch],
  templateUrl: './genz-settings-page.html',
  styleUrl: './genz-settings-page.scss',
})
export class GenzSettingsPage {
  private themeService = inject(ThemeService);

  darkMode = computed(() => this.themeService.darkMode());

  onDarkModeChange(value: boolean) {
    this.themeService.toggleDarkMode(value);
  }
}

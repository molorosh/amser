import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-settings-popup',
  imports: [FormsModule, InputText, Checkbox, Button, Select, Divider],
  templateUrl: './settings-popup.html',
  styleUrl: './settings-popup.scss',
})
export class SettingsPopup {
  appName = signal('My Application');
  enableNotifications = signal(true);
  enableDarkMode = signal(false);
  selectedLanguage = signal('en');

  languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
  ];

  saveSettings(): void {
    console.log('Settings saved:', {
      appName: this.appName(),
      enableNotifications: this.enableNotifications(),
      enableDarkMode: this.enableDarkMode(),
      selectedLanguage: this.selectedLanguage(),
    });
  }
}

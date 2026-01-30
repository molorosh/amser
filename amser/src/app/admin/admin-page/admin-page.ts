import { Component, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { SettingsPopup } from '../settings/settings-popup/settings-popup';

@Component({
  selector: 'app-admin-page',
  imports: [Dialog, SettingsPopup],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  settingsVisible = signal(false);

  openSettingsDialog(): void {
    this.settingsVisible.set(true);
  }
}

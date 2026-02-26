import { Component, inject } from '@angular/core';
import { PersistenceService } from '../../services/persistence.service';

interface ExportData {
  version: number;
  exportedAt: string;
  tasks: unknown[];
  sprints: unknown[];
  actions: unknown[];
  settings: unknown[];
}

@Component({
  selector: 'app-data-page',
  imports: [],
  templateUrl: './data-page.html',
  styleUrl: './data-page.scss',
})
export class DataPage {
  private persistenceService = inject(PersistenceService);

  async exportData(): Promise<void> {
    await this.persistenceService.whenReady();

    const [tasks, sprints, actions, settings] = await Promise.all([
      this.persistenceService.getAllTasks(),
      this.persistenceService.getAllSprints(),
      this.persistenceService.getAllActions(),
      this.persistenceService.getAllSettings(),
    ]);

    const exportData: ExportData = {
      version: 4,
      exportedAt: new Date().toISOString(),
      tasks,
      sprints,
      actions,
      settings,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `amser-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

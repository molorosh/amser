import { Component, inject, signal } from '@angular/core';
import { PersistenceService } from '../../services/persistence.service';
import { Task } from '../../models/task';
import { Sprint } from '../../models/sprint';
import { Action } from '../../models/action';
import { Setting } from '../../models/setting';

interface ExportData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  sprints: Sprint[];
  actions: Action[];
  settings: Setting[];
}

interface ImportSummary {
  tasksAdded: number;
  tasksUpdated: number;
  sprintsAdded: number;
  sprintsUpdated: number;
  actionsAdded: number;
  actionsUpdated: number;
  settingsAdded: number;
  settingsUpdated: number;
}

@Component({
  selector: 'app-data-page',
  imports: [],
  templateUrl: './data-page.html',
  styleUrl: './data-page.scss',
})
export class DataPage {
  private persistenceService = inject(PersistenceService);

  importSummary = signal<ImportSummary | null>(null);
  importError = signal<string | null>(null);

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

  triggerFileInput(): void {
    const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
    fileInput?.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      return;
    }

    this.importSummary.set(null);
    this.importError.set(null);

    try {
      const content = await this.readFile(file);
      const data = JSON.parse(content) as ExportData;

      if (!this.isValidExportData(data)) {
        this.importError.set('Invalid export file format. Please select a valid Amser export file.');
        input.value = '';
        return;
      }

      const confirmed = confirm(
        `Are you sure you want to import this data?\n\n` +
        `This will add or update:\n` +
        `- ${data.tasks?.length || 0} tasks\n` +
        `- ${data.sprints?.length || 0} sprints\n` +
        `- ${data.actions?.length || 0} actions\n` +
        `- ${data.settings?.length || 0} settings\n\n` +
        `Existing entities with matching IDs will be updated.`
      );

      if (confirmed) {
        await this.importData(data);
      }
    } catch (error) {
      this.importError.set('Failed to read or parse the file. Please ensure it is a valid JSON file.');
    }

    input.value = '';
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private isValidExportData(data: unknown): data is ExportData {
    if (!data || typeof data !== 'object') {
      return false;
    }
    const d = data as Record<string, unknown>;
    return (
      typeof d['version'] === 'number' &&
      Array.isArray(d['tasks']) &&
      Array.isArray(d['sprints']) &&
      Array.isArray(d['actions']) &&
      Array.isArray(d['settings'])
    );
  }

  private async importData(data: ExportData): Promise<void> {
    await this.persistenceService.whenReady();

    const summary: ImportSummary = {
      tasksAdded: 0,
      tasksUpdated: 0,
      sprintsAdded: 0,
      sprintsUpdated: 0,
      actionsAdded: 0,
      actionsUpdated: 0,
      settingsAdded: 0,
      settingsUpdated: 0,
    };

    // Import tasks
    for (const task of data.tasks) {
      const existing = await this.persistenceService.getTask(task.id);
      await this.persistenceService.saveTask(task);
      if (existing) {
        summary.tasksUpdated++;
      } else {
        summary.tasksAdded++;
      }
    }

    // Import sprints
    for (const sprint of data.sprints) {
      const existing = await this.persistenceService.getSprint(sprint.id);
      await this.persistenceService.saveSprint(sprint);
      if (existing) {
        summary.sprintsUpdated++;
      } else {
        summary.sprintsAdded++;
      }
    }

    // Import actions
    for (const action of data.actions) {
      const existing = await this.persistenceService.getAction(action.id);
      await this.persistenceService.saveAction(action);
      if (existing) {
        summary.actionsUpdated++;
      } else {
        summary.actionsAdded++;
      }
    }

    // Import settings
    for (const setting of data.settings) {
      const existing = await this.persistenceService.getSetting(setting.settingName);
      await this.persistenceService.saveSetting(setting);
      if (existing) {
        summary.settingsUpdated++;
      } else {
        summary.settingsAdded++;
      }
    }

    this.importSummary.set(summary);
  }
}

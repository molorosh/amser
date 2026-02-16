import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Sprint, createSprint, calculateMaxHours } from '../../models/sprint';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'app-sprints-page',
  imports: [FormsModule, TableModule, Button, Dialog, InputText, InputNumber, DatePicker, Checkbox, RadioButton, ConfirmDialog, DatePipe],
  providers: [ConfirmationService],
  templateUrl: './sprints-page.html',
  styleUrl: './sprints-page.scss',
})
export class SprintsPage implements OnInit {
  private persistence = inject(PersistenceService);
  private confirmationService = inject(ConfirmationService);

  sprints = signal<Sprint[]>([]);
  dialogVisible = signal(false);
  isEditing = signal(false);

  // Filter
  selectedFilter = signal<string>('all');
  filterOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Past', value: 'past' },
    { label: 'Current', value: 'current' },
    { label: 'Future', value: 'future' },
  ];
  filteredSprints = computed(() => {
    const filter = this.selectedFilter();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'past':
        return this.sprints().filter(sprint => {
          const startDate = new Date(sprint.startDate);
          startDate.setHours(0, 0, 0, 0);
          return !sprint.isCurrent && startDate < today;
        });
      case 'current':
        return this.sprints().filter(sprint => sprint.isCurrent);
      case 'future':
        return this.sprints().filter(sprint => {
          const startDate = new Date(sprint.startDate);
          startDate.setHours(0, 0, 0, 0);
          return !sprint.isCurrent && startDate > today;
        });
      default:
        return this.sprints();
    }
  });

  // Form fields
  currentSprint = signal<Sprint | null>(null);
  sprintName = signal('');
  sprintStartDate = signal<Date | null>(null);
  sprintEndDate = signal<Date | null>(null);
  sprintIsCurrent = signal(false);
  sprintHoursPerDay = signal(6);
  sprintDaysPerSprint = signal(8);

  getMaxHours(sprint: Sprint): number {
    return calculateMaxHours(sprint);
  }

  async ngOnInit() {
    await this.persistence.whenReady();
    await this.loadSprints();
  }

  async loadSprints() {
    const sprints = await this.persistence.getAllSprints();
    this.sprints.set(sprints);
  }

  openNewSprintDialog() {
    this.isEditing.set(false);
    this.currentSprint.set(null);
    this.sprintName.set('');
    this.sprintStartDate.set(null);
    this.sprintEndDate.set(null);
    this.sprintIsCurrent.set(false);
    this.sprintHoursPerDay.set(6);
    this.sprintDaysPerSprint.set(8);
    this.dialogVisible.set(true);
  }

  openEditSprintDialog(sprint: Sprint) {
    this.isEditing.set(true);
    this.currentSprint.set(sprint);
    this.sprintName.set(sprint.name);
    this.sprintStartDate.set(new Date(sprint.startDate));
    this.sprintEndDate.set(new Date(sprint.endDate));
    this.sprintIsCurrent.set(sprint.isCurrent);
    this.sprintHoursPerDay.set(sprint.hoursPerDay ?? 6);
    this.sprintDaysPerSprint.set(sprint.daysPerSprint ?? 8);
    this.dialogVisible.set(true);
  }

  isFormValid(): boolean {
    return !!(
      this.sprintName().trim() &&
      this.sprintStartDate() &&
      this.sprintEndDate() &&
      this.sprintHoursPerDay() > 0 &&
      this.sprintDaysPerSprint() > 0
    );
  }

  async saveSprint() {
    if (!this.isFormValid()) {
      return;
    }

    if (this.isEditing() && this.currentSprint()) {
      const updatedSprint: Sprint = {
        ...this.currentSprint()!,
        name: this.sprintName(),
        startDate: this.sprintStartDate()!,
        endDate: this.sprintEndDate()!,
        isCurrent: this.sprintIsCurrent(),
        hoursPerDay: this.sprintHoursPerDay(),
        daysPerSprint: this.sprintDaysPerSprint(),
      };
      await this.persistence.updateSprint(updatedSprint);
    } else {
      const newSprint = createSprint(
        this.sprintName(),
        this.sprintStartDate()!,
        this.sprintEndDate()!,
        this.sprintIsCurrent(),
        this.sprintHoursPerDay(),
        this.sprintDaysPerSprint()
      );
      await this.persistence.saveSprint(newSprint);
    }

    this.dialogVisible.set(false);
    await this.loadSprints();
  }

  confirmDelete(sprint: Sprint) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${sprint.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.persistence.deleteSprint(sprint.id);
        await this.loadSprints();
      },
    });
  }

  cancelDialog() {
    this.dialogVisible.set(false);
  }
}

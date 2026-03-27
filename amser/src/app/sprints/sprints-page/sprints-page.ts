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
import { isDateInValidRange } from '../../shared/date-constraints';
import { Task } from '../../models/task';
import { Action, createAction } from '../../models/action';
import { ActionType } from '../../models/action-type';
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
    
    let result: Sprint[];
    switch (filter) {
      case 'past':
        result = this.sprints().filter(sprint => {
          const startDate = new Date(sprint.startDate);
          startDate.setHours(0, 0, 0, 0);
          return !sprint.isCurrent && startDate < today;
        });
        break;
      case 'current':
        result = this.sprints().filter(sprint => sprint.isCurrent);
        break;
      case 'future':
        result = this.sprints().filter(sprint => {
          const startDate = new Date(sprint.startDate);
          startDate.setHours(0, 0, 0, 0);
          return !sprint.isCurrent && startDate > today;
        });
        break;
      default:
        result = this.sprints();
    }
    
    return result.slice().sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
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

  isDateValid(date: Date | null): boolean {
    return date ? isDateInValidRange(date) : true;
  }

  getMaxDaysInRange(): number {
    const startDate = this.sprintStartDate();
    const endDate = this.sprintEndDate();
    if (!startDate || !endDate) return 1;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }

  areDatesAtLeastOneDayApart(): boolean {
    const startDate = this.sprintStartDate();
    const endDate = this.sprintEndDate();
    if (!startDate || !endDate) return true;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 1;
  }

  isHoursPerDayValid(): boolean {
    const hours = this.sprintHoursPerDay();
    return hours >= 1 && hours <= 15;
  }

  isDaysPerSprintValid(): boolean {
    const days = this.sprintDaysPerSprint();
    return days >= 1 && days <= this.getMaxDaysInRange();
  }

  isFormValid(): boolean {
    const startDate = this.sprintStartDate();
    const endDate = this.sprintEndDate();
    return !!(
      this.sprintName().trim() &&
      startDate &&
      endDate &&
      isDateInValidRange(startDate) &&
      isDateInValidRange(endDate) &&
      this.areDatesAtLeastOneDayApart() &&
      this.isHoursPerDayValid() &&
      this.isDaysPerSprintValid()
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

      // Create allocation actions for all auto-allocate tasks
      const allTasks = await this.persistence.getAllTasks();
      const autoAllocateTasks = allTasks.filter(task => task.autoAllocate);
      for (const task of autoAllocateTasks) {
        const allocationAction = createAction(
          ActionType.Allocation,
          task.id,
          newSprint.id,
          newSprint.startDate
        );
        await this.persistence.saveAction(allocationAction);
      }
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

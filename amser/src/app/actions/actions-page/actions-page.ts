import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { RadioButton } from 'primeng/radiobutton';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Action, createAction, calculateTotalHours } from '../../models/action';
import { isDateInValidRange } from '../../shared/date-constraints';
import { ActionType } from '../../models/action-type';
import { Task } from '../../models/task';
import { TaskType } from '../../models/task-type';
import { Sprint } from '../../models/sprint';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'app-actions-page',
  imports: [FormsModule, TableModule, Button, Dialog, Select, DatePicker, RadioButton, ConfirmDialog, DatePipe],
  providers: [ConfirmationService],
  templateUrl: './actions-page.html',
  styleUrl: './actions-page.scss',
})
export class ActionsPage implements OnInit {
  private persistence = inject(PersistenceService);
  private confirmationService = inject(ConfirmationService);

  readonly ActionType = ActionType;

  actions = signal<Action[]>([]);
  tasks = signal<Task[]>([]);
  sprints = signal<Sprint[]>([]);
  dialogVisible = signal(false);
  isEditing = signal(false);

  // Filter - Sprint
  selectedSprintFilter = signal<string>('');

  // Filter - Task Type
  selectedTaskTypeFilter = signal<string>('all');
  taskTypeFilterOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Work Item', value: TaskType.WorkItem },
    { label: 'Meeting', value: TaskType.Meeting },
    { label: 'People', value: TaskType.People },
    { label: 'Other', value: TaskType.Other },
  ];

  sprintFilterOptions = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const options: { label: string; value: string }[] = [
      { label: '\u00A0', value: '' },
    ];
    
    // Filter sprints that are current or in the past
    const eligibleSprints = this.sprints().filter(sprint => {
      if (sprint.isCurrent) return true;
      const startDate = new Date(sprint.startDate);
      startDate.setHours(0, 0, 0, 0);
      return startDate < today;
    });
    
    // Separate current and past sprints
    const currentSprints = eligibleSprints.filter(s => s.isCurrent);
    const pastSprints = eligibleSprints.filter(s => !s.isCurrent);
    
    // Sort both by start date descending (most recent first)
    const sortByStartDateDesc = (a: Sprint, b: Sprint) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    
    currentSprints.sort(sortByStartDateDesc);
    pastSprints.sort(sortByStartDateDesc);
    
    // Add current sprints first, then past sprints
    for (const sprint of currentSprints) {
      options.push({ label: sprint.name, value: sprint.id });
    }
    for (const sprint of pastSprints) {
      options.push({ label: sprint.name, value: sprint.id });
    }
    return options;
  });

  filteredActions = computed(() => {
    const sprintFilter = this.selectedSprintFilter();
    const taskTypeFilter = this.selectedTaskTypeFilter();
    let actions = this.actions();
    if (sprintFilter) {
      actions = actions.filter(action => action.sprintId === sprintFilter);
    }
    if (taskTypeFilter !== 'all') {
      const taskMap = this.taskMap();
      actions = actions.filter(action => {
        const task = taskMap.get(action.taskId);
        return task && task.taskType === taskTypeFilter;
      });
    }
    // Sort by startDateTime descending (newest at top, earliest at bottom)
    return [...actions].sort((a, b) => 
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
    );
  });

  // Form fields
  currentAction = signal<Action | null>(null);
  actionType = signal<ActionType>(ActionType.Allocation);
  actionStartDateTime = signal<Date>(new Date());
  actionEndDateTime = signal<Date | null>(null);
  actionTaskId = signal<string>('');
  actionSprintId = signal<string>('');

  actionTypeOptions = [
    { label: 'Allocation', value: ActionType.Allocation },
    { label: 'Time', value: ActionType.Time },
    { label: 'Note', value: ActionType.Note },
  ];

  // Create lookup maps for displaying task/sprint names
  taskMap = computed(() => {
    const map = new Map<string, Task>();
    this.tasks().forEach(task => map.set(task.id, task));
    return map;
  });

  sprintMap = computed(() => {
    const map = new Map<string, Sprint>();
    this.sprints().forEach(sprint => map.set(sprint.id, sprint));
    return map;
  });

  async ngOnInit() {
    await this.persistence.whenReady();
    await this.loadData();
  }

  async loadData() {
    const [actions, tasks, sprints] = await Promise.all([
      this.persistence.getAllActions(),
      this.persistence.getAllTasks(),
      this.persistence.getAllSprints(),
    ]);
    this.actions.set(actions);
    this.tasks.set(tasks);
    this.sprints.set(sprints);
  }

  getTaskName(taskId: string): string {
    return this.taskMap().get(taskId)?.name ?? 'Unknown Task';
  }

  getSprintName(sprintId: string): string {
    return this.sprintMap().get(sprintId)?.name ?? 'Unknown Sprint';
  }

  openNewActionDialog() {
    this.isEditing.set(false);
    this.currentAction.set(null);
    this.actionType.set(ActionType.Allocation);
    this.actionStartDateTime.set(new Date());
    this.actionEndDateTime.set(null);
    this.actionTaskId.set('');
    this.actionSprintId.set('');
    this.dialogVisible.set(true);
  }

  openEditActionDialog(action: Action) {
    this.isEditing.set(true);
    this.currentAction.set(action);
    this.actionType.set(action.actionType);
    this.actionStartDateTime.set(new Date(action.startDateTime));
    this.actionEndDateTime.set(action.endDateTime ? new Date(action.endDateTime) : null);
    this.actionTaskId.set(action.taskId);
    this.actionSprintId.set(action.sprintId);
    this.dialogVisible.set(true);
  }

  isDateValid(date: Date | null): boolean {
    return date ? isDateInValidRange(date) : true;
  }

  isFormValid(): boolean {
    const startDateTime = this.actionStartDateTime();
    const endDateTime = this.actionEndDateTime();
    return !!(
      this.actionTaskId() &&
      this.actionSprintId() &&
      startDateTime &&
      isDateInValidRange(startDateTime) &&
      (!endDateTime || isDateInValidRange(endDateTime))
    );
  }

  async saveAction() {
    if (!this.isFormValid()) {
      return;
    }

    const endDateTime = this.actionEndDateTime();
    const startDateTime = this.actionStartDateTime();
    const totalHours = endDateTime ? calculateTotalHours(startDateTime, endDateTime) : undefined;

    if (this.isEditing() && this.currentAction()) {
      const updatedAction: Action = {
        ...this.currentAction()!,
        actionType: this.actionType(),
        startDateTime: startDateTime,
        endDateTime: endDateTime ?? undefined,
        totalHours,
        taskId: this.actionTaskId(),
        sprintId: this.actionSprintId(),
      };
      await this.persistence.updateAction(updatedAction);
    } else {
      const newAction = createAction(
        this.actionType(),
        this.actionTaskId(),
        this.actionSprintId(),
        startDateTime
      );
      if (endDateTime) {
        newAction.endDateTime = endDateTime;
        newAction.totalHours = totalHours;
      }
      await this.persistence.saveAction(newAction);
    }

    this.dialogVisible.set(false);
    await this.loadData();
  }

  confirmDelete(action: Action) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this action?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.persistence.deleteAction(action.id);
        await this.loadData();
      },
    });
  }

  cancelDialog() {
    this.dialogVisible.set(false);
  }
}

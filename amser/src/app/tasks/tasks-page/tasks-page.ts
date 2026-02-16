import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Task, createTask } from '../../models/task';
import { TaskType } from '../../models/task-type';
import { Sprint } from '../../models/sprint';
import { Action, createAction } from '../../models/action';
import { ActionType } from '../../models/action-type';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'app-tasks-page',
  imports: [FormsModule, TableModule, Button, Dialog, InputText, Textarea, Select, Checkbox, RadioButton, Tooltip, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage implements OnInit {
  private persistence = inject(PersistenceService);
  private confirmationService = inject(ConfirmationService);

  tasks = signal<Task[]>([]);
  currentSprints = signal<Sprint[]>([]);
  actions = signal<Action[]>([]);
  dialogVisible = signal(false);
  isEditing = signal(false);

  // Assign dialog
  assignDialogVisible = signal(false);
  taskToAssign = signal<Task | null>(null);

  // Filter - Task Type
  selectedFilter = signal<string>('all');
  filterOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Work Item', value: TaskType.WorkItem },
    { label: 'Meeting', value: TaskType.Meeting },
    { label: 'People', value: TaskType.People },
    { label: 'Other', value: TaskType.Other },
  ];

  // Filter - Auto Allocate
  selectedAutoAllocateFilter = signal<string>('all');
  autoAllocateFilterOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // Filter - Not in Current Sprint
  selectedSprintFilter = signal<string>('');
  sprintFilterOptions = computed(() => {
    const options: { label: string; value: string }[] = [
      { label: '\u00A0', value: '' },
    ];
    for (const sprint of this.currentSprints()) {
      options.push({ label: sprint.name, value: sprint.id });
    }
    return options;
  });

  // Task IDs that have actions in the selected sprint
  taskIdsInSelectedSprint = computed(() => {
    const sprintId = this.selectedSprintFilter();
    if (!sprintId) return new Set<string>();
    return new Set(
      this.actions()
        .filter(a => a.sprintId === sprintId)
        .map(a => a.taskId)
    );
  });

  filteredTasks = computed(() => {
    let tasks = this.tasks();
    
    // Filter by task type
    const typeFilter = this.selectedFilter();
    if (typeFilter !== 'all') {
      tasks = tasks.filter(task => task.taskType === typeFilter);
    }
    
    // Filter by auto allocate
    const autoAllocateFilter = this.selectedAutoAllocateFilter();
    if (autoAllocateFilter === 'yes') {
      tasks = tasks.filter(task => task.autoAllocate === true);
    } else if (autoAllocateFilter === 'no') {
      tasks = tasks.filter(task => !task.autoAllocate);
    }

    // Filter by not in current sprint
    const sprintFilter = this.selectedSprintFilter();
    if (sprintFilter) {
      const taskIdsInSprint = this.taskIdsInSelectedSprint();
      tasks = tasks.filter(task => !taskIdsInSprint.has(task.id));
    }
    
    return tasks;
  });

  // Form fields
  currentTask = signal<Task | null>(null);
  taskName = signal('');
  taskDescription = signal('');
  taskUrl = signal('');
  taskType = signal<TaskType>(TaskType.WorkItem);
  taskAutoAllocate = signal(false);

  taskTypeOptions = [
    { label: 'Work Item', value: TaskType.WorkItem },
    { label: 'Meeting', value: TaskType.Meeting },
    { label: 'People', value: TaskType.People },
    { label: 'Other', value: TaskType.Other },
  ];

  async ngOnInit() {
    await this.persistence.whenReady();
    await this.loadTasks();
    await this.loadCurrentSprints();
    await this.loadActions();
  }

  async loadTasks() {
    const tasks = await this.persistence.getAllTasks();
    this.tasks.set(tasks);
  }

  async loadCurrentSprints() {
    const sprints = await this.persistence.getAllSprints();
    this.currentSprints.set(sprints.filter(s => s.isCurrent));
  }

  async loadActions() {
    const actions = await this.persistence.getAllActions();
    this.actions.set(actions);
  }

  openNewTaskDialog() {
    this.isEditing.set(false);
    this.currentTask.set(null);
    this.taskName.set('');
    this.taskDescription.set('');
    this.taskUrl.set('');
    this.taskType.set(TaskType.WorkItem);
    this.taskAutoAllocate.set(false);
    this.dialogVisible.set(true);
  }

  openEditTaskDialog(task: Task) {
    this.isEditing.set(true);
    this.currentTask.set(task);
    this.taskName.set(task.name);
    this.taskDescription.set(task.description);
    this.taskUrl.set(task.url);
    this.taskType.set(task.taskType ?? TaskType.WorkItem);
    this.taskAutoAllocate.set(task.autoAllocate ?? false);
    this.dialogVisible.set(true);
  }

  async saveTask() {
    if (!this.taskName().trim()) {
      return;
    }

    if (this.isEditing() && this.currentTask()) {
      const updatedTask: Task = {
        ...this.currentTask()!,
        name: this.taskName(),
        description: this.taskDescription(),
        url: this.taskUrl(),
        taskType: this.taskType(),
        autoAllocate: this.taskAutoAllocate(),
      };
      await this.persistence.updateTask(updatedTask);
    } else {
      const newTask = createTask(
        this.taskName(),
        this.taskDescription(),
        this.taskUrl(),
        this.taskType(),
        this.taskAutoAllocate()
      );
      await this.persistence.saveTask(newTask);
    }

    this.dialogVisible.set(false);
    await this.loadTasks();
  }

  confirmDelete(task: Task) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${task.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.persistence.deleteTask(task.id);
        await this.loadTasks();
      },
    });
  }

  cancelDialog() {
    this.dialogVisible.set(false);
  }

  // Assign dialog methods
  openAssignDialog(task: Task) {
    this.taskToAssign.set(task);
    this.assignDialogVisible.set(true);
  }

  closeAssignDialog() {
    this.assignDialogVisible.set(false);
    this.taskToAssign.set(null);
  }

  async assignToSprint() {
    const task = this.taskToAssign();
    const sprintId = this.selectedSprintFilter();
    if (!task || !sprintId) return;

    const allocationAction = createAction(ActionType.Allocation, task.id, sprintId);
    await this.persistence.saveAction(allocationAction);
    
    this.closeAssignDialog();
    await this.loadActions();
  }

  async assignAndStart() {
    const task = this.taskToAssign();
    const sprintId = this.selectedSprintFilter();
    if (!task || !sprintId) return;

    // Create allocation action
    const allocationAction = createAction(ActionType.Allocation, task.id, sprintId);
    await this.persistence.saveAction(allocationAction);

    // Create time action with current datetime as start
    const timeAction = createAction(ActionType.Time, task.id, sprintId, new Date());
    await this.persistence.saveAction(timeAction);
    
    this.closeAssignDialog();
    await this.loadActions();
  }
}

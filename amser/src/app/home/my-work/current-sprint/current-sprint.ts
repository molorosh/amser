import { Component, input, computed, output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Sprint } from '../../../models/sprint';
import { Task } from '../../../models/task';
import { Action } from '../../../models/action';
import { ActionType } from '../../../models/action-type';
import { TaskType } from '../../../models/task-type';
import { SprintTask, createSprintTasks } from '../../../models/sprint-task';
import { TimeDisplayMode } from '../my-work';

@Component({
  selector: 'app-current-sprint',
  imports: [DatePipe, Button, TabsModule, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './current-sprint.html',
  styleUrl: './current-sprint.scss',
})
export class CurrentSprint {
  private confirmationService = inject(ConfirmationService);

  sprint = input.required<Sprint>();
  tasks = input.required<Task[]>();
  actions = input.required<Action[]>();
  displayMode = input<TimeDisplayMode>('hours');

  timerStarted = output<{ taskId: string; sprintId: string }>();
  timerStopped = output<{ taskId: string; sprintId: string; actionId: string }>();
  allocationRemoved = output<{ actionId: string }>();

  sprintTasks = computed<SprintTask[]>(() => 
    createSprintTasks(this.sprint().id, this.tasks(), this.actions())
  );

  // Group sprint tasks by TaskType with WorkItem first
  workItemTasks = computed(() => 
    this.sprintTasks().filter(st => st.task.taskType === TaskType.WorkItem)
  );

  meetingTasks = computed(() => 
    this.sprintTasks().filter(st => st.task.taskType === TaskType.Meeting)
  );

  peopleTasks = computed(() => 
    this.sprintTasks().filter(st => st.task.taskType === TaskType.People)
  );

  otherTasks = computed(() => 
    this.sprintTasks().filter(st => st.task.taskType === TaskType.Other)
  );

  // Days summary - group Time actions by day
  daysSummary = computed(() => {
    const sprintId = this.sprint().id;
    const timeActions = this.actions().filter(
      a => a.sprintId === sprintId && 
           a.actionType === ActionType.Time && 
           a.endDateTime && 
           a.totalHours !== undefined
    );

    // Group by day
    const dayMap = new Map<string, { date: Date; totalHours: number }>();
    
    for (const action of timeActions) {
      const actionDate = new Date(action.startDateTime);
      const dayKey = actionDate.toDateString();
      
      if (dayMap.has(dayKey)) {
        dayMap.get(dayKey)!.totalHours += action.totalHours ?? 0;
      } else {
        dayMap.set(dayKey, {
          date: actionDate,
          totalHours: action.totalHours ?? 0,
        });
      }
    }

    // Convert to array and sort by date
    return Array.from(dayMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  });

  formatHoursMinutes(totalHours: number): string {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  formatTime(totalHours: number): string {
    if (this.displayMode() === 'days') {
      const hoursPerDay = this.sprint().hoursPerDay ?? 6;
      const days = totalHours / hoursPerDay;
      return `${days.toFixed(2)}d`;
    }
    return `${totalHours.toFixed(1)}h`;
  }

  hasDescription(task: Task): boolean {
    return !!task.description && task.description.trim().length > 0;
  }

  hasInProgressTimer(sprintTask: SprintTask): boolean {
    return sprintTask.actions.some(
      action => action.actionType === ActionType.Time && 
                action.startDateTime && 
                !action.endDateTime
    );
  }

  getInProgressAction(sprintTask: SprintTask): Action | undefined {
    return sprintTask.actions.find(
      action => action.actionType === ActionType.Time && 
                action.startDateTime && 
                !action.endDateTime
    );
  }

  onStartTimer(sprintTask: SprintTask) {
    this.timerStarted.emit({
      taskId: sprintTask.task.id,
      sprintId: this.sprint().id,
    });
  }

  onStopTimer(sprintTask: SprintTask) {
    const action = this.getInProgressAction(sprintTask);
    if (action) {
      this.timerStopped.emit({
        taskId: sprintTask.task.id,
        sprintId: this.sprint().id,
        actionId: action.id,
      });
    }
  }

  hasOnlyAllocation(sprintTask: SprintTask): boolean {
    const hasTimeRecords = sprintTask.actions.some(
      action => action.actionType === ActionType.Time
    );
    const hasAllocation = sprintTask.actions.some(
      action => action.actionType === ActionType.Allocation
    );
    return hasAllocation && !hasTimeRecords;
  }

  getAllocationAction(sprintTask: SprintTask): Action | undefined {
    return sprintTask.actions.find(
      action => action.actionType === ActionType.Allocation
    );
  }

  onRemoveAllocation(sprintTask: SprintTask) {
    this.confirmationService.confirm({
      message: `Remove "${sprintTask.task.name}" from this sprint?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const action = this.getAllocationAction(sprintTask);
        if (action) {
          this.allocationRemoved.emit({ actionId: action.id });
        }
      },
    });
  }
}

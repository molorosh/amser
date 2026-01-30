import { Component, input, computed, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Sprint } from '../../../models/sprint';
import { Task } from '../../../models/task';
import { Action } from '../../../models/action';
import { ActionType } from '../../../models/action-type';
import { TaskType } from '../../../models/task-type';
import { SprintTask, createSprintTasks } from '../../../models/sprint-task';
import { TimeDisplayMode } from '../my-work';

@Component({
  selector: 'app-current-sprint',
  imports: [DatePipe, Button],
  templateUrl: './current-sprint.html',
  styleUrl: './current-sprint.scss',
})
export class CurrentSprint {
  sprint = input.required<Sprint>();
  tasks = input.required<Task[]>();
  actions = input.required<Action[]>();
  displayMode = input<TimeDisplayMode>('hours');

  timerStarted = output<{ taskId: string; sprintId: string }>();
  timerStopped = output<{ taskId: string; sprintId: string; actionId: string }>();

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

  formatTime(totalHours: number): string {
    if (this.displayMode() === 'days') {
      const hoursPerDay = this.sprint().hoursPerDay ?? 6;
      const days = totalHours / hoursPerDay;
      return `${days.toFixed(2)}d`;
    }
    return `${totalHours.toFixed(1)}h`;
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
}

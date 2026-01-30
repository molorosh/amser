import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Sprint } from '../../../models/sprint';
import { Task } from '../../../models/task';
import { Action } from '../../../models/action';
import { TaskType } from '../../../models/task-type';
import { SprintTask, createSprintTasks } from '../../../models/sprint-task';
import { TimeDisplayMode } from '../my-work';

@Component({
  selector: 'app-current-sprint',
  imports: [DatePipe],
  templateUrl: './current-sprint.html',
  styleUrl: './current-sprint.scss',
})
export class CurrentSprint {
  sprint = input.required<Sprint>();
  tasks = input.required<Task[]>();
  actions = input.required<Action[]>();
  displayMode = input<TimeDisplayMode>('hours');

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
}

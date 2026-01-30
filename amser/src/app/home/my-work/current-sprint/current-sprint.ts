import { Component, input, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Sprint } from '../../../models/sprint';
import { Task } from '../../../models/task';
import { Action } from '../../../models/action';
import { TaskType } from '../../../models/task-type';
import { SprintTask, createSprintTasks } from '../../../models/sprint-task';

@Component({
  selector: 'app-current-sprint',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './current-sprint.html',
  styleUrl: './current-sprint.scss',
})
export class CurrentSprint {
  sprint = input.required<Sprint>();
  tasks = input.required<Task[]>();
  actions = input.required<Action[]>();

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
}

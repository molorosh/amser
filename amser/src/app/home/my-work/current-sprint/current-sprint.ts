import { Component, input, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Sprint } from '../../../models/sprint';
import { Task } from '../../../models/task';
import { Action } from '../../../models/action';
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
}

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Sprint } from '../../models/sprint';
import { Task } from '../../models/task';
import { Action, createAction, calculateTotalHours } from '../../models/action';
import { ActionType } from '../../models/action-type';
import { PersistenceService } from '../../services/persistence.service';
import { CurrentSprint } from './current-sprint/current-sprint';

export type TimeDisplayMode = 'hours' | 'days';

@Component({
  selector: 'app-my-work',
  imports: [FormsModule, ToggleSwitch, CurrentSprint],
  templateUrl: './my-work.html',
  styleUrl: './my-work.scss',
})
export class MyWork implements OnInit {
  private persistence = inject(PersistenceService);

  sprints = signal<Sprint[]>([]);
  tasks = signal<Task[]>([]);
  actions = signal<Action[]>([]);
  showDays = signal(false);

  displayMode = computed<TimeDisplayMode>(() => 
    this.showDays() ? 'days' : 'hours'
  );

  currentSprints = computed(() => 
    this.sprints().filter(sprint => sprint.isCurrent)
  )

  async ngOnInit() {
    await this.persistence.whenReady();
    const [allSprints, allTasks, allActions] = await Promise.all([
      this.persistence.getAllSprints(),
      this.persistence.getAllTasks(),
      this.persistence.getAllActions(),
    ]);
    this.sprints.set(allSprints);
    this.tasks.set(allTasks);
    this.actions.set(allActions);
  }

  async onTimerStarted(event: { taskId: string; sprintId: string }) {
    // Stop any currently running timer first
    const inProgressAction = this.actions().find(
      a => a.actionType === ActionType.Time && 
           a.startDateTime && 
           !a.endDateTime
    );
    
    if (inProgressAction) {
      const endDateTime = new Date();
      const totalHours = calculateTotalHours(inProgressAction.startDateTime, endDateTime);
      const stoppedAction: Action = {
        ...inProgressAction,
        endDateTime,
        totalHours,
      };
      await this.persistence.saveAction(stoppedAction);
      this.actions.update(actions => 
        actions.map(a => a.id === inProgressAction.id ? stoppedAction : a)
      );
    }

    // Start the new timer
    const newAction = createAction(ActionType.Time, event.taskId, event.sprintId);
    await this.persistence.saveAction(newAction);
    this.actions.update(actions => [...actions, newAction]);
  }

  async onTimerStopped(event: { taskId: string; sprintId: string; actionId: string }) {
    const action = this.actions().find(a => a.id === event.actionId);
    if (action) {
      const endDateTime = new Date();
      const totalHours = calculateTotalHours(action.startDateTime, endDateTime);
      const updatedAction: Action = {
        ...action,
        endDateTime,
        totalHours,
      };
      await this.persistence.saveAction(updatedAction);
      this.actions.update(actions => 
        actions.map(a => a.id === event.actionId ? updatedAction : a)
      );
    }
  }

  async onAllocationRemoved(event: { actionId: string }) {
    await this.persistence.deleteAction(event.actionId);
    this.actions.update(actions => 
      actions.filter(a => a.id !== event.actionId)
    );
  }
}

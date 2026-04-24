import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DatePipe } from '@angular/common';
import { Action } from '../../models/action';
import { ActionType } from '../../models/action-type';
import { Task } from '../../models/task';
import { TaskType } from '../../models/task-type';
import { Sprint } from '../../models/sprint';
import { PersistenceService } from '../../services/persistence.service';
import { WORKDAYS_SETTING } from '../../genz-settings/genz-settings-page/genz-settings-page';

interface TaskSummary {
  task: Task;
  sprintName: string;
  totalHours: number;
  actionCount: number;
}

@Component({
  selector: 'app-on-this-day-page',
  imports: [FormsModule, DatePicker, DatePipe],
  templateUrl: './on-this-day-page.html',
  styleUrl: './on-this-day-page.scss',
})
export class OnThisDayPage implements OnInit {
  private persistence = inject(PersistenceService);

  actions = signal<Action[]>([]);
  tasks = signal<Task[]>([]);
  sprints = signal<Sprint[]>([]);

  selectedDate = signal<Date>(OnThisDayPage.getLastWorkday([]));
  maxDate = new Date();

  /**
   * Returns the most recent workday before today.
   * If workdays is empty, all days are considered workdays (returns yesterday).
   */
  private static getLastWorkday(workdays: number[]): Date {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);

    if (workdays.length === 0) {
      return d;
    }

    // Walk backwards up to 7 days to find a workday
    for (let i = 0; i < 7; i++) {
      if (workdays.includes(d.getDay())) {
        return d;
      }
      d.setDate(d.getDate() - 1);
    }

    return d;
  }

  private taskMap = computed(() => {
    const map = new Map<string, Task>();
    for (const t of this.tasks()) {
      map.set(t.id, t);
    }
    return map;
  });

  private sprintMap = computed(() => {
    const map = new Map<string, Sprint>();
    for (const s of this.sprints()) {
      map.set(s.id, s);
    }
    return map;
  });

  dayActions = computed(() => {
    const date = this.selectedDate();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.actions().filter(a => {
      if (a.actionType === ActionType.Allocation) return false;
      const actionDate = new Date(a.startDateTime);
      return actionDate >= start && actionDate <= end;
    });
  });

  taskSummaries = computed<TaskSummary[]>(() => {
    const dayActions = this.dayActions();
    const taskMap = this.taskMap();
    const sprintMap = this.sprintMap();

    const grouped = new Map<string, { actions: Action[]; sprintId: string }>();
    for (const action of dayActions) {
      const existing = grouped.get(action.taskId);
      if (existing) {
        existing.actions.push(action);
      } else {
        grouped.set(action.taskId, { actions: [action], sprintId: action.sprintId });
      }
    }

    const summaries: TaskSummary[] = [];
    grouped.forEach((data, taskId) => {
      const task = taskMap.get(taskId);
      if (!task) return;
      const sprint = sprintMap.get(data.sprintId);
      const totalHours = data.actions
        .filter(a => a.actionType === ActionType.Time && a.totalHours !== undefined)
        .reduce((sum, a) => sum + (a.totalHours ?? 0), 0);

      summaries.push({
        task,
        sprintName: sprint?.name ?? 'Unknown',
        totalHours: Math.round(totalHours * 100) / 100,
        actionCount: data.actions.length,
      });
    });

    summaries.sort((a, b) => b.totalHours - a.totalHours);
    return summaries;
  });

  grandTotalHours = computed(() => {
    const total = this.taskSummaries().reduce((sum, s) => sum + s.totalHours, 0);
    return Math.round(total * 100) / 100;
  });

  taskTypeIcon(taskType: TaskType): string {
    switch (taskType) {
      case TaskType.WorkItem: return 'pi pi-briefcase';
      case TaskType.Meeting: return 'pi pi-users';
      case TaskType.People: return 'pi pi-user';
      case TaskType.Other: return 'pi pi-ellipsis-h';
      default: return 'pi pi-circle';
    }
  }

  onDateChange(date: Date) {
    this.selectedDate.set(date);
  }

  async ngOnInit() {
    await this.persistence.whenReady();
    const [allActions, allTasks, allSprints, workdaysSetting] = await Promise.all([
      this.persistence.getAllActions(),
      this.persistence.getAllTasks(),
      this.persistence.getAllSprints(),
      this.persistence.getSetting(WORKDAYS_SETTING),
    ]);
    this.actions.set(allActions);
    this.tasks.set(allTasks);
    this.sprints.set(allSprints);

    const workdays: number[] = workdaysSetting?.settingValue
      ? JSON.parse(workdaysSetting.settingValue)
      : [];
    this.selectedDate.set(OnThisDayPage.getLastWorkday(workdays));
  }
}

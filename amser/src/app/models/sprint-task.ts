import { Task } from './task';
import { Action } from './action';
import { ActionType } from './action-type';

export interface SprintTask {
  task: Task;
  sprintId: string;
  actions: Action[];
  totalHours: number;
}

export function createSprintTasks(
  sprintId: string,
  tasks: Task[],
  actions: Action[]
): SprintTask[] {
  // Filter actions for this sprint
  const sprintActions = actions.filter(action => action.sprintId === sprintId);

  // Group actions by task
  const actionsByTask = new Map<string, Action[]>();
  sprintActions.forEach(action => {
    const existing = actionsByTask.get(action.taskId) ?? [];
    existing.push(action);
    actionsByTask.set(action.taskId, existing);
  });

  // Create SprintTask for each task that has actions in this sprint
  const sprintTasks: SprintTask[] = [];

  actionsByTask.forEach((taskActions, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      sprintTasks.push({
        task,
        sprintId,
        actions: taskActions,
        totalHours: calculateSprintTaskTotalHours(taskActions),
      });
    }
  });

  return sprintTasks;
}

export function calculateSprintTaskTotalHours(actions: Action[]): number {
  return actions
    .filter(action => 
      action.actionType === ActionType.Time && 
      action.startDateTime && 
      action.endDateTime &&
      action.totalHours !== undefined
    )
    .reduce((sum, action) => sum + (action.totalHours ?? 0), 0);
}

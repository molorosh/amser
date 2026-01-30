import { ActionType } from './action-type';

export interface Action {
  id: string;
  actionType: ActionType;
  startDateTime: Date;
  endDateTime?: Date;
  totalHours?: number;
  taskId: string;
  sprintId: string;
}

export function createAction(
  actionType: ActionType,
  taskId: string,
  sprintId: string,
  startDateTime: Date = new Date()
): Action {
  return {
    id: crypto.randomUUID(),
    actionType,
    startDateTime,
    taskId,
    sprintId,
  };
}

export function calculateTotalHours(start: Date, end: Date): number {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return Math.round(hours * 100) / 100; // Round to 2 decimal places
}

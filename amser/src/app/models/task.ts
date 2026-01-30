import { TaskType } from './task-type';

export interface Task {
  id: string;
  name: string;
  description: string;
  url: string;
  taskType: TaskType;
  autoAllocate: boolean;
}

export function createTask(
  name: string,
  description: string = '',
  url: string = '',
  taskType: TaskType = TaskType.WorkItem,
  autoAllocate: boolean = false
): Task {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    url,
    taskType,
    autoAllocate,
  };
}

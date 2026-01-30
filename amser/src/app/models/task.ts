export interface Task {
  id: string;
  name: string;
  description: string;
  url: string;
}

export function createTask(
  name: string,
  description: string = '',
  url: string = ''
): Task {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    url,
  };
}

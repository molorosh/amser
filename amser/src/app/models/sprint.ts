export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  hoursPerDay: number;
  daysPerSprint: number;
}

export function createSprint(
  name: string,
  startDate: Date,
  endDate: Date,
  isCurrent: boolean = false,
  hoursPerDay: number = 6,
  daysPerSprint: number = 8
): Sprint {
  return {
    id: crypto.randomUUID(),
    name,
    startDate,
    endDate,
    isCurrent,
    hoursPerDay,
    daysPerSprint,
  };
}

export function calculateMaxHours(sprint: Sprint): number {
  return sprint.hoursPerDay * sprint.daysPerSprint;
}

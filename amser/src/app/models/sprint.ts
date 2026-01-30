export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export function createSprint(
  name: string,
  startDate: Date,
  endDate: Date,
  isCurrent: boolean = false
): Sprint {
  return {
    id: crypto.randomUUID(),
    name,
    startDate,
    endDate,
    isCurrent,
  };
}

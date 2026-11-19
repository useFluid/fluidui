export type Cell = { date: Date; inMonth: boolean };

export const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function monthGrid(year: number, month: number, weekStart = 1): Cell[] {
  const first = new Date(year, month, 1);
  const back = (first.getDay() - weekStart + 7) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(year, month, 1 - back + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), last));
};

const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export function moveDate(date: Date, key: string, weekStart = 1): Date | null {
  const offset = (date.getDay() - weekStart + 7) % 7;
  switch (key) {
    case "ArrowRight":
      return addDays(date, 1);
    case "ArrowLeft":
      return addDays(date, -1);
    case "ArrowDown":
      return addDays(date, 7);
    case "ArrowUp":
      return addDays(date, -7);
    case "PageDown":
      return addMonths(date, 1);
    case "PageUp":
      return addMonths(date, -1);
    case "Home":
      return addDays(date, -offset);
    case "End":
      return addDays(date, 6 - offset);
    default:
      return null;
  }
}

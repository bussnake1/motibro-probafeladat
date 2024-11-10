import dayjs from "dayjs";
import type { TimeEntry } from "../types";

export const getDurationInHours = (entry: TimeEntry): number => {
  const start = dayjs(`${entry.date} ${entry.startTime}`);
  const end = dayjs(`${entry.date} ${entry.endTime}`);
  return end.diff(start, 'hour', true);
};

export const formatDuration = (hours: number): string => {
  return `${hours.toFixed(1)}h`;
};

export const calculateDuration = (entry: TimeEntry): string => {
  return formatDuration(getDurationInHours(entry));
};

export const calculateTotalHours = (entries: TimeEntry[]): string => {
  const total = entries.reduce((sum, entry) => {
    return sum + getDurationInHours(entry);
  }, 0);
  return total.toFixed(1);
};

export const calculateAverageHoursPerDay = (entries: TimeEntry[]): string => {
  if (entries.length === 0) return '0.0';
  const uniqueDays = new Set(entries.map(e => e.date)).size;
  const totalHours = Number(calculateTotalHours(entries));
  return (totalHours / uniqueDays).toFixed(1);
};

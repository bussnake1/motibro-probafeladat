export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export type TimeViewMode = 'day' | 'week' | 'month';

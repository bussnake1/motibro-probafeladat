import dayjs from 'dayjs';
import { storage, generateId } from '../services/storage';
import type { Tag, TimeEntry } from '../types';

// Helper function to generate random color
const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to generate random number of tags
const getRandomTags = (tags: Tag[], min: number, max: number): string[] => {
  const count = Math.floor(Math.random() * (max - min + 1) + min);
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(tag => tag.id);
};

// Helper function to generate a random date within a range
const getRandomDate = (start: Date, end: Date): string => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return dayjs(new Date(randomTime)).format('YYYY-MM-DD');
};

// Helper function to generate random start and end times
const generateTimeRange = (minDuration: number, maxDuration: number): { startTime: string; endTime: string } => {
  // Generate random start time between 9:00 and 17:00
  const startHour = Math.floor(Math.random() * 8) + 9; // 9 to 16
  const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

  // Calculate end time based on random duration
  const durationMinutes = Math.floor(Math.random() * (maxDuration - minDuration + 1) + minDuration);
  const endDateTime = dayjs(`2024-01-01 ${startTime}`).add(durationMinutes, 'minute');
  const endTime = endDateTime.format('HH:mm');

  return { startTime, endTime };
};

// Main seeding function
export const seedDatabase = () => {
  const tagNames = [
    'Development', 'Design', 'Meeting', 'Planning', 'Backend',
    'Frontend', 'Database', 'API', 'Security', 'Performance'
  ];

  const tags: Tag[] = tagNames.map(name => {
    const color = generateRandomColor();
    return {
      id: generateId(),
      name,
      color,
      textColor: '#FFFFFF' // This will be calculated by the TagManager component
    };
  });

  // Generate 500 time entries
  const startDate = new Date('2024-09-01');
  const endDate = new Date('2024-11-30');
  
  const entries: TimeEntry[] = Array.from({ length: 500 }, () => {
    const date = getRandomDate(startDate, endDate);
    const { startTime, endTime } = generateTimeRange(15, 240); // 15 minutes to 4 hours

    return {
      id: generateId(),
      date,
      startTime,
      endTime,
      description: `Task on ${date}`,
      tags: getRandomTags(tags, 1, 6)
    };
  });

  // Sort entries by date
  entries.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  // Save to storage
  storage.saveTags(tags);
  storage.saveTimeEntries(entries);

  return {
    tagCount: tags.length,
    entryCount: entries.length
  };
};

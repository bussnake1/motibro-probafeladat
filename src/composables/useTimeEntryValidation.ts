import { computed } from 'vue';
import dayjs from 'dayjs';
import type { TimeEntry } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function useTimeEntryValidation() {
  const validateTimeEntry = (entry: Partial<TimeEntry>): ValidationResult => {
    const errors: string[] = [];

    // Required fields
    if (!entry.date) {
      errors.push('Date is required');
    }

    if (!entry.startTime) {
      errors.push('Start time is required');
    }

    if (!entry.endTime) {
      errors.push('End time is required');
    }

    if (!entry.description?.trim()) {
      errors.push('Description is required');
    }

    // Time range validation
    if (entry.startTime && entry.endTime) {
      const start = dayjs(`${entry.date} ${entry.startTime}`);
      const end = dayjs(`${entry.date} ${entry.endTime}`);

      if (end.isBefore(start)) {
        errors.push('End time must be after start time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    validateTimeEntry
  };
}

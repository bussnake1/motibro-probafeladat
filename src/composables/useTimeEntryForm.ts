import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { TimeEntry } from '../types';
import { useTimeEntryValidation } from './useTimeEntryValidation';
import { useToast } from 'primevue/usetoast';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

interface UseTimeEntryFormProps {
  entry?: TimeEntry;
  onSubmit: (entry: Partial<TimeEntry>) => void;
  onCancel: () => void;
}

export function useTimeEntryForm({ entry, onSubmit, onCancel }: UseTimeEntryFormProps) {
  const toast = useToast();
  const { validateTimeEntry } = useTimeEntryValidation();

  const editing = ref(false);
  const form = ref({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    description: '',
    tags: [] as string[]
  });

  // Initialize form if editing
  if (entry) {
    editing.value = true;
    const baseDate = new Date();
    
    // Parse the times using the HH:mm format
    const startTime = dayjs(entry.startTime, 'HH:mm');
    const endTime = dayjs(entry.endTime, 'HH:mm');
    
    // Create new Date objects with the correct hours and minutes
    const startDate = new Date(baseDate);
    startDate.setHours(startTime.hour(), startTime.minute(), 0, 0);
    
    const endDate = new Date(baseDate);
    endDate.setHours(endTime.hour(), endTime.minute(), 0, 0);

    form.value = {
      date: dayjs(entry.date).toDate(),
      startTime: startDate,
      endTime: endDate,
      description: entry.description,
      tags: entry.tags
    };
  }

  const handleSubmit = () => {
    const formData = {
      date: dayjs(form.value.date).format('YYYY-MM-DD'),
      startTime: dayjs(form.value.startTime).format('HH:mm'),
      endTime: dayjs(form.value.endTime).format('HH:mm'),
      description: form.value.description.trim(),
      tags: form.value.tags
    };

    const validation = validateTimeEntry(formData);
    
    if (!validation.isValid) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: validation.errors.join(', '),
        life: 3000
      });
      return;
    }

    onSubmit(formData);
  };

  const resetForm = () => {
    form.value = {
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      description: '',
      tags: []
    };
    editing.value = false;
  };

  return {
    form,
    editing,
    handleSubmit,
    resetForm,
    cancel: onCancel
  };
}

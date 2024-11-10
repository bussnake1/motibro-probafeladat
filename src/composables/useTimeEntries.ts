import { computed, Ref, ComputedRef } from 'vue';
import type { TimeEntry, TimeViewMode, Tag } from '../types';
import { getStartAndEndDates, isDateInRange } from '../utils/date';
import { useTags } from './useTags';

interface UseTimeEntriesProps {
  entries: TimeEntry[] | ComputedRef<TimeEntry[]>;
  viewMode: Ref<TimeViewMode>;
  selectedDate: Ref<Date | [Date, Date]>;
  selectedTags: Ref<string[]>;
  tags: Tag[] | ComputedRef<Tag[]>;
}

export function useTimeEntries({
  entries,
  viewMode,
  selectedDate,
  selectedTags,
  tags
}: UseTimeEntriesProps) {
  const entriesRef = computed(() => {
    return 'value' in entries ? entries.value : entries;
  });

  const { filterEntriesByTags } = useTags(tags);

  const dateFilteredEntries = computed(() => {
    const { start, end } = getStartAndEndDates(viewMode.value, selectedDate.value);
    return entriesRef.value.filter(entry => isDateInRange(entry.date, start, end));
  });

  const filteredEntries = computed(() => {
    return filterEntriesByTags(dateFilteredEntries.value, selectedTags.value);
  });

  const datePickerProps = computed(() => {
    switch (viewMode.value) {
      case 'week':
        return {
          selectionMode: 'range' as const,
          manualInput: false,
          view: 'date' as const,
          dateFormat: 'yy-mm-dd'
        };
      case 'month':
        return {
          selectionMode: 'single' as const,
          view: 'month' as const,
          dateFormat: 'yy-mm',
          manualInput: false
        };
      default: // day
        return {
          selectionMode: 'single' as const,
          view: 'date' as const,
          dateFormat: 'yy-mm-dd',
          manualInput: false
        };
    }
  });

  return {
    filteredEntries,
    datePickerProps
  };
}

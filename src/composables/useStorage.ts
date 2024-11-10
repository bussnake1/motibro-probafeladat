import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { TimeEntry, Tag } from '../types';
import { storage, generateId } from '../services/storage';

export function useStorage() {
  const toast = useToast();
  const timeEntries = ref<TimeEntry[]>([]);
  const tags = ref<Tag[]>([]);

  // Load initial data
  const loadData = () => {
    timeEntries.value = storage.getTimeEntries();
    tags.value = storage.getTags();
  };

  // Time Entry operations
  const createTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      id: generateId(),
      ...entry
    };
    timeEntries.value.push(newEntry);
    storage.saveTimeEntries(timeEntries.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Entry created successfully',
      life: 3000
    });
  };

  const updateTimeEntry = (id: string, entry: Partial<TimeEntry>) => {
    const index = timeEntries.value.findIndex(e => e.id === id);
    if (index !== -1) {
      timeEntries.value[index] = {
        ...timeEntries.value[index],
        ...entry
      };
      storage.saveTimeEntries(timeEntries.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Entry updated successfully',
        life: 3000
      });
    }
  };

  const deleteTimeEntry = (id: string) => {
    timeEntries.value = timeEntries.value.filter(entry => entry.id !== id);
    storage.saveTimeEntries(timeEntries.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Entry deleted successfully',
      life: 3000
    });
  };

  // Tag operations
  const createTag = (tagData: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      id: generateId(),
      ...tagData
    };
    tags.value.push(newTag);
    storage.saveTags(tags.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tag created successfully',
      life: 3000
    });
  };

  const updateTag = (tag: Tag) => {
    const index = tags.value.findIndex(t => t.id === tag.id);
    if (index !== -1) {
      tags.value[index] = tag;
      storage.saveTags(tags.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tag updated successfully',
        life: 3000
      });
    }
  };

  const deleteTag = (id: string) => {
    tags.value = tags.value.filter(tag => tag.id !== id);
    storage.saveTags(tags.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tag deleted successfully',
      life: 3000
    });
  };

  // Clear all data
  const clearStorage = () => {
    timeEntries.value = [];
    tags.value = [];
    storage.saveTimeEntries([]);
    storage.saveTags([]);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Storage cleared successfully',
      life: 3000
    });
  };

  // Check if storage is empty
  const isStorageEmpty = () => {
    return timeEntries.value.length === 0 || tags.value.length === 0;
  };

  return {
    timeEntries,
    tags,
    loadData,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    createTag,
    updateTag,
    deleteTag,
    clearStorage,
    isStorageEmpty
  };
}

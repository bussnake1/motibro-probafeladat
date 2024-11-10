import { computed, type ComputedRef } from 'vue';
import type { Tag, TimeEntry } from '../types';

export function useTags(tagsRef: ComputedRef<Tag[]> | Tag[]) {
  const tags = computed(() => {
    return Array.isArray(tagsRef) ? tagsRef : tagsRef.value;
  });

  const getTagColor = (tagId: string) => {
    const tag = tags.value.find(t => t.id === tagId);
    return tag?.color || '#cbd5e1';
  };

  const getTagTextColor = (tagId: string) => {
    const tag = tags.value.find(t => t.id === tagId);
    return tag?.textColor || '#000000';
  };

  const getTagName = (tagId: string) => {
    const tag = tags.value.find(t => t.id === tagId);
    return tag?.name || 'Unknown';
  };

  const getTag = (tagId: string) => {
    return tags.value.find(t => t.id === tagId);
  };

  const filterEntriesByTags = (entries: TimeEntry[], selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      return entries;
    }
    return entries.filter(entry => 
      entry.tags.some(tagId => selectedTags.includes(tagId))
    );
  };

  const tagSelectOptions = computed(() => 
    tags.value.map(tag => ({
      ...tag,
      label: tag.name,
      value: tag.id
    }))
  );

  return {
    getTagColor,
    getTagTextColor,
    getTagName,
    getTag,
    filterEntriesByTags,
    tagSelectOptions
  };
}

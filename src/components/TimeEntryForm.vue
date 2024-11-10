<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4 bg-white dark:bg-surface-900 rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Date</label>
        <DatePicker v-model="form.date" dateFormat="yy-mm-dd" class="w-full" />
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Time Range</label>
        <div class="flex gap-2">
          <DatePicker v-model="form.startTime" timeOnly showTime class="flex-1" />
          <DatePicker v-model="form.endTime" timeOnly showTime class="flex-1" />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <Textarea v-model="form.description" rows="3" class="w-full" />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Tags</label>
      <MultiSelect
        v-model="form.tags"
        :options="availableTags"
        optionLabel="name"
        optionValue="id"
        placeholder="Select Tags"
        class="w-full"
      />
    </div>

    <div class="flex justify-end space-x-2">
      <Button 
        type="button" 
        severity="secondary" 
        @click="$emit('cancel')"
        label="Cancel"
      />
      <Button 
        type="submit" 
        :label="editing ? 'Update' : 'Create'"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useToast } from 'primevue/usetoast';
import type { TimeEntry, Tag } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const props = defineProps<{
  entry?: TimeEntry;
  availableTags: Tag[];
}>();

const emit = defineEmits<{
  (e: 'submit', entry: Partial<TimeEntry>): void;
  (e: 'cancel'): void;
}>();

const toast = useToast();

const editing = ref(false);
const form = ref({
  date: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  description: '',
  tags: [] as string[]
});

onMounted(() => {
  if (props.entry) {
    editing.value = true;
    const baseDate = new Date(); // Use current date as base for time
    
    // Parse the times using the HH:mm format
    const startTime = dayjs(props.entry.startTime, 'HH:mm');
    const endTime = dayjs(props.entry.endTime, 'HH:mm');
    
    // Create new Date objects with the correct hours and minutes
    const startDate = new Date(baseDate);
    startDate.setHours(startTime.hour(), startTime.minute(), 0, 0);
    
    const endDate = new Date(baseDate);
    endDate.setHours(endTime.hour(), endTime.minute(), 0, 0);

    form.value = {
      date: dayjs(props.entry.date).toDate(),
      startTime: startDate,
      endTime: endDate,
      description: props.entry.description,
      tags: props.entry.tags
    };
  }
});

const validateForm = () => {
  const errors: string[] = [];

  if (!form.value.date) {
    errors.push('Date is required');
  }

  if (!form.value.startTime || !form.value.endTime) {
    errors.push('Time range is required');
  }

  if (!form.value.description.trim()) {
    errors.push('Description is required');
  }

  if (errors.length > 0) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: errors.join(', '),
      life: 3000
    });
    return false;
  }

  // Compare times
  const startTime = dayjs(form.value.startTime);
  const endTime = dayjs(form.value.endTime);

  if (endTime.isBefore(startTime)) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Time Range',
      detail: 'End time must be after start time',
      life: 3000
    });
    return false;
  }

  return true;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  // Create a dayjs object from the date and ensure it's in local timezone
  const localDate = dayjs(form.value.date).startOf('day');
  
  const entry = {
    // Format the date in local timezone
    date: localDate.format('YYYY-MM-DD'),
    startTime: dayjs(form.value.startTime).format('HH:mm'),
    endTime: dayjs(form.value.endTime).format('HH:mm'),
    description: form.value.description.trim(),
    tags: form.value.tags
  };
  
  emit('submit', entry);
};
</script>

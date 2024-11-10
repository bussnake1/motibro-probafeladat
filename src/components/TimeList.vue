<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-4 items-center justify-between">
      <div class="flex gap-2">
        <SelectButton v-model="viewMode" :options="viewModes" :allowEmpty="false" class="mb-2" />
        <DatePicker 
          v-model="selectedDate" 
          :showIcon="true" 
          v-bind="datePickerProps"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">Filter by Tags:</label>
        <MultiSelect
          v-model="selectedTags"
          :options="tagSelectOptions"
          optionLabel="name"
          optionValue="id"
          placeholder="Select Tags"
          class="w-72 min-h-12"
        >
          <template #option="{ option }">
            <div class="flex items-center gap-2">
              <div 
                class="w-3 h-3 rounded-full" 
                :style="{ backgroundColor: option.color }"
              ></div>
              <span>{{ option.name }}</span>
            </div>
          </template>
          <template #value="{ value }">
            <div class="flex gap-1 flex-wrap">
              <Tag
                v-for="tagId in value"
                :key="tagId"
                :style="{ 
                  backgroundColor: getTagColor(tagId),
                  color: getTagTextColor(tagId)
                }"
              >
                {{ getTagName(tagId) }}
              </Tag>
            </div>
          </template>
        </MultiSelect>
      </div>
      <Button label="New Entry" icon="pi pi-plus" @click="$emit('new')" />
    </div>


    <DataTable 
      :value="filteredEntries"
      :paginator="true"
      :rows="10"
      stripedRows
      class="p-datatable-sm"
      removableSort
    >
      <Column field="date" header="Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column field="startTime" header="Start Time" sortable>
        <template #body="{ data }">
          {{ data.startTime }}
        </template>
      </Column>
      <Column field="endTime" header="End Time" sortable>
        <template #body="{ data }">
          {{ data.endTime }}
        </template>
      </Column>
      <Column header="Duration" sortable :sortField="getDurationNumber">
        <template #body="{ data }">
          {{ calculateDuration(data) }}
        </template>
      </Column>
      <Column field="description" header="Description" sortable />
      <Column field="tags" header="Tags">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Tag 
              v-for="tagId in data.tags" 
              :key="tagId"
              :style="{ 
                backgroundColor: getTagColor(tagId),
                color: getTagTextColor(tagId)
              }"
              :value="getTagName(tagId)"
            />
          </div>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              severity="secondary"
              text 
              @click="$emit('edit', data)"
            />
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              text
              @click="$emit('delete', data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <div class="mt-4 p-4 bg-gray-50 dark:bg-surface-900 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-3 bg-white dark:bg-surface-800 rounded shadow">
          <div class="text-sm text-gray-600 dark:text-surface-200">Total Hours</div>
          <div class="text-xl font-bold">{{ totalHours }}</div>
        </div>
        <div class="p-3 bg-white dark:bg-surface-800 rounded shadow">
          <div class="text-sm text-gray-600 dark:text-surface-200">Entries</div>
          <div class="text-xl font-bold">{{ filteredEntries.length }}</div>
        </div>
        <div class="p-3 bg-white dark:bg-surface-800 rounded shadow">
          <div class="text-sm text-gray-600 dark:text-surface-200">Average Hours/Day</div>
          <div class="text-xl font-bold">{{ averageHoursPerDay }}</div>
        </div>
      </div>
    </div>

    <TimeCharts 
      :entries="filteredEntries"
      :tags="tags"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from "dayjs";
import type { TimeEntry, Tag, TimeViewMode } from '../types';
import TimeCharts from './TimeCharts.vue';
import { formatDate } from '../utils/date';
import { calculateDuration, getDurationInHours, calculateTotalHours, calculateAverageHoursPerDay } from '../utils/time';
import { useTags } from '../composables/useTags';
import { useTimeEntries } from '../composables/useTimeEntries';

const props = defineProps<{
  entries: TimeEntry[];
  tags: Tag[];
}>();

defineEmits<{
  (e: 'new'): void;
  (e: 'edit', entry: TimeEntry): void;
  (e: 'delete', id: string): void;
}>();

const viewMode = ref<TimeViewMode>('week');
const selectedDate = ref<Date | [Date, Date]>(new Date());
const viewModes = ['day', 'week', 'month'];
const selectedTags = ref<string[]>([]);

// Make props reactive
const entriesRef = computed(() => props.entries);
const tagsRef = computed(() => props.tags);

// Use composables
const { 
  getTagColor, 
  getTagTextColor, 
  getTagName,
  tagSelectOptions 
} = useTags(tagsRef);

const { 
  filteredEntries,
  datePickerProps 
} = useTimeEntries({
  entries: entriesRef,
  viewMode,
  selectedDate,
  selectedTags,
  tags: tagsRef
});

// Watch for viewMode changes to update selectedDate format
watch(viewMode, (newMode) => {
  if (newMode === 'week') {
    // For week view, set the date range from current date to end of week
    const start = dayjs().startOf('week').toDate();
    const end = dayjs().endOf('week').toDate();
    selectedDate.value = [start, end];
  } else {
    // For day and month views, set to current date
    selectedDate.value = new Date();
  }
});

const getDurationNumber = (entry: TimeEntry) => {
  return getDurationInHours(entry).toFixed(1);
};

const totalHours = computed(() => calculateTotalHours(filteredEntries.value));
const averageHoursPerDay = computed(() => calculateAverageHoursPerDay(filteredEntries.value));
</script>

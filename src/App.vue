<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Time Tracker</h1>
        <div>
          <Button 
            v-if="isDatabaseEmpty"
            label="Seed Database" 
            icon="pi pi-database"
            @click="handleSeed"
          />
          <Button 
            v-else
            label="Empty Database" 
            icon="pi pi-trash"
            severity="danger"
            @click="emptyDatabase"
          />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Tabs :value="0" @update:value="(val: number) => activeIndex = val">
        <TabList>
          <Tab :value="0">Time Entries</Tab>
          <Tab :value="1">Tags</Tab>
        </TabList>
        <TabPanels>
          <TabPanel :value="0">
            <TimeList 
              :entries="timeEntries"
              :tags="tags"
              @new="showEntryDialog = true"
              @edit="editEntry"
              @delete="deleteEntry"
            />
          </TabPanel>
          <TabPanel :value="1">
            <TagManager 
              :tags="tags"
              @create="createTag"
              @update="updateTag"
              @delete="deleteTag"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog 
        v-model:visible="showEntryDialog" 
        :header="selectedEntry ? 'Edit Entry' : 'New Entry'"
        modal
        :style="{ width: '50vw' }"
      >
        <TimeEntryForm
          :entry="selectedEntry"
          :available-tags="tags"
          @submit="handleEntrySubmit"
          @cancel="closeEntryDialog"
        />
      </Dialog>
    </main>

    <Toast position="bottom-right" />
    <ConfirmDialog>
      <template #message>
        <div class="flex flex-column align-items-center">
          <i class="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
          <span>Are you sure you want to empty the database? This action cannot be undone.</span>
        </div>
      </template>
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

import TimeList from './components/TimeList.vue';
import TimeEntryForm from './components/TimeEntryForm.vue';
import TagManager from './components/TagManager.vue';
import { storage, generateId } from './services/storage';
import { seedDatabase } from './utils/seed';
import type { TimeEntry, Tag } from './types';

const toast = useToast();
const confirmDialog = useConfirm();

// State
const activeIndex = ref<number>(0);
const timeEntries = ref<TimeEntry[]>([]);
const tags = ref<Tag[]>([]);
const showEntryDialog = ref(false);
const selectedEntry = ref<TimeEntry | undefined>(undefined);

// Computed
const isDatabaseEmpty = computed(() => {
  return timeEntries.value.length === 0 || tags.value.length === 0;
});

// Load data from localStorage
onMounted(() => {
  timeEntries.value = storage.getTimeEntries();
  tags.value = storage.getTags();
});

// Database operations
const handleSeed = () => {
  const result = seedDatabase();
  timeEntries.value = storage.getTimeEntries();
  tags.value = storage.getTags();
  
  toast.add({
    severity: 'success',
    summary: 'Database Seeded',
    detail: `Created ${result.tagCount} tags and ${result.entryCount} time entries`,
    life: 3000
  });
};

const emptyDatabase = () => {
  confirmDialog.require({
    message: 'Are you sure you want to empty the database? This action cannot be undone.',
    header: 'Empty Database',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      timeEntries.value = [];
      tags.value = [];
      storage.saveTimeEntries([]);
      storage.saveTags([]);
      
      toast.add({
        severity: 'success',
        summary: 'Database Emptied',
        detail: 'All data has been cleared',
        life: 3000
      });
    }
  });
};

// Time Entry Methods
const handleEntrySubmit = (entry: Partial<TimeEntry>) => {
  if (selectedEntry.value) {
    // Update existing entry
    const index = timeEntries.value.findIndex(e => e.id === selectedEntry.value?.id);
    if (index !== -1) {
      timeEntries.value[index] = {
        ...timeEntries.value[index],
        ...entry
      };
      toast.add({ severity: 'success', summary: 'Success', detail: 'Entry updated successfully', life: 3000 });
    }
  } else {
    // Create new entry
    const newEntry: TimeEntry = {
      id: generateId(),
      ...entry as Omit<TimeEntry, 'id'>
    };
    timeEntries.value.push(newEntry);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Entry created successfully', life: 3000 });
  }

  storage.saveTimeEntries(timeEntries.value);
  closeEntryDialog();
};

const editEntry = (entry: TimeEntry) => {
  selectedEntry.value = entry;
  showEntryDialog.value = true;
};

const deleteEntry = (id: string) => {
  timeEntries.value = timeEntries.value.filter(entry => entry.id !== id);
  storage.saveTimeEntries(timeEntries.value);
  toast.add({ severity: 'success', summary: 'Success', detail: 'Entry deleted successfully', life: 3000 });
};

const closeEntryDialog = () => {
  showEntryDialog.value = false;
  selectedEntry.value = undefined;
};

// Tag Methods
const createTag = (tagData: Omit<Tag, 'id'>) => {
  const newTag: Tag = {
    id: generateId(),
    ...tagData
  };
  tags.value.push(newTag);
  storage.saveTags(tags.value);
  toast.add({ severity: 'success', summary: 'Success', detail: 'Tag created successfully', life: 3000 });
};

const updateTag = (tag: Tag) => {
  const index = tags.value.findIndex(t => t.id === tag.id);
  if (index !== -1) {
    tags.value[index] = tag;
    storage.saveTags(tags.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Tag updated successfully', life: 3000 });
  }
};

const deleteTag = (id: string) => {
  tags.value = tags.value.filter(tag => tag.id !== id);
  storage.saveTags(tags.value);
  toast.add({ severity: 'success', summary: 'Success', detail: 'Tag deleted successfully', life: 3000 });
};
</script>

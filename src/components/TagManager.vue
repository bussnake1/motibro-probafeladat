<template>
  <div class="space-y-4">
    <div class="flex-col items-start gap-4 sm:flex">
      <form @submit.prevent="handleSubmit" class="flex-1 p-4 space-y-4 bg-white rounded-lg shadow dark:bg-surface-900">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-surface-300">Tag Name</label>
          <InputText v-model="form.name" class="w-full" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-surface-300">Color</label>
          <ColorPicker v-model="form.color" class="w-full" />
        </div>

        <div class="flex justify-between">
          <Button
            v-if="editing"
            label="Cancel"
            icon="pi pi-times"
            class="mr-2"
            @click="resetForm"
            severity="secondary"
          ></Button>
          <Button 
            type="submit" 
            :label="editing ? 'Update Tag' : 'Create Tag'"
          ></Button>
        </div>
      </form>

      <div class="flex-1 p-4 bg-white rounded-lg shadow dark:bg-surface-900">
        <h3 class="mb-4 text-lg font-semibold">Existing Tags</h3>
        <div class="space-y-2">
          <div 
            v-for="tag in tags" 
            :key="tag.id"
            class="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-surface-700"
          >
            <div class="flex items-center gap-2">
              <div 
                class="w-4 h-4 rounded"
                :style="{ backgroundColor: tag.color }"
              ></div>
              <span>{{ tag.name }}</span>
            </div>
            <div class="flex gap-2">
              <Button 
                icon="pi pi-pencil" 
                text 
                severity="secondary"
                @click="editTag(tag)"
              ></Button>
              <Button 
                icon="pi pi-trash" 
                text 
                severity="danger"
                @click="$emit('delete', tag.id)"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ColorPicker from 'primevue/colorpicker';
import { useToast } from 'primevue/usetoast';
import type { Tag } from '../types';
import { getContrastingColor } from '../utils/colors';

defineProps<{
  tags: Tag[];
}>();

const emit = defineEmits<{
  (e: 'create', tag: Omit<Tag, 'id'>): void;
  (e: 'update', tag: Tag): void;
  (e: 'delete', id: string): void;
}>();

const toast = useToast();

const form = ref({
  name: '',
  color: '#3B82F6'
});

const editing = ref<string | null>(null);

const handleSubmit = () => {
  // Validate tag name
  if (!form.value.name.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Tag name is required',
      life: 3000
    });
    return;
  }

  const textColor = getContrastingColor(form.value.color);

  if (editing.value) {
    emit('update', {
      id: editing.value,
      name: form.value.name.trim(),
      color: form.value.color,
      textColor
    });
  } else {
    emit('create', {
      name: form.value.name.trim(),
      color: form.value.color,
      textColor
    });
  }

  resetForm();
};

const editTag = (tag: Tag) => {
  editing.value = tag.id;
  form.value = {
    name: tag.name,
    color: tag.color
  };
};

const resetForm = () => {
  form.value = {
    name: '',
    color: '#3B82F6'
  };
  editing.value = null;
};
</script>

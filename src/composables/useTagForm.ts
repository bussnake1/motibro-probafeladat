import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { Tag } from '../types';

interface UseTagFormProps {
  onSubmit: (tag: Omit<Tag, 'id'>) => void;
  onCancel: () => void;
}

export function useTagForm({ onSubmit, onCancel }: UseTagFormProps) {
  const toast = useToast();
  const editing = ref<string | null>(null);
  const form = ref({
    name: '',
    color: '#3B82F6'
  });

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.value.name.trim()) {
      errors.push('Tag name is required');
    }

    if (!form.value.color) {
      errors.push('Color is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = () => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: validation.errors.join(', '),
        life: 3000
      });
      return;
    }

    onSubmit({
      name: form.value.name.trim(),
      color: form.value.color,
      textColor: '#000000' // This will be calculated by the color utility
    });

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

  return {
    form,
    editing,
    handleSubmit,
    editTag,
    resetForm,
    cancel: onCancel
  };
}

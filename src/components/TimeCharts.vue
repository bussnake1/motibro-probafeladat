<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div class="p-4 bg-white dark:bg-surface-800 rounded shadow">
      <Chart type="bar" :data="dailyHoursData" :options="dailyHoursOptions" class="h-full" />
    </div>
    <div class="p-4 bg-white dark:bg-surface-800 rounded shadow">
      <Chart type="pie" :data="tagDistributionData" :options="tagDistributionOptions" class="h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import dayjs from 'dayjs';
import type { TimeEntry, Tag } from '../types';

const props = defineProps<{
  entries: TimeEntry[];
  tags: Tag[];
}>();

// Daily Hours Chart Data
const dailyHoursData = computed(() => {
  // Group entries by date and calculate total hours
  const dailyHours = props.entries.reduce((acc, entry) => {
    const date = entry.date;
    const start = dayjs(`${entry.date} ${entry.startTime}`);
    const end = dayjs(`${entry.date} ${entry.endTime}`);
    const hours = end.diff(start, 'hour', true);

    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += hours;
    return acc;
  }, {} as Record<string, number>);

  // Sort dates
  const sortedDates = Object.keys(dailyHours).sort();

  return {
    labels: sortedDates.map(date => dayjs(date).format('MMM D')),
    datasets: [
      {
        label: 'Hours Worked',
        data: sortedDates.map(date => dailyHours[date].toFixed(1)),
        backgroundColor: '#3B82F6',
        borderRadius: 6
      }
    ]
  };
});

const dailyHoursOptions = computed(() => ({
  plugins: {
    legend: {
      labels: {
        color: '#666'
      }
    },
    title: {
      display: true,
      text: 'Daily Hours',
      color: '#666'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Hours',
        color: '#666'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date',
        color: '#666'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
}));

// Tag Distribution Chart Data
const tagDistributionData = computed(() => {
  // Calculate hours per tag
  const tagHours = props.entries.reduce((acc, entry) => {
    const duration = dayjs(`${entry.date} ${entry.endTime}`).diff(
      dayjs(`${entry.date} ${entry.startTime}`),
      'hour',
      true
    );

    entry.tags.forEach(tagId => {
      if (!acc[tagId]) {
        acc[tagId] = 0;
      }
      acc[tagId] += duration;
    });

    return acc;
  }, {} as Record<string, number>);

  // Get tag names and colors
  const tagNames = Object.keys(tagHours).map(tagId => {
    const tag = props.tags.find(t => t.id === tagId);
    return tag?.name || 'Unknown';
  });

  const tagColors = Object.keys(tagHours).map(tagId => {
    const tag = props.tags.find(t => t.id === tagId);
    return tag?.color || '#cbd5e1';
  });

  return {
    labels: tagNames,
    datasets: [
      {
        data: Object.values(tagHours).map(hours => hours.toFixed(1)),
        backgroundColor: tagColors
      }
    ]
  };
});

const tagDistributionOptions = computed(() => ({
  plugins: {
    legend: {
      labels: {
        color: '#666'
      }
    },
    title: {
      display: true,
      text: 'Time Distribution by Tag',
      color: '#666'
    }
  },
  responsive: true,
  maintainAspectRatio: false
}));
</script>

<style scoped>
.p-4 {
  height: 400px;
}
</style>

<script setup lang="ts">
import { format } from 'date-fns';
import type { JobApplication } from '../types';

defineProps<{
  job: JobApplication;
}>();

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interviewing: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
  offer: 'bg-purple-100 text-purple-800'
} as const;
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-bold text-lg">{{ job.company }}</h3>
        <p class="text-gray-600">{{ job.position }}</p>
      </div>
      <span :class="[statusColors[job.status], 'px-2 py-1 rounded-full text-sm']">
        {{ job.status }}
      </span>
    </div>
    <div class="mt-4">
      <p class="text-sm text-gray-500">
        Applied: {{ format(new Date(job.dateApplied), 'MMM d, yyyy') }}
      </p>
      <p class="mt-2 text-sm">{{ job.notes }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { JobApplication, StatusOption } from '../types';

const props = defineProps<{
  modelValue: JobApplication['status'];
  jobId: string;
}>();

const emit = defineEmits<{
  (e: 'status-change', status: JobApplication['status']): void;
}>();

const selectedStatus = ref(props.modelValue);

// Keep the displayed value in sync with the prop
watch(() => props.modelValue, (newValue) => {
  selectedStatus.value = newValue;
});

const statusOptions: StatusOption[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'accepted', label: 'Accepted 🎉' },
  { value: 'rejected', label: 'Rejected 👎' }
];

const handleChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const newStatus = select.value as JobApplication['status'];
  
  // Emit the status change event
  emit('status-change', newStatus);
  
  // Reset back to the current status immediately
  select.value = props.modelValue;
};
</script>

<template>
  <select
    :value="props.modelValue"
    @change="handleChange"
    class="block w-full py-3 px-4 text-base rounded-lg border border-gray-200 shadow-lg 
           focus:border-purple-500 focus:ring-purple-500 
           bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
           hover:border-purple-500 transition-colors duration-200
           cursor-pointer appearance-none font-medium
           bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]
           bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]"
  >
    <option
      v-for="option in statusOptions"
      :key="option.value"
      :value="option.value"
      class="py-2 font-medium dark:bg-gray-700"
    >
      {{ option.label }}
    </option>
  </select>
</template>
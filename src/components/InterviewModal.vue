<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, addMinutes, parseISO } from 'date-fns';

const props = defineProps<{
  show: boolean;
  jobId: string;
  minDate: string;
  initialDate?: string;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', jobId: string, date: string): void;
}>();

const applicationDate = computed(() => format(parseISO(props.minDate), 'yyyy-MM-dd'));
const now = new Date();
const currentTime = format(now, 'HH:mm');

const interviewDate = ref(applicationDate.value);
const interviewTime = ref(format(addMinutes(now, 30), 'HH:mm'));

// Reset or populate form when modal is shown
watch(() => props.show, (newValue) => {
  if (newValue) {
    if (props.initialDate) {
      // If editing, use the existing date and time
      const date = new Date(props.initialDate);
      interviewDate.value = format(date, 'yyyy-MM-dd');
      interviewTime.value = format(date, 'HH:mm');
    } else {
      // If new interview, set default values
      interviewDate.value = applicationDate.value;
      interviewTime.value = format(addMinutes(now, 30), 'HH:mm');
    }
  }
}, { immediate: true });

const isValidDateTime = computed(() => {
  const selectedDateTime = new Date(`${interviewDate.value}T${interviewTime.value}`);
  const minDateTime = parseISO(props.minDate);
  return selectedDateTime >= minDateTime;
});

const handleSave = () => {
  if (isValidDateTime.value) {
    const dateTime = `${interviewDate.value}T${interviewTime.value}`;
    emit('save', props.jobId, dateTime);
  }
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h3 class="text-lg font-medium mb-4">
        {{ isEditing ? 'Edit Interview Schedule' : 'Schedule Interview' }}
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Date</label>
          <input
            v-model="interviewDate"
            type="date"
            :min="applicationDate"
            required
            class="px-4 py-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Time</label>
          <input
            v-model="interviewTime"
            type="time"
            required
            :min="interviewDate === format(now, 'yyyy-MM-dd') ? currentTime : undefined"
            class="px-4 py-2 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div v-if="!isValidDateTime" class="text-red-500 text-sm">
          Please select a date and time after the application date
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          :disabled="!isValidDateTime"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>
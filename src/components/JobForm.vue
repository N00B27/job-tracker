<script setup lang="ts">
import { ref } from 'vue';
import type { JobApplication } from '../types';
import { format } from 'date-fns';

const emit = defineEmits<{
  (e: 'submit', job: JobApplication): void;
}>();

const company = ref('');
const position = ref('');
const dateApplied = ref(format(new Date(), 'yyyy-MM-dd'));
const resume = ref<File | null>(null);
const isSubmitting = ref(false);
const error = ref('');

const maxDate = format(new Date(), 'yyyy-MM-dd');

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    resume.value = input.files[0];
  }
};

const submitJob = async () => {
  try {
    isSubmitting.value = true;
    error.value = '';

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: company.value.trim(),
      position: position.value.trim(),
      status: 'applied',
      dateApplied: new Date(dateApplied.value).toISOString(),
      notes: '',
      resumeFileName: resume.value?.name || '',
    };
    
    await emit('submit', newJob);
    
    // Reset form
    company.value = '';
    position.value = '';
    dateApplied.value = format(new Date(), 'yyyy-MM-dd');
    resume.value = null;
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  } catch (err) {
    error.value = 'Failed to add job application. Please try again.';
    console.error('Error submitting job:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitJob" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
        <input
          v-model="company"
          type="text"
          required
          placeholder="Enter company name"
          :disabled="isSubmitting"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                 shadow-sm focus:border-purple-500 focus:ring-purple-500
                 dark:bg-gray-700 dark:text-white h-[38px] px-4"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
        <input
          v-model="position"
          type="text"
          required
          placeholder="Enter job position"
          :disabled="isSubmitting"
          class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                 shadow-sm focus:border-purple-500 focus:ring-purple-500
                 dark:bg-gray-700 dark:text-white h-[38px] px-4"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Applied</label>
        <div class="relative">
          <input
            v-model="dateApplied"
            type="date"
            required
            :max="maxDate"
            :disabled="isSubmitting"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                   shadow-sm focus:border-purple-500 focus:ring-purple-500
                   dark:bg-gray-700 dark:text-white h-[38px] px-4
                   [&::-webkit-calendar-picker-indicator]:dark:invert
                   [&::-webkit-calendar-picker-indicator]:ml-2
                   [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume (Optional)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          @change="handleFileChange"
          :disabled="isSubmitting"
          class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            dark:file:bg-purple-900 dark:file:text-purple-300
            hover:file:bg-purple-100 dark:hover:file:bg-purple-800"
        />
      </div>
      
      <div class="flex items-end">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Adding...' : 'Add Application' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="mt-4 text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </form>
</template>
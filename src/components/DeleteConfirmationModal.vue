<script setup lang="ts">
defineProps<{
  show: boolean;
  jobCompany: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete the job application for <span class="font-semibold">{{ jobCompany }}</span>? This action cannot be undone.
      </p>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="emit('confirm')"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
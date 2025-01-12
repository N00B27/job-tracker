<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, parseISO, addYears } from 'date-fns';

const props = defineProps<{
  show: boolean;
  jobId: string;
  minDate: string;
  initialDetails?: string;
  initialDate?: string;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', jobId: string, details: string, offerDate: string): void;
}>();

const offerDetails = ref('');
const offerDate = ref(format(new Date(), 'yyyy-MM-dd'));
const showError = ref(false);

watch(() => props.show, (newValue) => {
  if (newValue) {
    if (props.isEditing && props.initialDetails && props.initialDate) {
      offerDetails.value = props.initialDetails;
      offerDate.value = format(parseISO(props.initialDate), 'yyyy-MM-dd');
    } else {
      offerDetails.value = '';
      offerDate.value = format(new Date(), 'yyyy-MM-dd');
    }
    showError.value = false;
  }
}, { immediate: true });

const applicationDate = computed(() => format(parseISO(props.minDate), 'yyyy-MM-dd'));
const maxDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');

const isValidDate = computed(() => {
  const selectedDate = parseISO(offerDate.value);
  const minDate = parseISO(props.minDate);
  const maxAllowedDate = addYears(new Date(), 1);
  return selectedDate >= minDate && selectedDate <= maxAllowedDate;
});

const handleSave = () => {
  if (!offerDetails.value.trim()) {
    showError.value = true;
    return;
  }
  
  if (isValidDate.value) {
    emit('save', props.jobId, offerDetails.value.trim(), `${offerDate.value}T00:00:00.000Z`);
  }
};

const handleClose = () => {
  showError.value = false;
  emit('close');
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h3 class="text-lg font-medium mb-4">
        {{ isEditing ? 'Edit Offer Details' : 'Offer Details' }}
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Offer Date</label>
          <input
            v-model="offerDate"
            type="date"
            :min="applicationDate"
            :max="maxDate"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                   focus:border-blue-500 focus:ring-blue-500 px-4 py-2
                   [&::-webkit-calendar-picker-indicator]:opacity-100
                   [&::-webkit-calendar-picker-indicator]:dark
                   [&::-webkit-calendar-picker-indicator]:ml-2
                   [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:hover:opacity-70"
          />
          <div v-if="!isValidDate" class="text-red-500 text-sm mt-1">
            Please select a date between the application date and one year from today
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Offer Information
          </label>
          <textarea
            v-model="offerDetails"
            rows="4"
            required
            placeholder="Enter offer amount and any additional details..."
            :class="{
              'mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2': true,
              'border-red-300': showError,
              'border-gray-300': !showError
            }"
          ></textarea>
          <div v-if="showError" class="text-red-500 text-sm mt-1">
            Please enter the offer information
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="handleClose"
          class="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          :disabled="!isValidDate"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>
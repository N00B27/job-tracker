<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';
import type { JobApplication } from '../types';
import StatusSelect from './StatusSelect.vue';

const props = defineProps<{
  jobs: JobApplication[];
}>();

const emit = defineEmits<{
  (e: 'delete-job', id: string): void;
  (e: 'status-change', jobId: string, status: JobApplication['status'], additionalData?: {
    interviewDate?: string;
    offerDetails?: string;
    offerDate?: string;
  }): void;
  (e: 'download-resume', jobId: string): void;
}>();

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const getJobStatus = (jobId: string) => {
  const job = props.jobs.find(j => j.id === jobId);
  return job?.status || 'applied';
};

const handleDelete = (jobId: string, company: string) => {
  emit('delete-job', jobId);
};

const handleStatusChange = (jobId: string, newStatus: JobApplication['status']) => {
  emit('status-change', jobId, newStatus);
};

const handleEditInterview = (jobId: string) => {
  emit('status-change', jobId, 'interviewing');
};

const handleEditOffer = (jobId: string) => {
  emit('status-change', jobId, 'offer');
};

const handleDownloadResume = (jobId: string) => {
  emit('download-resume', jobId);
};
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-3xl font-headers text-gray-900 dark:text-white mb-4">My Job Applications</h2>
    
    <!-- Mobile Card View -->
    <div class="md:hidden space-y-4">
      <div v-for="job in jobs" :key="job.id" 
           class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ job.company }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ job.position }}</p>
          </div>
          <button
            @click="handleDelete(job.id, job.company)"
            class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Applied:</span>
            <span class="text-sm text-gray-900 dark:text-gray-100">
              {{ formatDate(job.dateApplied) }}
            </span>
          </div>

          <div>
            <StatusSelect
              :model-value="getJobStatus(job.id)"
              :job-id="job.id"
              @status-change="(newStatus) => handleStatusChange(job.id, newStatus)"
            />
          </div>

          <div v-if="job.status === 'interviewing' && job.interviewDate" class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Interview:</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(job.interviewDate) }}
                  {{ format(new Date(job.interviewDate), 'HH:mm') }}
                </span>
                <button
                  @click="handleEditInterview(job.id)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div v-if="job.status === 'offer'" class="space-y-1">
            <div v-if="job.offerDate" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Offer Date:</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(job.offerDate) }}
              </span>
            </div>
            <div v-if="job.offerDetails" class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Details:</span>
                <button
                  @click="handleEditOffer(job.id)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
              </div>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ job.offerDetails }}</p>
            </div>
          </div>

          <div v-if="job.resumeFileName" class="flex justify-end">
            <button
              @click="handleDownloadResume(job.id)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
              :title="job.resumeFileName"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow table-fixed">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
            <th class="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
            <th class="w-1/10 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Applied</th>
            <th class="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="w-1/10 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
            <th class="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resume</th>
            <th class="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 text-gray-900 dark:text-gray-100 break-words">
              <div class="line-clamp-2">{{ job.company }}</div>
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-gray-100 break-words">
              <div class="line-clamp-2">{{ job.position }}</div>
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-gray-100">{{ formatDate(job.dateApplied) }}</td>
            <td class="px-6 py-4">
              <StatusSelect
                :model-value="getJobStatus(job.id)"
                :job-id="job.id"
                @status-change="(newStatus) => handleStatusChange(job.id, newStatus)"
              />
            </td>
            <td class="px-6 py-4">
              <div v-if="job.status === 'interviewing' && job.interviewDate" class="space-y-2">
                <div class="flex items-center space-x-2 break-words">
                  <span class="text-gray-900 dark:text-gray-100">
                     {{ formatDate(job.interviewDate) }}
                    {{ format(new Date(job.interviewDate), 'HH:mm') }}
                  </span>
                  <button
                    @click="handleEditInterview(job.id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div v-if="job.status === 'offer'" class="space-y-2">
                <div v-if="job.offerDate" class="text-gray-600 dark:text-gray-400 break-words">
                  {{ formatDate(job.offerDate) }}
                </div>
                <div v-if="job.offerDetails" class="flex items-start space-x-2">
                  <span class="text-gray-900 dark:text-gray-100 break-words">{{ job.offerDetails }}</span>
                  <button
                    @click="handleEditOffer(job.id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <button
                v-if="job.resumeFileName"
                @click="handleDownloadResume(job.id)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                :title="job.resumeFileName"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                [Resume]
              </button>
              <span v-else class="text-gray-400 dark:text-gray-500 text-sm">—</span>
            </td>
            <td class="px-6 py-4">
              <button
                @click="handleDelete(job.id, job.company)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { JobApplication } from './types';
import JobList from './components/JobList.vue';
import JobForm from './components/JobForm.vue';
import DeleteConfirmationModal from './components/DeleteConfirmationModal.vue';
import InterviewModal from './components/InterviewModal.vue';
import OfferModal from './components/OfferModal.vue';
import { getAllJobs, addJob, updateJob, deleteJob, getResume } from './lib/db';

const jobs = ref<JobApplication[]>([]);
const error = ref('');
const isLoading = ref(true);
const showDeleteModal = ref(false);
const showInterviewModal = ref(false);
const showOfferModal = ref(false);
const selectedJobId = ref<string | null>(null);
const jobToDelete = ref<{ id: string; company: string } | null>(null);

const loadJobs = async () => {
  try {
    isLoading.value = true;
    jobs.value = await getAllJobs();
  } catch (err) {
    console.error('Error loading jobs:', err);
    error.value = 'Failed to load job applications';
  } finally {
    isLoading.value = false;
  }
};

const handleAddJob = async (job: JobApplication) => {
  try {
    await addJob(job);
    await loadJobs();
  } catch (err) {
    throw err;
  }
};

const handleDeleteConfirm = async () => {
  if (!jobToDelete.value) return;
  
  try {
    await deleteJob(jobToDelete.value.id);
    await loadJobs();
  } catch (err) {
    console.error('Error deleting job:', err);
    error.value = 'Failed to delete job application';
  } finally {
    handleModalClose();
  }
};

const handleDeleteRequest = (jobId: string) => {
  const job = jobs.value.find(j => j.id === jobId);
  if (!job) return;
  
  jobToDelete.value = { id: jobId, company: job.company };
  showDeleteModal.value = true;
};

const handleModalClose = () => {
  showDeleteModal.value = false;
  showInterviewModal.value = false;
  showOfferModal.value = false;
  selectedJobId.value = null;
  jobToDelete.value = null;
};

const handleStatusChange = async (
  jobId: string, 
  status: JobApplication['status'], 
  additionalData?: { 
    interviewDate?: string; 
    offerDetails?: string;
    offerDate?: string;
  }
) => {
  try {
    const job = jobs.value.find(j => j.id === jobId);
    if (!job) return;

    if (status === 'interviewing' && !additionalData?.interviewDate) {
      selectedJobId.value = jobId;
      showInterviewModal.value = true;
      return;
    }

    if (status === 'offer' && !additionalData?.offerDetails) {
      selectedJobId.value = jobId;
      showOfferModal.value = true;
      return;
    }

    const updatedJob = {
      ...job,
      status,
      ...additionalData
    };

    await updateJob(updatedJob);
    await loadJobs();
  } catch (err) {
    console.error('Error updating job status:', err);
    error.value = 'Failed to update job status';
  }
};

const handleDownloadResume = async (jobId: string) => {
  try {
    const job = jobs.value.find(j => j.id === jobId);
    if (!job?.resumeFileName) return;

    const resume = await getResume(jobId);
    if (!resume) {
      error.value = 'Resume not found';
      return;
    }

    const url = URL.createObjectURL(resume);
    const link = document.createElement('a');
    link.href = url;
    link.download = job.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading resume:', err);
    error.value = 'Failed to download resume';
  }
};

onMounted(() => {
  loadJobs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -43.5 1111 1111" class="w-10 h-10">
          <path d="M380.342857 665.6v36.571429c0 48.274286 39.497143 87.771429 87.771429 87.771428h168.228571c48.274286 0 87.771429-39.497143 87.771429-87.771428v-36.571429h190.171428v-87.771429h-277.942857v87.771429H664.137143h-19.017143v-43.885714h-8.777143v80.457143h-168.228571v-80.457143h-1.462857v43.885714h-26.331429H468.114286v-87.771429h-270.628572v87.771429h182.857143z m533.942857-497.371429v610.011429h87.771429V168.228571c0-48.274286-39.497143-87.771429-87.771429-87.771428h-716.8c-48.274286 0-87.771429 39.497143-87.771428 87.771428h804.571428z m-716.8 716.8v-610.011428h-87.771428V885.028571c0 48.274286 39.497143 87.771429 87.771428 87.771429h716.8c48.274286 0 87.771429-39.497143 87.771429-87.771429h-87.771429-716.8z" fill="#0C92F2"/>
          <path d="M292.571429 256h526.628571v234.057143h-526.628571z" fill="#A8C8E6"/>
          <path d="M292.571429 256l263.314285 234.057143h-263.314285z" fill="#61B6F2"/>
          <path d="M555.885714 256h263.314286v234.057143z" fill="#FC830A"/>
        </svg>
        <h1 class="text-4xl font-headers text-gray-900 dark:text-white">Job Application Tracker</h1>
      </div>
      
      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
        {{ error }}
      </div>

      <div class="space-y-8">
        <JobForm @submit="handleAddJob" />
        <div v-if="isLoading" class="text-center py-4">
          <div class="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
        <JobList
          v-else
          :jobs="jobs"
          @delete-job="handleDeleteRequest"
          @status-change="handleStatusChange"
          @download-resume="handleDownloadResume"
        />
      </div>

      <DeleteConfirmationModal
        :show="showDeleteModal"
        :job-company="jobToDelete?.company || ''"
        @confirm="handleDeleteConfirm"
        @cancel="handleModalClose"
      />

      <InterviewModal
        v-if="selectedJobId"
        :show="showInterviewModal"
        :job-id="selectedJobId"
        :min-date="jobs.find(j => j.id === selectedJobId)?.dateApplied || ''"
        :initial-date="jobs.find(j => j.id === selectedJobId)?.interviewDate"
        :is-editing="!!jobs.find(j => j.id === selectedJobId)?.interviewDate"
        @close="handleModalClose"
        @save="(jobId, date) => {
          handleStatusChange(jobId, 'interviewing', { interviewDate: date });
          handleModalClose();
        }"
      />

      <OfferModal
        v-if="selectedJobId"
        :show="showOfferModal"
        :job-id="selectedJobId"
        :min-date="jobs.find(j => j.id === selectedJobId)?.dateApplied || ''"
        :initial-details="jobs.find(j => j.id === selectedJobId)?.offerDetails"
        :initial-date="jobs.find(j => j.id === selectedJobId)?.offerDate"
        :is-editing="!!jobs.find(j => j.id === selectedJobId)?.offerDetails"
        @close="handleModalClose"
        @save="(jobId, details, date) => {
          handleStatusChange(jobId, 'offer', { offerDetails: details, offerDate: date });
          handleModalClose();
        }"
      />
    </div>
  </div>
</template>
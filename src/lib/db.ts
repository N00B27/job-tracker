import { openDB, type IDBPDatabase } from 'idb';
import type { JobApplication } from '../types';

const DB_NAME = 'job-tracker';
const STORE_NAME = 'jobs';
const RESUME_STORE = 'resumes';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase>;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const jobStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          jobStore.createIndex('dateApplied', 'dateApplied');
        }
        if (!db.objectStoreNames.contains(RESUME_STORE)) {
          db.createObjectStore(RESUME_STORE);
        }
      },
      blocked() {
        console.log('Database upgrade was blocked');
      },
      blocking() {
        console.log('Database is blocking upgrades');
      },
      terminated() {
        console.error('Database connection was terminated');
      }
    });
  }
  return dbPromise;
};

// Helper function to sort jobs by date applied
const sortJobsByDate = (jobs: JobApplication[]): JobApplication[] => {
  return [...jobs].sort((a, b) => 
    new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
  );
};

export async function getAllJobs(): Promise<JobApplication[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const jobs = await store.getAll();
    await transaction.done;
    return sortJobsByDate(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function addJob(job: JobApplication, resumeFile?: File): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction([STORE_NAME, RESUME_STORE], 'readwrite');
    
    await tx.objectStore(STORE_NAME).add(job);
    
    if (resumeFile && job.resumeFileName) {
      await tx.objectStore(RESUME_STORE).put(resumeFile, job.id);
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error adding job:', error);
    throw new Error('Failed to add job application');
  }
}

export async function updateJob(job: JobApplication): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).put(job);
    await tx.done;
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job application');
  }
}

export async function deleteJob(id: string): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction([STORE_NAME, RESUME_STORE], 'readwrite');
    await tx.objectStore(STORE_NAME).delete(id);
    await tx.objectStore(RESUME_STORE).delete(id);
    await tx.done;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job application');
  }
}

export async function getResume(jobId: string): Promise<File | null> {
  try {
    const db = await initDB();
    const tx = db.transaction(RESUME_STORE, 'readonly');
    const resume = await tx.objectStore(RESUME_STORE).get(jobId);
    await tx.done;
    return resume;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}
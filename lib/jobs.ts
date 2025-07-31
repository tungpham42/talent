import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Job } from "@/types";

export const addJob = async (job: Omit<Job, "id">): Promise<void> => {
  await addDoc(collection(db, "jobs"), job);
};

export const getJobs = async (): Promise<Job[]> => {
  const snapshot = await getDocs(collection(db, "jobs"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Job, "id">),
  }));
};

export const getJobById = async (id: string) => {
  const docRef = doc(db, "jobs", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateJob = async (id: string, data: Partial<Job>) => {
  const ref = doc(db, "jobs", id);
  await updateDoc(ref, data);
};

export const deleteJob = async (jobId: string): Promise<void> => {
  const jobRef = doc(db, "jobs", jobId);
  await deleteDoc(jobRef);
};

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
import { Interview } from "@/types";

export const addInterview = async (
  interview: Omit<Interview, "id">
): Promise<void> => {
  await addDoc(collection(db, "interviews"), interview);
};

export const getInterviews = async (): Promise<Interview[]> => {
  const snapshot = await getDocs(collection(db, "interviews"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Interview, "id">),
  }));
};

export const getInterviewById = async (id: string) => {
  const docRef = doc(db, "interviews", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateInterview = async (
  id: string,
  updates: { date?: Date; notes?: string }
) => {
  const ref = doc(db, "interviews", id);
  await updateDoc(ref, {
    ...updates,
    date: updates.date ? updates.date.toISOString() : undefined,
  });
};

export const deleteInterview = async (id: string) => {
  await deleteDoc(doc(db, "interviews", id));
};

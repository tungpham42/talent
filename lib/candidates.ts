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
import { Candidate } from "@/types";

export const addCandidate = async (
  candidate: Omit<Candidate, "id">
): Promise<void> => {
  await addDoc(collection(db, "candidates"), candidate);
};

export const getCandidates = async (): Promise<Candidate[]> => {
  const snapshot = await getDocs(collection(db, "candidates"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Candidate, "id">),
  }));
};

export const getCandidateById = async (id: string) => {
  const docRef = doc(db, "candidates", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateCandidate = async (id: string, data: Partial<Candidate>) => {
  const ref = doc(db, "candidates", id);
  await updateDoc(ref, data);
};

export const deleteCandidate = async (id: string) => {
  await deleteDoc(doc(db, "candidates", id));
};

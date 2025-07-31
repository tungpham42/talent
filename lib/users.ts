import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@/types";

export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...(doc.data() as Omit<User, "uid">),
  }));
};

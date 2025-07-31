import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getUserRole = async (
  uid: string
): Promise<"admin" | "staff" | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().role;
  }
  return null;
};

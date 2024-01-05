import { db } from './firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Profile } from '../types';

const PROFILE_COLLECTION = 'profiles';

export const addProfile = async ({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) => {
  await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
};

export const hasProfile = async (userId: string) => {
  const docRef = doc(db, PROFILE_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

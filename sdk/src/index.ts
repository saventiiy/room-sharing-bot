import { db } from './firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Profile, Room } from 'types/src';

const PROFILE_COLLECTION = 'profiles';
const ROOM_COLLECTION = 'rooms';

export const addProfile = async ({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) => {
  await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });

  return profile;
};

export const hasProfile = async (userId: string) => {
  const docRef = doc(db, PROFILE_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

export const addRoom = async ({ userId, room }: {
  userId: string;
  room: Room;
}) => {
  await setDoc(doc(db, ROOM_COLLECTION, userId), { ...room });

  return room;
};
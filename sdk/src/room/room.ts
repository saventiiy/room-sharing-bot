import { db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Profile, Room } from 'types/src';

const PROFILE_COLLECTION = 'profiles';
const ROOM_COLLECTION = 'rooms';

export const addRoom = async ({ userId, room }: {
  userId: string;
  room: Room;
}) => {
  await setDoc(doc(db, ROOM_COLLECTION, userId), { ...room });

  return room;
};
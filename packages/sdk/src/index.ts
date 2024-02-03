import { db } from './firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Profile, Room } from 'types';

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

export const getProfile = async (userId: string) => {
  const docRef = doc(db, PROFILE_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    const profileData = docSnap.data();
    const profile: Profile = {
      id: profileData.id,
      createdAt: profileData.createdAt,
      updatedAt: profileData.updatedAt,
      name: profileData.name,
      dateofbirth: profileData.dateofbirth,
      gender: profileData.gender,
      photos: profileData.photos,
      bio: profileData.bio,
      lookingFor: profileData.lookingFor
    }
    return profile;
  } else {
    return null;
  }
};

export const addRoom = async ({
  userId,
  room,
}: {
  userId: string;
  room: Room;
}) => {
  await setDoc(doc(db, ROOM_COLLECTION, userId), { ...room });

  return room;
};

export const hasRoom = async (userId: string) => {
  const docRef = doc(db, ROOM_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

export const getRoom = async (userId: string) => {
  const docRef = doc(db, ROOM_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    const roomData = docSnap.data();
    const room: Room = {
      id: roomData.id,
      createdAt: roomData.createdAt,
      updatedAt: roomData.updatedAt,
      address: roomData.address,
      district: roomData.district,
      photos: roomData.photos,
      description: roomData.description,
      price: roomData.price,
      likes: roomData.likes
    }
    return room;
  } else {
    return null;
  }
};

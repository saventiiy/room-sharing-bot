import { db } from './firebase';
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore';
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
    const profile = docSnap.data() as Profile;
    return profile;
  } else {
    return null;
  }
};

export const getPotentialUser = async(currentUserId: string) => {
  const profile = await getProfile(currentUserId);
  const position = profile?.searchingPointer || 0;
  const dbQuery = query(collection(db, PROFILE_COLLECTION), orderBy('createdAt'), limit(position + 1));

  const querySnapshot = await getDocs(dbQuery);
  const potentialUsers = querySnapshot.docs
    .map(doc => doc.data())
    .filter(potentialUser => potentialUser.id !== profile?.likes && potentialUser.id !== currentUserId);

  if (position < potentialUsers.length && profile != undefined) {
    const potentialUserData = potentialUsers[position];
    const potentialUser = potentialUserData as Profile;
    console.log(potentialUser);
    
    profile.searchingPointer += 1;
    await setDoc(doc(db, PROFILE_COLLECTION, currentUserId), { ...profile });

    return potentialUser;
  } else {
    console.log(`No user found at position ${position} excluding yourself`);
    return null;
  }
};

export const like = async(userId: string, likedUserId: string) => {
  const profile = await getProfile(userId);
  const likedProfile = await getProfile(likedUserId);
  const isMatch = likedProfile?.likes.some(likedId => likedId === userId)

  if(isMatch){
    profile?.matches.push(likedUserId);
    likedProfile?.matches.push(userId);
    await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    await setDoc(doc(db, PROFILE_COLLECTION, likedUserId), { ...likedProfile });
  } else {
    const isAlreadyLiked = profile?.likes.some(likedId => likedId === likedUserId)

    if(!isAlreadyLiked){
      profile?.likes.push(likedUserId);
      await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    }
  }
  console.log(profile);
  return profile;
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
    const room = docSnap.data() as Room;
    return room;
  } else {
    return null;
  }
};

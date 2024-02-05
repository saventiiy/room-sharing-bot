import { db } from './firebase';
import { setDoc, doc, getDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Profile, Room } from 'types';
import { collection } from 'firebase/firestore';

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
      lookingFor: profileData.lookingFor,
      searchingPointer: profileData.searchingPointer,
      likes: profileData.likes, 
      matches: profileData.matches
    }
    return profile;
  } else {
    return null;
  }
};

//should add excluding myself and already liked profiles
// const dbQuery = query(collection(db, PROFILE_COLLECTION),  where('title', '==', currentUserId), limit(position + 1));
export const getPotentialUser = async(currentUserId: string) => {
  const profile = await getProfile(currentUserId);
  const position = profile?.searchingPointer || 0;
  const dbQuery = query(collection(db, PROFILE_COLLECTION), orderBy('createdAt'), limit(position + 1));
  const querySnapshot = await getDocs(dbQuery);
  const users = querySnapshot.docs
  .map(doc => doc.data())
  .filter(user => user.id !== profile?.likes);

  if (position < users.length && profile != undefined) {
    const user = users[position];
    const potentialUser: Profile = {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      dateofbirth: user.dateofbirth,
      gender: user.gender,
      photos: user.photos,
      bio: user.bio,
      lookingFor: user.lookingFor,
      searchingPointer: user.searchingPointer,
      likes: user.likes,
      matches: user.matches
    }
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
  const isMatch = likedProfile?.likes.some(likedId => likedId == userId)
  if(isMatch){
    profile?.matches.push(likedUserId);
    likedProfile?.matches.push(userId);
    await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    await setDoc(doc(db, PROFILE_COLLECTION, likedUserId), { ...likedProfile });
  } else {
    const isAlreadyLiked = profile?.likes.some(likedId => likedId == likedUserId)
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

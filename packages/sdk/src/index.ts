import { db } from './firebase';
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { LookingFor, Profile, Room, PotentialData} from 'types';

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
  let position = profile?.searchingPointer || 0;
  const dbQuery = query(collection(db, PROFILE_COLLECTION), orderBy('createdAt'), limit(position + 1));

  const querySnapshot = await getDocs(dbQuery);
  const potentialUsers = querySnapshot.docs
    .map(doc => doc.data() as Profile)
    .filter(potentialUser => potentialUser.id !== profile?.id 
      // && !profile?.likes.includes(potentialUser.id)
      && !profile?.matches.includes(potentialUser.id));

  if (position < potentialUsers.length && profile != undefined) {
    profile.searchingPointer += 1;
    await setDoc(doc(db, PROFILE_COLLECTION, currentUserId), { ...profile });

    const potentialUser = potentialUsers[position] as Profile;
    return returnProfile(potentialUser, currentUserId);
  } else {
    console.log(`No user found at position ${position} excluding yourself`);
    return { profile: null, room: null };
  }
};

const returnProfile = async(potentialUser: Profile, currentUserId: string) => {
  if(potentialUser.lookingFor === LookingFor.Flatmate){
    const room = await getRoom(currentUserId) as Room;
    return { profile: potentialUser, room: room };
  } else {
    return { profile: potentialUser, room: null };
  }
};

export const like = async(userId: string, likedUserId: string) => {
  const profile = await getProfile(userId);
  const likedProfile = await getProfile(likedUserId);
  const isMatch = likedProfile?.likes.includes(userId);

  if(isMatch){
    profile?.likes.push(likedUserId);
    profile?.matches.push(likedUserId);
    likedProfile?.matches.push(userId);
    await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    await setDoc(doc(db, PROFILE_COLLECTION, likedUserId), { ...likedProfile });
    return true;
  } else {
    const isAlreadyLiked = profile?.likes.includes(likedUserId);

    if(!isAlreadyLiked){
      profile?.likes.push(likedUserId);
      await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    }
    return false;
  }
};

export const getMatched = async (userId: string) => {
  const profile = await getProfile(userId);
  if (profile != undefined) {
    if (profile.matches.length !== 0) {
      const potentialDataList: PotentialData[] = [];
      for (const matchedId of profile.matches) {
        const matchedProfile = await getProfile(matchedId);
        let potentialData: PotentialData = {
          profile: matchedProfile,
          room: null
        };
        if (matchedProfile != undefined && matchedProfile.lookingFor == LookingFor.Flatmate) {
          const room = await getRoom(userId);
          potentialData.room = room;
        }
        potentialDataList.push(potentialData);
      }
      return potentialDataList;
    } else {
      return [];
    }
  } else {
    return [];
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
    const room = docSnap.data() as Room;
    return room;
  } else {
    return null;
  }
};

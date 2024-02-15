import { db } from './firebase';
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { LookingFor, Profile, Room, PotentialData, Viewed} from 'types';
import { getStorage, ref, uploadBytes } from "firebase/storage";

const PROFILE_COLLECTION = 'profiles';
const ROOM_COLLECTION = 'rooms';
const VIEWED_COLLECTION = 'viewed';

export const addProfile = async ({
  userId,
  profile,
}: {
  userId: string;
  profile: Profile;
}) => {
  await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
  await addViewed({userId: userId,
     viewed: new Viewed({      
      id: userId, 
      viewedIds: []
    })});
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

export const addViewed = async ({
  userId,
  viewed,
}: {
  userId: string;
  viewed: Viewed;
}) => {
  await setDoc(doc(db, VIEWED_COLLECTION, userId), { ...viewed });

  return viewed;
};

export const getViewedProfiles = async (userId: string) => {
  const docRef = doc(db, VIEWED_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    const viewedIds = docSnap.data() as Viewed;
    return viewedIds;
  } else {
    return null;
  }
};

export const addViewedId = async (viewedProfile: Viewed, userId: string, viewedId: string) => {
  viewedProfile.viewedIds.push(viewedId);
  await setDoc(doc(db, VIEWED_COLLECTION, userId), { ...viewedProfile });
  return viewedProfile;
};


export const getPotentialUser = async(currentUserId: string) => {
  const profile = await getProfile(currentUserId);
  const viewedProfiles = await getViewedProfiles(currentUserId);
  
  const dbQuery = query(collection(db, PROFILE_COLLECTION), orderBy('createdAt'));

  const querySnapshot = await getDocs(dbQuery);
  const potentialUsers = querySnapshot.docs
    .map(doc => doc.data() as Profile)
    .filter(potentialUser => potentialUser.id !== profile?.id 
      && !viewedProfiles?.viewedIds.includes(potentialUser.id)
      && !profile?.likes.includes(potentialUser.id)
      && !profile?.matches.includes(potentialUser.id));

  if (potentialUsers.length > 0 && profile != undefined && viewedProfiles != undefined) {
    const potentialUser = potentialUsers[0] as Profile;
    addViewedId(viewedProfiles, currentUserId, potentialUser.id);

    return returnProfile(potentialUser);
  } else {
    console.log(`No user found at position ${0} excluding yourself`);
    return { profile: null, room: null };
  }
};

const returnProfile = async(potentialUser: Profile) => {
  if(potentialUser.lookingFor === LookingFor.Flatmate){
    const room = await getRoom(potentialUser.id) as Room;
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
          const room = await getRoom(matchedProfile.id);
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

export const saveMultiplePhotosForProfile = async (userId: string, type: string, files: File[]) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${type}/${userId}`);

  if (files !== null && files !== undefined && files.length !== 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${i}_${file.name}`;
      const fileRef = ref(storageRef, filePath);
      uploadBytes(fileRef, file).then(() => {
        console.log('Uploaded');
      });
    }
  }
};
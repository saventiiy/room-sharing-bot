import { db, firebaseApp } from './firebase';
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { LookingFor, Profile, Room, PotentialData, Viewed } from 'types';
import {
  listAll,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import Compressor from 'compressorjs';

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
  await addViewed({
    userId: userId,
    viewed: new Viewed({
      id: userId,
      viewedIds: [],
    }),
  });
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

  if (docSnap.exists()) {
    return docSnap.data() as Profile;
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

  if (docSnap.exists()) {
    const viewedIds = docSnap.data() as Viewed;
    return viewedIds;
  } else {
    return null;
  }
};

export const addViewedId = async (
  viewedProfile: Viewed,
  userId: string,
  viewedId: string,
) => {
  viewedProfile.viewedIds.push(viewedId);
  await setDoc(doc(db, VIEWED_COLLECTION, userId), { ...viewedProfile });
  return viewedProfile;
};

export const getPotentialUser = async (currentUserId: string) => {
  const profile = await getProfile(currentUserId);
  const viewedProfiles = await getViewedProfiles(currentUserId);

  const dbQuery = query(
    collection(db, PROFILE_COLLECTION),
    orderBy('createdAt'),
  );

  const querySnapshot = await getDocs(dbQuery);
  //added to show 
  const potentialUsers = querySnapshot.docs
  .map((doc) => doc.data() as Profile)
  .filter((potentialUser) => {
    const notCurrentUser = potentialUser.id !== profile?.id;

    let matchingLookingFor = true;
    if (profile?.lookingFor === LookingFor.Flatmate) {
      matchingLookingFor = potentialUser.lookingFor === LookingFor.Room;
    }

    const notViewed = !viewedProfiles?.viewedIds.includes(potentialUser.id);
    const notLiked = !profile?.likes.includes(potentialUser.id);
    const notMatched = !profile?.matches.includes(potentialUser.id);

    return notCurrentUser && matchingLookingFor && notViewed && notLiked && notMatched;
  });

  if (
    potentialUsers.length > 0 &&
    profile != undefined &&
    viewedProfiles != undefined
  ) {
    const potentialUser = potentialUsers[0] as Profile;
    await addViewedId(viewedProfiles, currentUserId, potentialUser.id);

    return returnProfile(potentialUser);
  } else {
    await addViewed({
      userId: currentUserId,
      viewed: new Viewed({
        id: currentUserId,
        viewedIds: [],
      }),
    });
    return { profile: null, room: null };
  }
};

const returnProfile = async (potentialUser: Profile) => {
  if (potentialUser.lookingFor === LookingFor.Flatmate) {
    const room = (await getRoom(potentialUser.id)) as Room;
    return { profile: potentialUser, room: room };
  } else {
    return { profile: potentialUser, room: null };
  }
};

export const like = async (userId: string, likedUserId: string) => {
  const profile = await getProfile(userId);
  const likedProfile = await getProfile(likedUserId);
  const isMatch = likedProfile?.likes.includes(userId);

  if (isMatch) {
    profile?.likes.push(likedUserId);
    profile?.matches.push(likedUserId);
    likedProfile?.matches.push(userId);
    await setDoc(doc(db, PROFILE_COLLECTION, userId), { ...profile });
    await setDoc(doc(db, PROFILE_COLLECTION, likedUserId), { ...likedProfile });
    return true;
  } else {
    const isAlreadyLiked = profile?.likes.includes(likedUserId);

    if (!isAlreadyLiked) {
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
          room: null,
        };
        if (
          matchedProfile != undefined &&
          matchedProfile.lookingFor === LookingFor.Flatmate
        ) {
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

  if (docSnap.exists()) {
    const room = docSnap.data() as Room;
    return room;
  } else {
    return null;
  }
};

export const saveMultiplePhotosForProfile = async (
  userId: string,
  type: string,
  files: File[],
) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${type}s/${userId}`);

  if (files && files.length !== 0) {
    await Promise.all(files.map(async (file, index) => {
      const filePath = `${index}_${file.name}`;
      const fileRef = ref(storageRef, filePath);
      const compressedFile = await compress(file);
      if(compressedFile){
        return await uploadBytes(fileRef, compressedFile!);
      } else {
        return await uploadBytes(fileRef, file);
      }
    }));
  }
};

const compress = async (file: File) => {
  try {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        maxHeight: 600,
        success: (result) => resolve(result),
        error: (err) => reject(err),
      });
    });
    return compressedFile as File;
  } catch (error) {
    console.error('Error compressing:', error);
    return null;
  }
};

export const getPhotos = async (userId: string, type: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${type}s/${userId}`);
  const photoUrls: string[] = [];

  try {
    const filesList = await listAll(storageRef);

    for (const fileRef of filesList.items) {
      const url = await getDownloadURL(fileRef);
      photoUrls.push(url);
    }

    console.log(photoUrls);

    return photoUrls;
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
};

export const uploadFile = async (file: Blob | File, name: string) => {
  console.log('uploadFile', file);
  const storage = getStorage();
  const storageRef = ref(storage, name);

  await uploadBytes(storageRef, file);
};

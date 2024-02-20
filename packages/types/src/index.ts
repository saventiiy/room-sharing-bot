import type { Timestamp } from 'firebase/firestore';
import { BaseDocument, getTimestamp } from 'firebase-utils';
import dayjs from 'dayjs';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum LookingFor {
  Room = 'Room',
  Flatmate = 'Flatmate',
}

export enum Districts {
  Bemowo = 'Bemowo',
  Bialoleka = 'Bialoleka',
  Bielany = 'Bielany',
  Mokotow = 'Mokotow',
  Ochota = 'Ochota',
  PragaPolnoc = 'Praga Polnoc',
  PragaPoludnie = 'Praga Poludnie',
  Rembertow = 'Rembertow',
  Sluzewiec = 'Sluzewiec',
  Ursus = 'Ursus',
  Ursynow = 'Ursynow',
  Wawer = 'Wawer',
  Wlochy = 'Wlochy',
  Wola = 'Wola',
  Zoliborz = 'Zoliborz',
}

export enum PhotoType {
  Profile = 'profile',
  Room = 'room'
}

export interface Viewed extends BaseDocument {
  id: string;
  viewedIds: string[];
}

export class Viewed extends BaseDocument implements Viewed {
  constructor({
    id, 
    viewedIds = [],
    createdAt = getTimestamp(),
    updatedAt = getTimestamp()
  }: {
    id: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    viewedIds: string[];
  }){
    super({ createdAt, updatedAt });
    this.id = id;
    this.viewedIds = viewedIds;
  }
}

export interface Profile extends BaseDocument {
  id: string;
  username: string;
  name: string;
  dateofbirth: Timestamp;
  gender: Gender;
  photos: string[];
  bio: string;
  lookingFor: LookingFor;
  searchingPointer: number;
  likes: string[];
  matches: string[];
}

export class Profile extends BaseDocument implements Profile {
  constructor({
    id,
    createdAt = getTimestamp(),
    updatedAt = getTimestamp(),
    username,
    name,
    dateofbirth,
    gender,
    photos = [],
    bio,
    lookingFor,
    searchingPointer,
    likes = [],
    matches = [],
  }: {
    id: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    username: string;
    name: string;
    dateofbirth: Timestamp;
    gender: Gender;
    photos: string[];
    bio: string;
    lookingFor: LookingFor;
    searchingPointer: number;
    likes: string[];
    matches: string[];
  }) {
    super({ createdAt, updatedAt });
    this.id = id;
    this.username = username;
    this.name = name;
    this.dateofbirth = dateofbirth;
    this.gender = gender;
    this.photos = photos;
    this.bio = bio;
    this.lookingFor = lookingFor;
    this.searchingPointer = searchingPointer;
    this.likes = likes;
    this.matches = matches;
  }
}

export interface Room extends BaseDocument {
  id: string;
  address: string;
  district: Districts;
  photos: string[];
  description: string;
  price: number;
  likes: string[];
}

export class Room extends BaseDocument implements Room {
  constructor({
    id,
    createdAt = getTimestamp(),
    updatedAt = getTimestamp(),
    address,
    district,
    photos = [],
    description,
    price,
    likes = [],
  }: {
    id: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    address: string;
    district: Districts;
    photos: string[];
    description: string;
    price: number;
    likes: string[];
  }) {
    super({ createdAt, updatedAt });
    this.id = id;
    this.address = address;
    this.district = district;
    this.photos = photos;
    this.description = description;
    this.price = price;
    this.likes = likes;
  }
}

export interface PotentialData {
  profile: Profile | null;
  room: Room | null;
}

//is it ok, to move it here?
// i needed a fb modules
export const getAge = (birthDate: Timestamp) => {
  const currentDate = dayjs();
  const bDay = dayjs.unix(birthDate.seconds);
  return Math.floor(currentDate.diff(bDay, 'year', true));;
};

import type { Timestamp } from 'firebase/firestore';
import { getId } from 'utils';
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

export interface Profile extends BaseDocument {
  name: string;
  dateofbirth: Timestamp;
  gender: Gender;
  photos: string[];
  bio: string;
  lookingFor: LookingFor;
}

export class Profile extends BaseDocument implements Profile {
  constructor({
    id = getId(),
    createdAt = getTimestamp(),
    updatedAt = getTimestamp(),
    name,
    dateofbirth,
    gender,
    photos = [],
    bio,
    lookingFor,
  }: {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    name: string;
    dateofbirth: Timestamp;
    gender: Gender;
    photos: string[];
    bio: string;
    lookingFor: LookingFor;
  }) {
    super({ id, createdAt, updatedAt });
    this.name = name;
    this.dateofbirth = dateofbirth;
    this.gender = gender;
    this.photos = photos;
    this.bio = bio;
    this.lookingFor = lookingFor;
  }
}

export interface Room extends BaseDocument {
  address: string;
  district: Districts;
  photos: string[];
  description: string;
  price: number;
  likes: string[];
}

export class Room extends BaseDocument implements Room {
  constructor({
    id = getId(),
    createdAt = getTimestamp(),
    updatedAt = getTimestamp(),
    address,
    district,
    photos = [],
    description,
    price,
    likes = [],
  }: {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    address: string;
    district: Districts;
    photos: string[];
    description: string;
    price: number;
    likes: string[];
  }) {
    super({ id, createdAt, updatedAt });
    this.address = address;
    this.district = district;
    this.photos = photos;
    this.description = description;
    this.price = price;
    this.likes = likes;
  }
}

export interface Roommate extends BaseDocument {
  description: string;
  likes: string[];
}

export class Roommate extends BaseDocument implements Roommate {
  constructor({
    id = getId(),
    createdAt = getTimestamp(),
    updatedAt = getTimestamp(),
    description,
    likes = [],
  }: {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    description: string;
    likes: string[];
  }) {
    super({ id, createdAt, updatedAt });
    this.description = description;
    this.likes = likes;
  }
}

//is it ok, to move it here?
// i needed a fb modules
export const getAge = (birthDate: Timestamp) => {
  const currentDate = dayjs();
  const bDay = dayjs.unix(birthDate.seconds);
  return Math.floor(currentDate.diff(bDay, 'year', true));;
};

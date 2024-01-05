import { nanoid } from 'nanoid';

export const getId = (length: number = 28) => nanoid(length);

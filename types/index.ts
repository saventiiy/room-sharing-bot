export class Profile {
  userId: string;
  name: string;

  constructor({ userId, name }: { userId: string; name: string }) {
    this.userId = userId;
    this.name = name;
  }
}

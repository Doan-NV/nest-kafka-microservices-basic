export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAmbassador: boolean;
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

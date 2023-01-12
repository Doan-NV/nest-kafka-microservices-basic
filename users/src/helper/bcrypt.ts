import * as bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
export class BcryptHelper {
  static async hasPassword(password: string) {
    const hasPassword = await bcrypt.hashSync(password, salt);
    return hasPassword;
  }
  static async comparePassword(password: string) {
    const isCompare = await bcrypt.compareSync(password, salt);
    return isCompare;
  }
}

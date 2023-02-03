import * as bcrypt from 'bcrypt';
import { ErrorHelper } from './error';

export class BcryptHelper {
  static async hash(str: string) {
    return await bcrypt.hash(str, 12);
  }
  static async compare(str: string, hash: string) {
    try {
      return bcrypt.compare(str, hash);
    } catch (error) {
      ErrorHelper.UnauthorizedException('password not match');
    }
  }
}

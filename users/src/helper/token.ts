import * as jwt from 'jsonwebtoken';
import { ErrorHelper } from './error';

export class TokenHelper {
  /**
   * Signs token helper
   * @param payload - your json object
   * @param secret - your private hash
   * @param expiresIn - seconds
   * @returns
   */
  static generateToken(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string
  ): {
    token: string;
    expires: number;
  } {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    return {
      token,
      expires: decoded.iat,
    };
  }
  static verifyToken(token: string, secret: string): any {
    try {
      const user = jwt.verify(token, secret);
      return user;
    } catch (error) {
      ErrorHelper.UnauthorizedException('token expired');
    }
  }
}

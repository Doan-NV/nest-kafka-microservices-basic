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

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

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

  static generateOTP(): string {
    // Declare a digits variable
    // which stores all digits
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
}

import * as jwt from 'jsonwebtoken';

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
    expiresIn: string,
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
    const user = jwt.verify(token, secret);
    console.log('user: ', user);

    return user;
  }
}

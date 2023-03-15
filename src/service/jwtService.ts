import * as jwt from 'jsonwebtoken';
import config from '../config';

export type ShortUrlJwtPayload = jwt.JwtPayload & {
  userId: string,
};

class JWTService {
  secret;
  constructor () {
    this.secret = config.JWT_SECRET;
  }

  public createJWTToken = (data: {
    userId: string,
  }): string => {
    const token = jwt.sign(data, this.secret, { expiresIn: 60 * 10 * 1000 });

    return token;
  }

  public verifyJWTToken = (token: string) => {
    jwt.verify(token, this.secret, { complete: true });
  }

  public decodeJWTToken = (token: string): string | jwt.JwtPayload => {
    return jwt.decode(token);
  }

}

export default new JWTService();

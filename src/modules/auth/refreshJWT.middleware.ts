import * as Koa from 'koa';
import JWTService, { ShortUrlJwtPayload } from '../../service/jwtService';

const refreshJWTToken = async (ctx: Koa.Context, next: Koa.Next) => {
  if (ctx.header && ctx.header.authorization) {
    const [scheme, token] = ctx.header.authorization.split(' ');

    if (scheme && token) {
      if (/^Bearer$/i.test(scheme)) {
        try {
          JWTService.verifyJWTToken(token);
        } catch (error) {
          const user = JWTService.decodeJWTToken(token) as ShortUrlJwtPayload;
          const newToken = JWTService.createJWTToken({ userId: user.userId });
          ctx.res.setHeader('Authorization', newToken);
        }
      }
    }
  }

  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = 'Protected resource';
    } else {
      throw err;
    }
  });
};

export default refreshJWTToken;

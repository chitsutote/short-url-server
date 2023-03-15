import * as Koa from 'koa';
import JWTService, { ShortUrlJwtPayload } from '../../service/jwtService';

const getUserIdMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const isAuthRelatedPath = [/^\/login/, /^\/signup/, /^\/\w{6}$/].some(path => path.test(ctx.path));
  if (isAuthRelatedPath) return next();

  const {
    header: {
      authorization,
    },
  } = ctx.request as Koa.Request & { authorization: string };
  const [__, token] = authorization.split(' ');
  const user = JWTService.decodeJWTToken(token) as ShortUrlJwtPayload;

  ctx.userId = user.userId;

  return next();
};

export default getUserIdMiddleware;

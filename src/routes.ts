import * as combineRouters from 'koa-combine-routers';
import shortUrlRouter from './modules/short-url/short-url.controller';
import authRouter from './modules/auth/auth.controller';
import shortUrlRedirectRouter from './modules/redirect/redirect.controller';

const router = combineRouters(
  authRouter,
  shortUrlRouter,
  shortUrlRedirectRouter,
);

export default router;

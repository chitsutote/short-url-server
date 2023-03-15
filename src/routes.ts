import * as combineRouters from 'koa-combine-routers';
import shortUrlRouter from './modules/short-url/short-url.controller';
import authRouter from './modules/auth/auth.controller';
import rootRouter from './root.controller';

const router = combineRouters(
  authRouter,
  shortUrlRouter,
  rootRouter,
);

export default router;

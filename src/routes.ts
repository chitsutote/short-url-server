import * as combineRouters from 'koa-combine-routers';
import shortUrlRouter from './modules/short-url/short-url.controller';
import rootRouter from './root.controller';

const router = combineRouters(
  shortUrlRouter,
  rootRouter,
);

export default router;

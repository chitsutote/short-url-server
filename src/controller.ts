import * as Koa from 'koa';
import * as Router from 'koa-router';

const router: Router = new Router();

router.get('/', async (ctx:Koa.Context) => {
  ctx.body = 'Hello';
});

export default router;

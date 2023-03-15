import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { StatusCodes } from 'http-status-codes';
import * as koaJwt from 'koa-jwt';
const cors = require('@koa/cors');
import config from './config';
import routers from './routes';
import refreshJWTToken from './modules/auth/refreshJWT.middleware';
import getUserIdMiddleware from './modules/auth/getUserId.middleware';

const app:Koa = new Koa();

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

app.use(cors({
  origin: 'http://127.0.0.1:5173',
  exposeHeaders: ['authorization'],
  maxAge: 3000,
}));
app.use(bodyParser());
app.use(refreshJWTToken);
app.use(koaJwt({ secret: config.JWT_SECRET }).unless({
  path: [/^\/login/, /^\/signup/, /^\/\w{6}$/],
}));
app.use(getUserIdMiddleware);
app.use(routers());

app.on('error', console.error);

export default app;

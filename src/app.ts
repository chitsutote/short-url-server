import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { StatusCodes } from 'http-status-codes';
const cors = require('@koa/cors');
import routers from './routes';

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
}));
app.use(bodyParser());
app.use(routers());

app.on('error', console.error);

export default app;

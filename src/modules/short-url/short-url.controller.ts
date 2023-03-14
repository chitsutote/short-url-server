import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import * as moment from 'moment';
import appDataSource from '../../appDataSource';
import { cryptoRandomString } from '../../utils/random';
import shortUrlEntity from './short-url.entity';

const shortUrlRepository: Repository<shortUrlEntity> = appDataSource.getRepository(shortUrlEntity);

const router: Router = new Router();

router.post('/short-url', async (ctx:Koa.Context) => {
  const { url } = ctx.request.body as { url: string };

  const shortId = cryptoRandomString({ length: 6, type: 'alphanumeric' });

  const shortUrlRecord = await shortUrlRepository.create({
    short_id: shortId,
    original_url: url,
    expired_at: moment().utc().add(3, 'days'),
  });

  await shortUrlRepository.save(shortUrlRecord);

  ctx.body = {
    url: `http://127.0.0.1:3000/${shortId}`,
  };
});

export default router;

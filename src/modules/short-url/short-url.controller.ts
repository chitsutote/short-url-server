import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
const linkCheck = require('link-check');
import appDataSource from '../../dataSource/appDataSource';
import { cryptoRandomString } from '../../utils/random';
import shortUrlEntity from './short-url.entity';

const shortUrlRepository: Repository<shortUrlEntity> = appDataSource.getRepository(shortUrlEntity);

const router: Router = new Router();

const linkCheckPromise = async (url: string): Promise<{
  link: string
  status: 'alive' | 'dead'
  statusCode: number
  error?: any,
}> => {
  return new Promise((resolve, reject) => {
    linkCheck(url, { timeout: '4s' }, (err: any, result: any) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });

};

router.post('/short-url', async (ctx:Koa.Context, next: Koa.Next) => {
  const { url } = ctx.request.body as { url: string };

  if (!validator.isURL(url)) {
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = {
      error: 'Invalid url',
    };

    return next();
  }

  try {
    const result = await linkCheckPromise(url);

    if (!!result.error || result.status === 'dead') {
      ctx.body = {
        error: 'The url is unavailable',
      };

      return next();
    }
  } catch (error) {
    ctx.body = {
      error: 'The url is unavailable',
    };

    return next();
  }

  const shortId = cryptoRandomString({ length: 6, type: 'alphanumeric' });

  const shortUrlRecord = await shortUrlRepository.create({
    short_id: shortId,
    original_url: url,
    expired_at: moment().startOf('day').utc().add(3, 'days'),
  });

  await shortUrlRepository.save(shortUrlRecord);

  ctx.body = {
    url: `http://127.0.0.1:3000/${shortId}`,
  };
});

router.get('/short-urls', async (ctx:Koa.Context) => {
  const shortUrls = await shortUrlRepository.find({
    order: {
      created_at: 'DESC',
    },
  });

  ctx.body = {
    urls: shortUrls,
  };
});

export default router;

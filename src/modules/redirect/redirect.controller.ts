import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import * as moment from 'moment';
import appDataSource from '../../dataSource/appDataSource';
import cacheDataSource from '../../dataSource/cacheDataSource';
import shortUrlEntity from '../short-url/short-url.entity';

const shortUrlRepository: Repository<shortUrlEntity> = appDataSource.getRepository(shortUrlEntity);

const router: Router = new Router();

router.get('/:short_id', async (ctx:Koa.Context, next: Koa.Next) => {
  const { short_id }: { short_id: string } = ctx.params;

  const cachedUrlRecord = await cacheDataSource.get(short_id);

  if (cachedUrlRecord) {
    const {
      original_url,
      expired_at,
    } = JSON.parse(cachedUrlRecord);

    if (moment().startOf('day').utc().diff(moment(expired_at).utc(), 'days') >= 3) {
      await cacheDataSource.del(short_id);
      ctx.status = StatusCodes.OK;
      ctx.body = 'Link Expired';
      await shortUrlRepository.update({ short_id }, { is_expired: true });

      return next();
    }

    ctx.status = StatusCodes.MOVED_TEMPORARILY;
    ctx.redirect(original_url);

    await shortUrlRepository.update({ short_id }, { click_times: () => 'click_times + 1' });

    return next();
  }

  const shortUrlRecord = await shortUrlRepository.findOneBy({
    short_id,
  });

  if (!shortUrlRecord) {
    ctx.status = StatusCodes.NOT_FOUND;
    ctx.body = 'Not Found';

    return next();
  }

  const {
    id,
    original_url,
    click_times,
    expired_at,
  } = shortUrlRecord;

  // NOTE: check if link is expired
  if (moment().startOf('day').utc().diff(moment(expired_at).utc(), 'days') >= 3) {
    ctx.status = StatusCodes.OK;
    ctx.body = 'Link Expired';
    await shortUrlRepository.update({ id }, { is_expired: true });

    return next();
  }

  const nextClickTimes = click_times + 1;
  await shortUrlRepository.update({ id }, { click_times: nextClickTimes });

  if (nextClickTimes > 1) {
    await cacheDataSource.set(short_id, JSON.stringify({
      original_url,
      expired_at,
    }));
  }

  ctx.status = StatusCodes.MOVED_TEMPORARILY;
  ctx.redirect(original_url);
});

export default router;

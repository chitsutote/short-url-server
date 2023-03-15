import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import validator from 'validator';
import appDataSource from '../../dataSource/appDataSource';
import JWTService from '../../service/jwtService';
import UserEntity from './user.entity';

const userRepository: Repository<UserEntity> = appDataSource.getRepository(UserEntity);

const router: Router = new Router();

router.post('/login', async (ctx:Koa.Context, next: Koa.Next) => {
  const {
    email,
    password,
  } = ctx.request.body as {
    email: string
    password: string,
  };

  const user = await userRepository.findOneBy({ email });

  if (!user) {
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = {
      error: 'Incorrect email or password',
    };

    return next();
  }

  const {
    id: userId,
    password: userPassword,
  } = user;

  const valid = await bcrypt.compare(password, userPassword);

  if (!valid) {
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = {
      error: 'Incorrect email or password',
    };

    return next();
  }

  const token = JWTService.createJWTToken({ userId });

  ctx.status = StatusCodes.OK;
  ctx.body = {
    token,
  };
});

router.post('/signup', async (ctx:Koa.Context, next: Koa.Next) => {
  const {
    email,
    password,
  } = ctx.request.body as {
    email: string
    password: string,
  };

  if (!validator.isEmail(email)) {
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = {
      error: 'Invalid Email',
    };

    return next();
  }

  const newUser = await userRepository.create({
    email,
    password: await bcrypt.hash(password, 10),
  });

  const user = await userRepository.save(newUser);

  const token = JWTService.createJWTToken({ userId: user.id });

  ctx.status = StatusCodes.OK;
  ctx.body = {
    token,
  };
});

export default router;

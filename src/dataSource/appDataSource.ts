import { DataSource } from 'typeorm';
import ShortUrlEntity from '../modules/short-url/short-url.entity';
import UserEntity from '../modules/auth/user.entity';
import config from '../config';

const appDataSource = new DataSource({
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [
    ShortUrlEntity,
    UserEntity,
  ],
  subscribers: [],
  migrations: [],
});

export default appDataSource;

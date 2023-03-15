import { DataSource } from 'typeorm';
import ShortUrlEntity from '../modules/short-url/short-url.entity';
import UserEntity from '../modules/auth/user.entity';

const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'shortUrl',
  password: 'aA123123',
  database: 'short-url-db',
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

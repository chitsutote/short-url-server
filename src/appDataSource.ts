import { DataSource } from 'typeorm';

const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'shortUrl',
  password: 'aA123123',
  database: 'short-url-db',
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
})

export default appDataSource;

import * as dotenv from 'dotenv';

interface EnvFilePathType {
  [key: string]: string;
}

interface ConfigType extends dotenv.DotenvConfigOutput {
  POSTGRES_DATABASE_NAME?: string | undefined;
  POSTGRES_PASSWORD?: string | undefined;
  POSTGRES_HOST?: string | undefined;
  POSTGRES_USER?: string | undefined;
  POSTGRES_PORT?: string | undefined;
  REDIS_PORT?: string | undefined;
  REDIS_HOST?: string | undefined;
}

const envFilePath: EnvFilePathType = {
  local: './env/.env.local',
};

const config: ConfigType = dotenv.config({ path: envFilePath[process.env.NODE_ENV] });

export default {
  JWT_SECRET: 'MY_APP_SECRET',
  POSTGRES_DATABASE_NAME: config.parsed.POSTGRES_DATABASE_NAME,
  POSTGRES_PASSWORD: config.parsed.POSTGRES_PASSWORD,
  POSTGRES_HOST: config.parsed.POSTGRES_HOST,
  POSTGRES_USER: config.parsed.POSTGRES_USER,
  POSTGRES_PORT: config.parsed.POSTGRES_PORT,
  REDIS_PORT: config.parsed.REDIS_PORT,
  REDIS_HOST: config.parsed.REDIS_HOST,
};

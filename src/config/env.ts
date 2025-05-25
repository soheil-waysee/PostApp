import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, `../../.env`),
});
export const ENV = process.env.ENV ?? 'local';
export const isLocal = process.env.ENV === 'local';
export const isProd = process.env.NODE_ENV === 'production';
export const stageName = process.env.NODE_ENV || 'dev';
export const API_BASE_URL = process.env.API_BASE_URL;

export const API_KEY = process.env.API_KEY ?? '';
export const APP_PREFIX = 'post-app';

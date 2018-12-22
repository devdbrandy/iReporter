import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import dotenv from 'dotenv';
import { exceptionHandler } from './middleware';
import { config } from './utils/helpers';

import apiRouter from './routes/api';
import authRouter from './routes/auth';

const app = express();
const version = config('app:version');

let envFile = app.get('env') === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// view engine setup
app.set('views', path.join(__dirname, '../resources/views'));
app.set('view engine', 'jade');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(`/api/${version}`, apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Provided route is invalid'));
});

// error handler
app.use(exceptionHandler);

export default app;

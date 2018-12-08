import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import { exceptionHandler } from './middleware';
import { config } from './utils/helpers';

import webRouter from './routes/web';
import apiRouter from './routes/api';

const app = express();
const version = config('app:version');

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

app.use('/', webRouter);
app.use(`/api/${version}/`, apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Provided route is invalid'));
});

// error handler
app.use(exceptionHandler);

export default app;

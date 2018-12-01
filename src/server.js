import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';

import webRouter from './routes/web';
import apiRouter from './routes/api';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', webRouter);
app.use('/api/v1/', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Provided route is invalid'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const statusCode = err.status || 500;

  if (req.accepts('json')) {
    res.json({
      status: statusCode,
      error: err.message,
    });
  } else {
    // render the error page
    res.status(statusCode);
    res.render('error');
  }
});

export default app;

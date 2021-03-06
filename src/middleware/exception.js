import { Request, Response, NextFunction } from 'express';

/**
 * Render an exception into an HTTP response
 *
 * @param {Error} err - Error object
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next call to the middleware
 */
const exceptionHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const error = err.message || err.errors;
  const statusCode = err.status || 500;
  res.status(statusCode);

  return res.json({
    status: statusCode,
    error,
  });
};

export default exceptionHandler;

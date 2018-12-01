function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const statusCode = err.status || 500;
  res.status(statusCode);

  if (req.accepts('application/json')) {
    res.json({
      status: statusCode,
      error: err.message,
    });
  } else {
    // render the error page
    res.render('error');
  }
}

export default errorHandler;

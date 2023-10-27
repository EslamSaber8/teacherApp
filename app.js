const express = require('express');
const morgan = require('morgan');

const apiError = require('./utils/apiError');
const globalErrorHandler = require('./controllers/errorController');
const studentRouter = require('./router/studentRouter');

const app = express();
app.use(express.json());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) ROUTES
app.use('/api/v1/student', studentRouter);

app.all('*', (req, res, next) => {
  next(new apiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Routes
const studentRoute = require('./routes/studentRoute');
const studentAuthRoute = require('./routes/studentAuthRoute');
const teacherRoute = require('./routes/teacherRoute');
const teacherAuthRoute = require('./routes/teacherAuthRoute');
const courseRoute=require("./routes/courseRoute");
const lessonRoute=require("./routes/lessonRoute");
const reviewRoute = require('./routes/reviewRoute');
const cartRoute = require('./routes/cartRoute');
const { webhookCheckout } = require('./services/cartService');


// Connect with db
dbConnection();

// express app
const app = express();
// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());
// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/students', studentRoute);
app.use('/api/v1/studentAuth', studentAuthRoute);
app.use('/api/v1/teachers',teacherRoute);
app.use('/api/v1/teacherAuth', teacherAuthRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use("/api/v1/carts",cartRoute);
app.use("/api/v1/lessons",lessonRoute);




app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');



const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ticketmasterRouter = require('./routes/ticketmaster');
const genreRouter = require('./routes/genres');
const locationsRouter = require('./routes/locations');
const favoritesRouter = require('./routes/favorites');
const contactsRouter = require('./routes/contacts');



const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


app.use(express.json());


passport.use(localStrategy);
passport.use(jwtStrategy);


// Mount router on "/api"
app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', ticketmasterRouter);
app.use('/api', genreRouter);
app.use('/api', locationsRouter);



// Endpoints below this require a valid JWT
// app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== LOCKED ENDPOINTS BELOW MUST KEEP UNDER THIS LINE ========== */
app.use('/api', favoritesRouter);
app.use('/api', contactsRouter);


// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app; // Export for testing

'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://dev1:password1@ds016068.mlab.com:16068/kttm',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://dev:123dev@ds018308.mlab.com:18308/kttm-test',
  TICKETMASTERAPIKEY: process.env.TICKETMASTERAPIKEY,
  TICKETMASTERSECRET: process.env.TICKETMASTERSECRET,
  JWT_SECRET: process.env.JWT_SECRET,     
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};

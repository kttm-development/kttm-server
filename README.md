[![Build Status](https://travis-ci.org/kttm-development/kttm-server.svg?branch=master)](https://travis-ci.org/kttm-development/kttm-server)
# ConcertConnect
React.js client side app found here: [ConcertConnect Client Github](https://github.com/kttm-development/kttm-client)
Live Version of the application can be found here: [ConcertConnect Live](https://concertconnect-client.herokuapp.com/)

## Description:
Server side for ConcertConnect. Uses Node.js, Express, and MongoDB. Comes with all authentication routes for creating new users and logging in. Other routes include interacting with Tickemasters API to search events, and routes to store user contacts and favorites. All routes come with integration testing.

## Instructions:
    -clone this repo
    -npm install
    -**Check package.json and make sure it has the following:**
        -"dependencies": {
            "bcryptjs": "^2.4.3",
            "cors": "^2.8.4",
            "dotenv": "^6.0.0",
            "express": "^4.16.3",
            "jsonwebtoken": "^8.3.0",
            "mongoose": "^5.0.6",
            "morgan": "^1.9.0",
            "node-fetch": "^2.1.2",
            "passport": "^0.4.0",
            "passport-jwt": "^4.0.0",
            "passport-local": "^1.0.0",
            "pg": "^7.4.1"
        },
        "devDependencies": {
            "chai": "^4.1.2",
            "chai-http": "^3.0.0",
            "cross-env": "^5.1.3",
            "mocha": "^5.0.4",
            "nyc": "^11.9.0"
        }
    -npm start (default: localhost:8080)
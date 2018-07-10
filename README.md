[![Build Status](https://travis-ci.org/kttm-development/kttm-server.svg?branch=master)](https://travis-ci.org/kttm-development/kttm-server)
# ConcertConnect
React.js client side app found here: [ConcertConnect Client Github](https://github.com/kttm-development/kttm-client)
Live Version of the application can be found here: [ConcertConnect Live](https://concertconnect-client.herokuapp.com/)

## Description:
Server side for ConcertConnect. Uses Node.js, Express, and MongoDB. Comes with all authentication routes for creating new users and logging in. Other routes include interacting with Tickemasters API to search events, and routes to store user contacts and favorites. All routes come with integration testing.

ConcertConnect is a web app created to help those who want to plan their entire concert experience. The app allows users to look for concerts based on their interests and location while also allowing the user to find tickets to and places to stay around a specific concert of their choosing. The user also has the ability to view YouTube videos of the main artist for a specific concert and to invite their friends with the click of a button.

CC is a password-protected site with certain protected endpoints so that user is able to keep track of his/her contacts and favorited concerts. However, an unregistered user is still able to find concerts, tickets, and places to stay so that they can get a feel for the site as well. If an unregistered user would like to add a favorite or invite their friends, they are prompted to login or signup.

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

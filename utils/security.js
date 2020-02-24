const dotenv = require('dotenv');
const Auth0Strategy = require('passport-auth0');

dotenv.config();

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      // process.env.AUTH0_CALLBACK_URL ||
      'http://localhost:3000/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) =>
    done(null, profile),
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
);

module.exports = {
  strategy,
};

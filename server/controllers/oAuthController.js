const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;

const oAuthController = {};

oAuthController.verifyToken = (req, res, next) => {
  const respondTokenNotValid = () => (
    res.status(401).json({ isLoggedIn: false })
  );

  if (!req.headers.authorization) return respondTokenNotValid();

  const token = req.headers.authorization;
  if (!token) return respondTokenNotValid();

  const client = new OAuth2Client(CLIENT_ID);

  async function verify() {
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const { email, given_name, family_name } = payload;
    res.locals.userId = userId;
    res.locals.username = email;
    res.locals.firstName = given_name;
    res.locals.lastName = family_name;
    res.locals.isLoggedIn = true;
    return next();
  }

  verify().catch(() => {
    console.log("HERE I AM");
    respondTokenNotValid();
  });
};

module.exports = oAuthController;
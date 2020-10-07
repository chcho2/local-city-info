
const {
    OAuth2Client
} = require('google-auth-library');



const oAuthController = {};


oAuthController.verifyToken = (req, res, next) => {
 
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { token } = req.body;
  
  async function verify() {
      
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
          });
          const payload = ticket.getPayload();
          console.log('what is payload', payload)
          const userId = payload['sub'];
          const { email, given_name, family_name } = payload;
          res.locals.userName = email;
          res.locals.firstName = given_name;
          res.locals.lastName = family_name;
          res.locals.oAuth = true;
          res.locals.userId = userId;
          return next();
      
      }
      verify().catch(console.error);
  
}

module.exports = oAuthController;
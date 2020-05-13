// middleware "function" to authenticate user, check if
// a) req has token
// b) web token JWT is valid or not.
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // "Bearer authorization_token"

    //Adding new piece of information called "userData" to "req".
    // Make sure "req.userData" doesn't already exist. Else it will get overwritten.
    // Everything that uses "req" object after it has passed through this middleware
    // will now get that userData information.

    // If I have not covered all the necessary "if" conditions here for token values here, app will break:
    if (req.headers.authorization.split(" ")[1] == "undefined" ||
      req.headers.authorization.split(" ")[1] == undefined ||
      req.headers.authorization.split(" ")[1] == "null" ||
      req.headers.authorization.split(" ")[1] == null) {
      // if token is undefined
      // console.log('auth header found, Token: ' + req.headers.authorization.split(" ")[1]);
      req.userData = { email: null, userId: null, role: null };
      next();
    } else {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      // console.log('Decoded Token: '+JSON.stringify(decodedToken));
      req.userData = { email: decodedToken.email, userId: decodedToken.userId, role: decodedToken.role };
      next();
    }
  } catch (err) {
    console.log('Error getting authorization info/token: ' + err);
    res.status(401).json({ message: 'Invalid authorizationYou are not authenticated!' });// 401 for authentication failure
  }
}

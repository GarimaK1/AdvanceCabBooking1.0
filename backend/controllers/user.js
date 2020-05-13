const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
Two roles only: 'admin' and 'loggedUser'
Admin Username: admin@123.com
Admin Password: admin
*/
module.exports.createUser = (req, res) => {
  //Check if admin:
  let role;
  // console.log('req.body.email: ' + req.body.email + ', req.body.password: ' + req.body.password);
  if (req.body.email === 'admin@123.com' && req.body.password === 'admin') {
    role = 'admin';
  } else {
    role = 'loggedUser';
  }
  // console.log('Role: ' + role);
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        role: role
        //Don't keep "password: req.body.password" --> stupid to save unencrypted passwords.
      });
      user.save()
        .then(document => {
          console.log('user saved successfully to DB: ' + document);
          res.status(201).json({
            message: 'User saved successfully to DB.'
          });
        })
        .catch((err) => {
          console.log('Error saving user during signup: ' + err);
          res.status(500).json({ message: 'User not signed-up. Please try using different credentials.', error: err });
        })
    })
    .catch((err) => {
      console.log('Error hashing signup password: ' + err);
      res.status(500).json({ message: 'Please choose a different password.', error: err });
    });
}

module.exports.loginUser = (req, res) => {
  // validate credentials: email and password
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        console.log('User not found');
        return res.status(401).json({
          message: 'Authenticaion failed. Incorrect username or password.'
        });
      }
      // console.log('We found a user with that email id. this gets printed.');
      fetchedUser = user;
      bcrypt.compare(req.body.password, user.password) // returns a promise with result of compare
        .then(result => {
          // console.log(result);
          if (!result) {
            return res.status(401).json({
              message: 'Authenticaion failed. Incorrect username or password.'
            });
          }
          // user is validated. Create authentication token
          const token = jwt.sign({ email: req.body.email, userId: fetchedUser._id, role: fetchedUser.role },
            process.env.JWT_KEY,
            { expiresIn: '1h' });

          // console.log('token is : ' + token);
          res.status(200).json({
            token: token,
            expiresIn: 3600, // 3600 seconds or 1 hour
            role: fetchedUser.role
          });
        })
        .catch(err => {
          console.log('Some error in comparing password: ' + err);
          return res.status(401).json({
            message: 'Authenticaion failed..'
          });
        });
    })
    .catch(err => {
      console.log('Error getting required user from DB: ' + err);
      return res.status(401).json({
        message: 'Authenticaion failed...',
        error: err
      });
    });
}

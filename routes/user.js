var express = require('express');
var userRoute = express.Router();
var bcrypt = require('bcrypt');
var UserInterface = require('../interfaces/user');
var ResponseHelper = require('../helpers/ResponseHelper');

const saltRounds = 12;

function encryptPassword(password, rounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, rounds, (err, hash) => {
      if (!_.isUndefined(err)) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

userRoute.post('/', (request, response) => {
  encryptPassword(request.body.password, saltRounds)
  .then((hash) => {
    request.body.password = hash;

    return UserInterface.createUser(request.body);
  })
  .then((user) => response.json(ResponseHelper.success(user)))
  .catch((err) => response.json(ResponseHelper.error(err)));
});

userRoute.get('/:userId', (request, response) => {
  UserInterface.findUserById(request.params.userId)
  .then((user) => response.json(ResponseHelper.success(user)))
  .catch((err) => response.json(ResponseHelper.error(err)));
});

userRoute.put('/:userId', (request, response) => {
  UserInterface.updateUserById(request.params.userId, request.body)
  .then((user) => response.json(user))
  .catch((err) => response.json(err));
});

userRoute.get('/login', (request, response) => {
  UserInterface.findUserByUsernameIncludePassword(request.body.username)
  .then((user) => {
    bcrypt.compare(request.body.password, user.password)
    .then((isCorrectPassword) => {
      if (isCorrectPassword) {
        response.json(ResponseHelper.success(user));
      } else {
        response.json(ResponseHelper.error({ message: 'Incorrect Password' }));
      }
    });
  })
  .catch((err) => response.json(err));
});

module.exports = userRoute;
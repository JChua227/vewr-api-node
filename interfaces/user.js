var User = require('../models/user');

class UserInterface {
  createUser(data) {
    return new User(data).save().lean();
  }

  findUserById(id) {
    return User.findOne({ _id: id }).lean();
  }

  findUserByIdIncludePassword(id) {
    return User.findOne({ _id: id }).select('+password').lean();
  }

  findUserByEmail(email) {
    return User.findOne({ email }).lean();
  }

  updateUserById(id, data) {
    return User.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
  }
}

module.exports = new UserInterface;
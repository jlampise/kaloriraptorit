const bcrypt = require('bcrypt-nodejs');

module.exports = {
  createHash: (pw) => {
    return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
  },
  isPasswordValid: (pw, hash) => {
    return bcrypt.compareSync(pw, hash);
  }
};

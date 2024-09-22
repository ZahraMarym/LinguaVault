const jwt = require("jsonwebtoken");
exports = {};
exports.getToken = async (email, user) => {
  const token = jwt.sign(
    { id: user._identifier },
     "secret");
  return token;
};
module.exports = exports;
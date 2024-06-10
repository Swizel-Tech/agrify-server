const crypto = require("crypto");
const config = require("../config.js");

const hashString = (str) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

module.exports = {
  hashString,
};

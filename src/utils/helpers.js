const crypto = require("crypto");
const config = require("../config.js");

const hashString = (str) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

const findMatchingRecord = (array, key, value) => {
  return array.find((record) => record[key] === value) || null;
};
module.exports = {
  hashString,
  findMatchingRecord,
};

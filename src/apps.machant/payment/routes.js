const { Router } = require("express");
const {
  account_number,
  resolve_acc_number,
  get_banks,
} = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant account creation route
  api.get("/get_banks", get_banks);
  api.post("/account_number", account_number);
  api.post("/validate_acc", resolve_acc_number);
  return api;
};

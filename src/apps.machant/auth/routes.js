const { Router } = require("express");
const {
  sign_up,
  verify_otp,
  marchant_pass,
  get_account,
  checkdevice,
  change_pin,
  verify_otp_pin,
  sign_in,
  login,
} = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant account creation route
  api.post("/register", sign_up);
  api.post("/verify_otp", verify_otp);
  api.post("/marchant_pass", marchant_pass);
  api.get("/get_account/:id", get_account);
  api.get("/checkdevice/:deviceId", checkdevice);
  api.post("/change_pin", change_pin);
  api.post("/verify_otp_pin", verify_otp_pin);
  api.post("/sign_in", sign_in);
  api.post("/login", login);
  return api;
};

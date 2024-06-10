const { Router } = require("express");
const { sign_up, verify_otp, marchant_pass } = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant account creation route
  api.post("/register", sign_up);

  /**Verify marchant account */
  api.post("/verify_otp", verify_otp);
  api.post("/marchant_pass", marchant_pass);

  return api;
};

const { Router } = require("express");
const { order } = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant create product
  api.post("/new_order", order);

  return api;
};

const { Router } = require("express");
const { new_product, get_product } = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant create product
  api.post("/new_product", new_product);
  //   Marchant get product
  api.get("/allproduct", get_product);

  return api;
};

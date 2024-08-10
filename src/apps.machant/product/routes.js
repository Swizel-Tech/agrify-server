const { Router } = require("express");
const {
  new_product,
  get_product,
  get_categories,
  get_allproductname,
} = require("./controls.js");

const api = Router();

module.exports = () => {
  // Marchant create product
  api.post("/new_product", new_product);

  //   Marchant get product
  api.get("/allproduct", get_product);

  //   Marchant get category
  api.get("/categories", get_categories);

  //   Marchant get category
  api.get("/get_allproductname/:catnae", get_allproductname);

  return api;
};

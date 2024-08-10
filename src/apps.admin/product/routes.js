const { Router } = require("express");
const { new_category, new_name } = require("./controls.js");

const api = Router();

module.exports = () => {
  // admin create cate
  api.post("/new_category", new_category);

  // admin create product Name
  api.post("/new_name", new_name);

  return api;
};

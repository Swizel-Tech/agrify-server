const { Router } = require("express");
const {
  get_previous_sales,
  get_pending_order,
  get_all_order,
} = require("./controls.js");

const api = Router();

module.exports = () => {
  api.get("/get_previous_sales/:marchantId", get_previous_sales);
  api.get("/get_pending_order/:marchantId", get_pending_order);
  api.get("/get_all_order/:marchantId", get_all_order);

  return api;
};

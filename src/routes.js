const express = require("express");
const UserAuthRoute = require("./apps.machant/auth/routes.js");
const ProductRoute = require("./apps.machant/product/routes.js");
const marchantOrderRoute = require("./apps.machant/orders/routes.js");
const adminProductRoute = require("./apps.admin/product/routes.js");
const customerProductRoute = require("./apps.customer/orders/routes.js");

// Exposes the express router binding
const router = express();

// ROUTES
router.use("/api/auth", UserAuthRoute());
router.use("/api/product", ProductRoute());
router.use("/api/marchant_order", marchantOrderRoute());
router.use("/api/admin_product", adminProductRoute());
router.use("/api/customer", customerProductRoute());

module.exports = router;

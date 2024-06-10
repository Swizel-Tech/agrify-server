const express = require("express");
const UserAuthRoute = require("./apps.machant/auth/routes.js");
const ProductRoute = require("./apps.machant/product/routes.js");

// Exposes the express router binding
const router = express();

// ROUTES
router.use("/api/auth", UserAuthRoute());
router.use("/api/product", ProductRoute());

module.exports = router;

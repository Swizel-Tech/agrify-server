const express = require("express");
const UserAuthRoute = require("./apps.machant/auth/routes.js");

// Exposes the express router binding
const router = express();

// ROUTES
router.use("/api/auth", UserAuthRoute());

module.exports = router;

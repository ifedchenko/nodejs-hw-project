const express = require("express");

const router = express.Router();

const { validateBody } = require("../../middlewares");

const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/auth");

// signup
router.post(
  "/register",
  validateBody(schemas.registrationSchema),
  ctrl.register
);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;

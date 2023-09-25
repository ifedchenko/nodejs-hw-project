const express = require("express");

const router = express.Router();

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/users");

// signup
router.post(
  "/register",
  validateBody(schemas.registrationSchema),
  ctrl.register
);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.current);
router.post("/logout", authenticate, ctrl.logout);

module.exports = router;

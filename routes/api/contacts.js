const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const schemas = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.contactList);

router.get("/:contactId", authenticate, isValidId, ctrl.contactGetById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.contactSchema),
  ctrl.contactAdd
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.contactSchema),
  ctrl.contactUpdate
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  //   validateBody(schemas.updateStatusContactSchema),
  ctrl.updateStatusContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.contactDelete);

module.exports = router;

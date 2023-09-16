const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");

const schemas = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.contactList);

router.get("/:contactId", isValidId, ctrl.contactGetById);

router.post(
  "/",
  validateBody(schemas.contactSchema),
  ctrl.contactAdd
);

router.delete("/:contactId", isValidId, ctrl.contactDelete);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.contactSchema),
  ctrl.contactUpdate
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  //   validateBody(schemas.updateStatusContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;

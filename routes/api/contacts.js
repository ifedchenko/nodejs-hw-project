const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody } = require('../../middlewares');

const schemas = require('../../schemas/contacts');

const router = express.Router();

router.get('/', ctrl.contactList);

router.get('/:contactId', ctrl.contactGetById);

router.post('/', validateBody(schemas.contactSchema), ctrl.contactAdd);

router.delete('/:contactId', ctrl.contactDelete);

router.put('/:contactId', validateBody(schemas.contactSchema), ctrl.contactUpdate);

module.exports = router;

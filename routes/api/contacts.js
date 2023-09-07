const express = require('express');

const ctrl = require('../../controllers/contacts');

const router = express.Router();

router.get('/', ctrl.contactList);

router.get('/:contactId', ctrl.contactGetById);

router.post('/', ctrl.contactAdd);

router.delete('/:contactId', ctrl.contactDelete);

router.put('/:contactId', ctrl.contactUpdate);

module.exports = router;

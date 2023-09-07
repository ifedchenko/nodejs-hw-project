const Joi = require('joi');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts');

const { HttpError } = require('../utils');

const contactBodyValidSchema = Joi.when(Joi.ref('$requestMethod'), {
  switch: [
    {
      is: 'POST',
      then: Joi.object({
        name: Joi.string().empty('').trim().min(3).max(30).required().messages({
          'string.min': `name should have a minimum length of {#limit}`,
          'string.max': `name should have a maximum length of {#limit}`,
          'any.required': `missing required name field`,
        }),
        email: Joi.string().empty('').trim().min(6).max(30).email().required().messages({
          'string.min': `email should have a minimum length of {#limit}`,
          'string.max': `email should have a maximum length of {#limit}`,
          'string.email': `email field must be a valid`,
          'any.required': `missing required email field`,
        }),
        phone: Joi.string()
          .trim()
          .empty('')
          .trim()
          .min(6)
          .max(30)
          .pattern(/^[+]?\d{2,7}[(\- .\s]?\d{2,7}([)\- .\s]?\d{2,7})*$/)
          .required()
          .messages({
            'string.min': `phone should have a minimum length of {#limit}`,
            'string.max': `phone should have a maximum length of {#limit}`,
            'any.required': `missing required phone field`,
          }),
      }),
    },
    {
      is: 'PUT',
      then: Joi.object({
        name: Joi.string().empty('').trim().min(3).max(30),
        email: Joi.string().empty('').trim().min(6).max(30).email(),
        phone: Joi.string()
          .trim()
          .empty('')
          .trim()
          .min(6)
          .max(30)
          .pattern(/^[+]?\d{2,7}[(\- .\s]?\d{2,7}([)\- .\s]?\d{2,7})*$/),
      }),
    },
  ],
});

const contactList = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const contactGetById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      throw HttpError(404, 'Not found');
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const contactAdd = async (req, res, next) => {
  try {
    const { error } = contactBodyValidSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contacts = await addContact(req.body);
    return res.status(201).json(contacts);
  } catch (error) {
    next(error);
  }
};

const contactDelete = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

const contactUpdate = async (req, res, next) => {
  try {
    const updates = req.body;
    const { error } = contactBodyValidSchema.validate(updates);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;

    const contact = await updateContact(contactId, updates);
    if (!contact) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  contactList,
  contactGetById,
  contactAdd,
  contactDelete,
  contactUpdate,
};

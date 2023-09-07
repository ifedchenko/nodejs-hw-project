const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts');

const { HttpError, ctrlWrapper } = require('../utils');

const contactList = async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

const contactGetById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  return res.status(200).json(contact);
};

const contactAdd = async (req, res, next) => {
  const contacts = await addContact(req.body);
  return res.status(201).json(contacts);
};

const contactDelete = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({ message: 'contact deleted' });
};

const contactUpdate = async (req, res, next) => {
  const updates = req.body;
  const { contactId } = req.params;

  const contact = await updateContact(contactId, updates);
  if (!contact) {
    throw HttpError(404, 'Contact not found');
  }
  res.status(200).json(contact);
};

module.exports = {
  contactList: ctrlWrapper(contactList),
  contactGetById: ctrlWrapper(contactGetById),
  contactAdd: ctrlWrapper(contactAdd),
  contactDelete: ctrlWrapper(contactDelete),
  contactUpdate: ctrlWrapper(contactUpdate),
};

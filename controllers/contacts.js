const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../utils");

const contactList = async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
};

const contactGetById = async (req, res, next) => {
  const { contactId } = req.params;
  // const contact = await Contact.findOne({ _id: contactId });
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  return res.status(200).json(contact);
};

const contactAdd = async (req, res, next) => {
  const contact = await Contact.create(req.body);
  return res.status(201).json(contact);
};

const contactDelete = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const contactUpdate = async (req, res, next) => {
  const updates = req.body;
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndUpdate(
    contactId,
    updates,
    {
      new: true,
    }
  );
  if (!contact) {
    throw HttpError(404, "Contact not found");
  }
  res.status(200).json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const updates = req.body;
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndUpdate(
    contactId,
    updates,
    {
      new: true,
    }
  );
  if (Object.keys(updates).length === 0) {
    throw HttpError(400, "missing field favorite");
  }

  if (!contact) {
    throw HttpError(404, "not found");
  }
  res.status(200).json(contact);
};

module.exports = {
  contactList: ctrlWrapper(contactList),
  contactGetById: ctrlWrapper(contactGetById),
  contactAdd: ctrlWrapper(contactAdd),
  contactDelete: ctrlWrapper(contactDelete),
  contactUpdate: ctrlWrapper(contactUpdate),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../utils");

const contactList = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find(
    { owner, ...req.query },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "email subscription");
  res.status(200).json(contacts);
};

const contactGetById = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  // const contact = await Contact.findOne({ _id: contactId });
  const contact = await Contact.findOne({
    _id: contactId,
    owner,
  });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  return res.status(200).json(contact);
};

const contactAdd = async (req, res, next) => {
  const { _id: owner } = req.user;
  const contact = await Contact.create({ ...req.body, owner });
  return res.status(201).json(contact);
};

const contactDelete = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOneAndRemove({
    _id: contactId,
    owner,
  });
  if (!contact) {
    throw HttpError(404, "Contact not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

const contactUpdate = async (req, res, next) => {
  const { _id: owner } = req.user;
  const updates = req.body;
  const { contactId } = req.params;

  if (!owner) {
    throw HttpError(400, "Invalid user");
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
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
  const { _id: owner } = req.user;
  const updates = req.body;
  const { contactId } = req.params;

  if (!owner) {
    throw HttpError(400, "Invalid user");
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
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

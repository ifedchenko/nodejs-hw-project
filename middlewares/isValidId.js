const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../utils");

const isValidId = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(new HttpError(400, `${contactId} is not a valid id`));
  }
  next();
};

module.exports = isValidId;

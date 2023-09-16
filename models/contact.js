const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../utils");
const Joi = require("joi");

const contactSchema = Joi.when(Joi.ref("$requestMethod"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        name: Joi.string()
          .empty("")
          .trim()
          .min(3)
          .max(30)
          .required()
          .messages({
            "string.min": `name should have a minimum length of {#limit}`,
            "string.max": `name should have a maximum length of {#limit}`,
            "any.required": `missing required name field`,
          }),
        email: Joi.string()
          .empty("")
          .trim()
          .min(6)
          .max(30)
          .email()
          .required()
          .messages({
            "string.min": `email should have a minimum length of {#limit}`,
            "string.max": `email should have a maximum length of {#limit}`,
            "string.email": `email field must be a valid`,
            "any.required": `missing required email field`,
          }),
        phone: Joi.string()
          .trim()
          .empty("")
          .trim()
          .min(6)
          .max(30)
          .pattern(
            /^[+]?\d{2,7}[(\- .\s]?\d{2,7}([)\- .\s]?\d{2,7})*$/
          )
          .required()
          .messages({
            "string.min": `phone should have a minimum length of {#limit}`,
            "string.max": `phone should have a maximum length of {#limit}`,
            "any.required": `missing required phone field`,
          }),
        favorite: Joi.boolean(),
      }),
    },
    {
      is: "PUT",
      then: Joi.object({
        name: Joi.string().empty("").trim().min(3).max(30),
        email: Joi.string().empty("").trim().min(6).max(30).email(),
        phone: Joi.string()
          .trim()
          .empty("")
          .trim()
          .min(6)
          .max(30)
          .pattern(
            /^[+]?\d{2,7}[(\- .\s]?\d{2,7}([)\- .\s]?\d{2,7})*$/
          ),
        favorite: Joi.boolean(),
      }),
    },
  ],
});

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactMongooseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactMongooseSchema.post("save", handleMongooseError);

const Contact = model("Contact", contactMongooseSchema);

module.exports = {
  Contact,
  contactSchema,
  updateStatusContactSchema,
};

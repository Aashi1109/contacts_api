import * as Joi from "joi";
import { contactInfoRequiredSchema } from "@src/schemas/contactInfoSchema";

const baseContactSchema = Joi.object({
  firstname: Joi.string().optional().messages({
    "string.base": "First name should be a type of string",
    "string.empty": "First name cannot be empty",
  }),
  lastname: Joi.string().optional().allow("").messages({
    "string.base": "Last name should be a type of string",
  }),
  image: Joi.string().optional().allow("").messages({
    "string.base": "Image should be a type of string",
  }),
  address: Joi.string().optional().allow("").messages({
    "string.base": "Address should be a type of string",
  }),
  contacts: Joi.array().items(contactInfoRequiredSchema).optional().messages({
    "array.base": "Contacts should be an array",
    "array.includesRequiredUnknowns": "Contacts must include required fields",
  }),
});

// Define schema for creating a new contact
// Schema for creating a new contact
const createContactSchema = baseContactSchema.keys({
  firstname: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  contacts: Joi.array().items(contactInfoRequiredSchema).required().messages({
    "array.base": "Contacts should be an array",
    "array.includesRequiredUnknowns": "Contacts must include required fields",
    "any.required": "Contacts are required",
  }),
});

// Define schema for updating a contact (firstname remains optional)
const updateContactSchema = baseContactSchema;

export { createContactSchema, updateContactSchema };

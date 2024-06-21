import * as Joi from "joi";
import { EContactLabels } from "@src/types";

const baseContactInfoSchema = Joi.object({
  stdCode: Joi.number().optional().allow("").messages({
    "number.base": "Standard code should be a type of number",
  }),
  number: Joi.string().optional().messages({
    "string.base": "Contact number should be a type of string",
    "string.empty": "Contact number cannot be empty",
  }),
  label: Joi.string()
    .valid(...Object.values(EContactLabels))
    .optional()
    .messages({
      "any.only": `Label must be one of the following: ${Object.values(EContactLabels).join(", ")}`,
    }),
});

const contactInfoSchema = Joi.object({
  stdCode: Joi.number().optional().allow("").messages({
    "number.base": "Standard code should be a type of number",
  }),
  number: Joi.string().required().messages({
    "string.base": "Contact number should be a type of string",
    "string.empty": "Contact number cannot be empty",
    "any.required": "Contact number is required",
  }),
  label: Joi.string()
    .valid(...Object.values(EContactLabels))
    .optional()
    .messages({
      "any.only": `Label must be one of the following: ${Object.values(EContactLabels).join(", ")}`,
    }),
});

export const contactInfoRequiredSchema = baseContactInfoSchema.keys({
  number: Joi.string().required().messages({
    "string.base": "Contact number should be a type of string",
    "string.empty": "Contact number cannot be empty",
    "any.required": "Contact number is required",
  }),
});

export default baseContactInfoSchema;

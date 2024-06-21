import { NextFunction, Request, Response } from "express";
import { ClientError } from "@src/exceptions";
import { createContactSchema } from "@src/schemas/contactsValidationSchema";

const validateContactCreate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) {
    throw new ClientError(`Invalid data provided: ${error.details[0].message}`);
  }

  return next();
};

export default validateContactCreate;

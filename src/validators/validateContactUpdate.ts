import { NextFunction, Request, Response } from "express";
import { ClientError } from "@src/exceptions";
import { updateContactSchema } from "@src/schemas/contactsValidationSchema";

const validateContactUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error, value } = updateContactSchema.validate(req.body);

  if (error) {
    throw new ClientError(`Invalid data provided: ${error.details[0].message}`);
  }

  return next();
};

export default validateContactUpdate;

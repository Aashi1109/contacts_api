import { NextFunction, Request, Response } from "express";
import { ClientError } from "@src/exceptions";
import baseContactInfoSchema from "@src/schemas/contactInfoSchema";

const validateContactInfoUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error, value } = baseContactInfoSchema.validate(req.body);

  if (error) {
    throw new ClientError(`Invalid data provided: ${error.details[0].message}`);
  }

  return next();
};

export default validateContactInfoUpdate;

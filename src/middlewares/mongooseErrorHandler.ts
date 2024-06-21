import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import {ClientError, DuplicateKeyError} from "@src/exceptions";

/**
 * Middleware to handle Mongoose errors and return proper messages.
 *
 * @param {any} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Response} - The response object with the appropriate error message and status code.
 */
const mongooseErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (err instanceof mongoose.Error.ValidationError) {
    // Handle validation errors
    const errors = Object.values(err.errors).map((error) => error.message);
    throw new ClientError("Validation Error", errors.join(" "));
  }

  if (err instanceof mongoose.Error.CastError) {
    // Handle cast errors (invalid ObjectId, etc.)
    throw new ClientError(`Invalid ${err.path}: ${err.value}`);
  }

  if (err.code && err.code === 11000) {
    // Handle duplicate key errors
    const field = Object.keys(err.keyValue)[0];
    throw new DuplicateKeyError(`Duplicate key error: ${field} already exists`);
  }

  throw err;
};

export default mongooseErrorHandler;

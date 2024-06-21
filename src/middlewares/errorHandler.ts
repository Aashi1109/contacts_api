import {CustomError} from "@src//exceptions";
import {NextFunction, Request, Response} from "express";
import {IResponseError} from "@src/exceptions/customError";
import logger from "@src/logger";
import {isProductionEnv, jnstringify} from "@src/lib/utils";
import {IErrorResponse} from "@src/types";

/**
 * Handles errors and sends appropriate HTTP responses.
 * @function errorHandler
 * @param {any} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(jnstringify(err));

  // Check if the error is an instance of CustomError
  if (!(err instanceof CustomError)) {
    // If not a CustomError, send a generic internal server error response
    const returnResponse: IErrorResponse = {
      success: false,
      errors: {
        message: "Internal server error. Try again later",
      },
    };
    if (!isProductionEnv) returnResponse.errors.stackTrace = err;
    res.status(500).json(returnResponse);
  } else {
    const customError = err as CustomError;
    let response = { message: customError.message } as IResponseError;

    // Include additional information in the response if available
    if (customError.additionalInfo) {
      response.additionalInfo = customError.additionalInfo;
    }

    const returnResponse: { success: boolean; errors: any } = {
      success: false,
      errors: {
        ...response,
      },
    };
    if (!isProductionEnv) returnResponse.errors.stackTrace = err;
    // Send a JSON response with the appropriate status code and error message
    res.status(customError.status).type("json").send(returnResponse);
  }
};
export default errorHandler;

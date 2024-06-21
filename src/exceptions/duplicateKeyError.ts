import CustomError from "./customError";

/**
 * Represents an error that occurs due to duplicate input in mongoose.
 * Extends the CustomError class.
 * @class DuplicateKeyError
 * @extends CustomError
 */
class DuplicateKeyError extends CustomError {
  /**
   * Creates a new instance of ClientError.
   * @constructor
   * @param {string} message - The error message.
   * @param additionalInfo - Any additional information about the error
   */
  constructor(message: string, additionalInfo?: string) {
    super(message, 409, additionalInfo);
  }
}

export default DuplicateKeyError;

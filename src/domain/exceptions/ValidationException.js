/**
 * Exception raised when domain validation fails.
 */
var ValidationException = class ValidationException extends DomainException {
  /**
   * Creates a validation exception.
   *
   * @param {string} message - Error message describing the validation failure.
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }
};

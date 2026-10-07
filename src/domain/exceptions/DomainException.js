/**
 * Base exception for domain-layer errors.
 */
var DomainException = class DomainException extends Error {
  /**
   * Creates a domain exception.
   *
   * @param {string} message - Error message describing the domain failure.
   */
  constructor(message) {
    super(message);
    this.name = 'DomainException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }
};

/**
 * Base exception for domain-layer errors.
 */
class DomainException extends Error {
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
}

module.exports = DomainException;

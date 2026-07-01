const ValidationException = require('../exceptions/ValidationException');

/**
 * Immutable value object that wraps a non-empty string identifier.
 */
class Identifier {
  /**
   * Creates an identifier.
   *
   * @param {string} value - Non-empty identifier value.
   * @throws {ValidationException} When the identifier is not a non-empty string.
   */
  constructor(value) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new ValidationException('Identifier value is required.');
    }

    this.value = value;
    Object.freeze(this);
  }

  /**
   * Compares this identifier with another identifier.
   *
   * @param {Identifier} other - Identifier to compare.
   * @returns {boolean} True when both identifiers have the same value.
   */
  equals(other) {
    return other instanceof Identifier && this.value === other.value;
  }

  /**
   * Returns the raw identifier string.
   *
   * @returns {string} Identifier value.
   */
  toString() {
    return this.value;
  }
}

module.exports = Identifier;

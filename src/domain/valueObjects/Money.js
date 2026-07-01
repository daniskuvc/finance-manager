const ValidationException = require('../exceptions/ValidationException');

/**
 * Validates that a money operation uses another Money value with the same currency.
 *
 * @param {Money} current - Current money value.
 * @param {Money} other - Money value to validate.
 * @throws {ValidationException} When the other value is invalid or currency differs.
 */
function validateSameCurrency(current, other) {
  if (!(other instanceof Money)) {
    throw new ValidationException('Money operation requires another Money value.');
  }

  if (current.currency !== other.currency) {
    throw new ValidationException('Money currency must match.');
  }
}

/**
 * Immutable value object representing a numeric amount in a currency.
 */
class Money {
  /**
   * Creates a money value.
   *
   * @param {number} amount - Numeric amount.
   * @param {string} currency - Required currency code or label.
   * @throws {ValidationException} When amount or currency is invalid.
   */
  constructor(amount, currency) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new ValidationException('Money amount must be a valid number.');
    }

    if (typeof currency !== 'string' || currency.length === 0) {
      throw new ValidationException('Money currency is required.');
    }

    this.amount = amount;
    this.currency = currency;
    Object.freeze(this);
  }

  /**
   * Adds another money value with the same currency.
   *
   * @param {Money} other - Money value to add.
   * @returns {Money} New money value containing the sum.
   * @throws {ValidationException} When the other value is invalid or currency differs.
   */
  add(other) {
    validateSameCurrency(this, other);
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts another money value with the same currency.
   *
   * @param {Money} other - Money value to subtract.
   * @returns {Money} New money value containing the difference.
   * @throws {ValidationException} When the other value is invalid or currency differs.
   */
  subtract(other) {
    validateSameCurrency(this, other);
    return new Money(this.amount - other.amount, this.currency);
  }

  /**
   * Compares this money value with another money value.
   *
   * @param {Money} other - Money value to compare.
   * @returns {boolean} True when amount and currency match.
   */
  equals(other) {
    return other instanceof Money
      && this.amount === other.amount
      && this.currency === other.currency;
  }
}

module.exports = Money;

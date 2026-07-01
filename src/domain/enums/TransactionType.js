/**
 * Supported transaction types.
 */
const TransactionType = Object.freeze({
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT',
  SAVING: 'SAVING',
});

module.exports = TransactionType;

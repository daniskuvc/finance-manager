/**
 * Name of the spreadsheet tab used to store transactions.
 *
 * @type {string}
 */
var TRANSACTIONS_SHEET_NAME = 'Transactions';

/**
 * Ordered transaction sheet columns.
 *
 * @type {string[]}
 */
var TRANSACTION_HEADERS = [
  'Date',
  'Type',
  'Account',
  'Category',
  'Description',
  'Person',
  'Amount',
  'Notes',
];

/**
 * Temporary fixed lists used by the transaction form.
 * These values are centralized so they can be replaced by Google Sheets data later.
 *
 * @type {{types: Array<{value: string, label: string}>, accounts: string[], categories: string[], people: string[]}}
 */
var TEMPORARY_TRANSACTION_OPTIONS = {
  types: [
    { value: 'EXPENSE', label: 'Gasto' },
    { value: 'INCOME', label: 'Ingreso' },
  ],
  accounts: [
    'Efectivo',
    'Banco Unión',
  ],
  categories: [
    'Verduras',
    'Frutas',
    'Carnes',
    'Transporte',
    'Limpieza',
  ],
  people: [
    'Daniel',
    'Esposa',
  ],
};

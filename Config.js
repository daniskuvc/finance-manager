/**
 * Name of the spreadsheet tab used to store transactions.
 *
 * @type {string}
 */
var TRANSACTIONS_SHEET_NAME = 'Transactions';

/**
 * Name of the sheet used to store categories and their subcategories.
 *
 * @type {string}
 */
var CATEGORIES_SHEET_NAME = 'Categories';

/**
 * Ordered catalog sheet columns.
 *
 * @type {string[]}
 */
var CATEGORY_HEADERS = ['Category', 'Subcategory'];

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
  'Subcategory',
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
  subcategories: {
    Verduras: ['Zanahoria', 'Arveja', 'Haba'],
    Frutas: ['Manzana', 'Plátano', 'Naranja'],
    Carnes: ['Pollo', 'Res', 'Cerdo'],
    Transporte: [],
    Limpieza: [],
  },
  people: [
    'Daniel',
    'Esposa',
  ],
};

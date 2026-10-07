/**
 * Serves the Finance Manager WebApp.
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} WebApp HTML output.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Finance Manager');
}

/**
 * Returns temporary form options for transaction registration.
 *
 * @returns {{types: Array<{value: string, label: string}>, accounts: string[], categories: string[], subcategories: Object, people: string[]}} Form options.
 */
function getTransactionFormOptions() {
  var catalog = getCategoryCatalog();

  return {
    types: TEMPORARY_TRANSACTION_OPTIONS.types,
    accounts: TEMPORARY_TRANSACTION_OPTIONS.accounts,
    categories: catalog.categories,
    subcategories: catalog.subcategories,
    people: TEMPORARY_TRANSACTION_OPTIONS.people,
  };
}

/**
 * Creates a new category in the persistent catalog.
 *
 * @param {string} category Category name.
 * @returns {{categories: string[], subcategories: Object}} Updated catalog.
 */
function addCategory(category) {
  var normalizedCategory = requireText(category, 'Category');
  var catalog = getCategoryCatalog();

  if (catalog.categories.indexOf(normalizedCategory) !== -1) {
    throw new Error('Category already exists.');
  }

  var sheet = createCategoriesSheetIfNotExists();
  sheet.appendRow([normalizedCategory, '']);
  return getCategoryCatalog();
}

/**
 * Creates a subcategory linked to a category in the persistent catalog.
 *
 * @param {string} category Parent category.
 * @param {string} subcategory Subcategory name.
 * @returns {{categories: string[], subcategories: Object}} Updated catalog.
 */
function addSubcategory(category, subcategory) {
  var normalizedCategory = requireText(category, 'Category');
  var normalizedSubcategory = requireText(subcategory, 'Subcategory');
  var catalog = getCategoryCatalog();

  if (catalog.categories.indexOf(normalizedCategory) === -1) {
    throw new Error('Category is invalid.');
  }

  if ((catalog.subcategories[normalizedCategory] || []).indexOf(normalizedSubcategory) !== -1) {
    throw new Error('Subcategory already exists for this category.');
  }

  var sheet = createCategoriesSheetIfNotExists();
  sheet.appendRow([normalizedCategory, normalizedSubcategory]);
  return getCategoryCatalog();
}

/**
 * Creates the category catalog sheet and seeds it with the temporary defaults.
 *
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} Categories sheet.
 */
function createCategoriesSheetIfNotExists() {
  var spreadsheet = getSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CATEGORIES_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CATEGORIES_SHEET_NAME);
  }

  var headerRange = sheet.getRange(1, 1, 1, CATEGORY_HEADERS.length);
  var currentHeaders = headerRange.getValues()[0];
  if (currentHeaders[0] !== CATEGORY_HEADERS[0] || currentHeaders[1] !== CATEGORY_HEADERS[1]) {
    headerRange.setValues([CATEGORY_HEADERS]);
    sheet.setFrozenRows(1);
  }

  if (sheet.getLastRow() === 1) {
    var seedRows = [];
    TEMPORARY_TRANSACTION_OPTIONS.categories.forEach(function(category) {
      var subcategories = TEMPORARY_TRANSACTION_OPTIONS.subcategories[category] || [];
      if (!subcategories.length) {
        seedRows.push([category, '']);
        return;
      }

      subcategories.forEach(function(subcategory) {
        seedRows.push([category, subcategory]);
      });
    });
    sheet.getRange(2, 1, seedRows.length, CATEGORY_HEADERS.length).setValues(seedRows);
  }

  return sheet;
}

/**
 * Reads categories and their linked subcategories.
 *
 * @returns {{categories: string[], subcategories: Object}} Catalog data.
 */
function getCategoryCatalog() {
  var sheet = createCategoriesSheetIfNotExists();
  var lastRow = sheet.getLastRow();
  var catalog = { categories: [], subcategories: {} };

  if (lastRow < 2) {
    return catalog;
  }

  sheet.getRange(2, 1, lastRow - 1, CATEGORY_HEADERS.length).getValues().forEach(function(row) {
    var category = optionalText(row[0]);
    var subcategory = optionalText(row[1]);

    if (!category) {
      return;
    }

    if (catalog.categories.indexOf(category) === -1) {
      catalog.categories.push(category);
      catalog.subcategories[category] = [];
    }

    if (subcategory && catalog.subcategories[category].indexOf(subcategory) === -1) {
      catalog.subcategories[category].push(subcategory);
    }
  });

  return catalog;
}

/**
 * Creates the Transactions sheet when it does not exist and ensures headers exist.
 *
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} Transactions sheet.
 */
function createTransactionsSheetIfNotExists() {
  var spreadsheet = getSpreadsheet();
  var sheet = spreadsheet.getSheetByName(TRANSACTIONS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(TRANSACTIONS_SHEET_NAME);
  }

  ensureTransactionHeaders(sheet);
  return sheet;
}

/**
 * Saves a transaction in Google Sheets.
 *
 * @param {{date: string, type: string, account: string, category: string, subcategory: string, description: string, person: string, amount: number|string, notes: string}} transaction Transaction data.
 * @returns {{success: boolean, transaction: Object}} Save result.
 */
function saveTransaction(transaction) {
  var normalizedTransaction = normalizeTransaction(transaction);
  var lock = LockService.getScriptLock();

  lock.waitLock(10000);

  try {
    var sheet = createTransactionsSheetIfNotExists();
    sheet.appendRow([
      normalizedTransaction.date,
      normalizedTransaction.type,
      normalizedTransaction.account,
      normalizedTransaction.category,
      normalizedTransaction.description,
      normalizedTransaction.person,
      normalizedTransaction.amount,
      normalizedTransaction.notes,
      normalizedTransaction.subcategory,
    ]);

    return {
      success: true,
      transaction: serializeTransaction(normalizedTransaction),
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Gets the most recently saved transactions.
 *
 * @param {number=} limit Maximum number of transactions to return.
 * @returns {Object[]} Recent transactions, newest first.
 */
function getRecentTransactions(limit) {
  var sheet = createTransactionsSheetIfNotExists();
  var requestedLimit = Number(limit) || 10;
  var safeLimit = Math.max(1, Math.min(requestedLimit, 50));
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  var transactionCount = lastRow - 1;
  var rowsToRead = Math.min(safeLimit, transactionCount);
  var startRow = lastRow - rowsToRead + 1;
  var values = sheet.getRange(startRow, 1, rowsToRead, TRANSACTION_HEADERS.length).getValues();

  return values
    .reverse()
    .map(function(row) {
      return serializeTransaction({
        date: row[0],
        type: row[1],
        account: row[2],
        category: row[3],
        description: row[4],
        person: row[5],
        amount: row[6],
      notes: row[7],
      subcategory: row[8],
      });
    });
}

/**
 * Returns the configured spreadsheet or throws a clear setup error.
 *
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Configured spreadsheet.
 */
function getSpreadsheet() {
  var spreadsheetId = PropertiesService
    .getScriptProperties()
    .getProperty('SPREADSHEET_ID');

  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID script property is required. Configure it with the target Google Sheets spreadsheet ID.');
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

/**
 * Ensures the transaction sheet has the expected header row.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet Transactions sheet.
 */
function ensureTransactionHeaders(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, TRANSACTION_HEADERS.length);
  var currentHeaders = headerRange.getValues()[0];
  var hasHeaders = currentHeaders.some(function(header) {
    return String(header).trim() !== '';
  });

  if (!hasHeaders) {
    headerRange.setValues([TRANSACTION_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  // Keep existing transactions intact while adding the new final column.
  if (currentHeaders[TRANSACTION_HEADERS.length - 1] !== TRANSACTION_HEADERS[TRANSACTION_HEADERS.length - 1]) {
    sheet.getRange(1, TRANSACTION_HEADERS.length).setValue(TRANSACTION_HEADERS[TRANSACTION_HEADERS.length - 1]);
  }
}

/**
 * Validates and normalizes transaction input before saving.
 *
 * @param {Object} transaction Raw transaction input.
 * @returns {{date: Date, type: string, account: string, category: string, subcategory: string, description: string, person: string, amount: number, notes: string}} Normalized transaction.
 */
function normalizeTransaction(transaction) {
  if (!transaction) {
    throw new Error('Transaction is required.');
  }

  var normalized = {
    date: parseTransactionDate(transaction.date),
    type: requireOption(transaction.type, getAllowedTypeValues(), 'Type'),
    account: requireOption(transaction.account, TEMPORARY_TRANSACTION_OPTIONS.accounts, 'Account'),
    category: requireOption(transaction.category, getCategoryCatalog().categories, 'Category'),
    subcategory: validateSubcategory(transaction.category, transaction.subcategory),
    description: requireText(transaction.description, 'Description'),
    person: requireOption(transaction.person, TEMPORARY_TRANSACTION_OPTIONS.people, 'Person'),
    amount: parseTransactionAmount(transaction.amount),
    notes: optionalText(transaction.notes),
  };

  return normalized;
}

/**
 * Validates a subcategory against its selected category.
 *
 * @param {string} category Parent category.
 * @param {string} subcategory Subcategory value.
 * @returns {string} Normalized subcategory, which may be empty.
 */
function validateSubcategory(category, subcategory) {
  var value = optionalText(subcategory);
  if (!value) {
    return '';
  }

  var allowed = getCategoryCatalog().subcategories[category] || [];
  return requireOption(value, allowed, 'Subcategory');
}

/**
 * Parses a transaction date from the HTML date input value.
 *
 * @param {string} value Date input value in YYYY-MM-DD format.
 * @returns {Date} Parsed date.
 */
function parseTransactionDate(value) {
  var text = requireText(value, 'Date');
  var parts = text.split('-');

  if (parts.length !== 3) {
    throw new Error('Date must use YYYY-MM-DD format.');
  }

  var year = Number(parts[0]);
  var month = Number(parts[1]);
  var day = Number(parts[2]);
  var date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Date is invalid.');
  }

  return date;
}

/**
 * Parses and validates a transaction amount.
 *
 * @param {number|string} value Raw amount value.
 * @returns {number} Numeric amount.
 */
function parseTransactionAmount(value) {
  var amount = Number(value);

  if (Number.isNaN(amount)) {
    throw new Error('Amount must be numeric.');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  return amount;
}

/**
 * Requires non-empty text.
 *
 * @param {*} value Raw value.
 * @param {string} fieldName Field name for error messages.
 * @returns {string} Trimmed text.
 */
function requireText(value, fieldName) {
  var text = optionalText(value);

  if (!text) {
    throw new Error(fieldName + ' is required.');
  }

  return text;
}

/**
 * Normalizes optional text.
 *
 * @param {*} value Raw value.
 * @returns {string} Trimmed text or empty string.
 */
function optionalText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

/**
 * Requires a value to be present in an allowed list.
 *
 * @param {*} value Raw option value.
 * @param {string[]} allowedValues Allowed option values.
 * @param {string} fieldName Field name for error messages.
 * @returns {string} Normalized option value.
 */
function requireOption(value, allowedValues, fieldName) {
  var text = requireText(value, fieldName);

  if (allowedValues.indexOf(text) === -1) {
    throw new Error(fieldName + ' is invalid.');
  }

  return text;
}

/**
 * Gets the allowed transaction type values.
 *
 * @returns {string[]} Allowed transaction type values.
 */
function getAllowedTypeValues() {
  return TEMPORARY_TRANSACTION_OPTIONS.types.map(function(type) {
    return type.value;
  });
}

/**
 * Serializes a transaction for the browser.
 *
 * @param {{date: Date|string, type: string, account: string, category: string, subcategory: string, description: string, person: string, amount: number|string, notes: string}} transaction Transaction data.
 * @returns {{date: string, type: string, account: string, category: string, subcategory: string, description: string, person: string, amount: number|string, notes: string}} Browser-safe transaction.
 */
function serializeTransaction(transaction) {
  return {
    date: formatTransactionDate(transaction.date),
    type: getTransactionTypeLabel(transaction.type),
    account: transaction.account,
    category: transaction.category,
    subcategory: transaction.subcategory,
    description: transaction.description,
    person: transaction.person,
    amount: transaction.amount,
    notes: transaction.notes,
  };
}

/**
 * Formats a transaction date for display in the browser.
 *
 * @param {Date|string} value Raw date value.
 * @returns {string} Formatted date.
 */
function formatTransactionDate(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return String(value || '');
}

/**
 * Gets the display label for a transaction type.
 *
 * @param {string} value Transaction type value.
 * @returns {string} Display label.
 */
function getTransactionTypeLabel(value) {
  var option = TEMPORARY_TRANSACTION_OPTIONS.types.find(function(type) {
    return type.value === value;
  });

  return option ? option.label : value;
}

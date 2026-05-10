const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DEFAULT_CONFIG,
  validateEntry,
  loadEntries,
  saveEntries,
  normalizeStoredEntry,
  calculateTotal,
  calculateBalance,
} = require('../budget-core.js');

function createStorage(initial = {}) {
  const state = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : null;
    },
    setItem(key, value) {
      state[key] = value;
    },
    removeItem(key) {
      delete state[key];
    },
    dump() {
      return state;
    },
  };
}

test('validateEntry trims title and accepts positive amount', () => {
  const result = validateEntry('  Salary  ', '1000');

  assert.equal(result.isValid, true);
  assert.deepEqual(result.entry, { title: 'Salary', amount: 1000 });
});

test('validateEntry rejects empty title', () => {
  const result = validateEntry('', 10);

  assert.equal(result.isValid, false);
  assert.equal(result.message, 'Please enter a title.');
});

test('validateEntry rejects whitespace-only title', () => {
  const result = validateEntry('   ', 10);

  assert.equal(result.isValid, false);
  assert.equal(result.message, 'Please enter a title.');
});

test('validateEntry rejects titles longer than the configured maximum', () => {
  const result = validateEntry('x'.repeat(DEFAULT_CONFIG.validation.maxTitleLength + 1), 10);

  assert.equal(result.isValid, false);
  assert.equal(result.message, 'Title must be 50 characters or fewer.');
});

test('validateEntry rejects negative, zero, NaN, and Infinity amounts', () => {
  const invalidAmounts = [-1, 0, 'not-a-number', Infinity];

  invalidAmounts.forEach((amount) => {
    const result = validateEntry('Groceries', amount);

    assert.equal(result.isValid, false);
    assert.equal(result.message, 'Please enter an amount greater than 0.');
  });
});

test('normalizeStoredEntry adds id when missing', () => {
  const normalized = normalizeStoredEntry(
    { type: 'income', title: 'Bonus', amount: 2000 },
    { createId: () => 'generated-id' }
  );

  assert.deepEqual(normalized, {
    id: 'generated-id',
    type: 'income',
    title: 'Bonus',
    amount: 2000,
  });
});

test('normalizeStoredEntry returns null on invalid type', () => {
  const normalized = normalizeStoredEntry({ type: 'other', title: 'x', amount: 1 });

  assert.equal(normalized, null);
});

test('loadEntries returns normalized list', () => {
  const storage = createStorage({
    [DEFAULT_CONFIG.storageKey]: JSON.stringify([
      { id: '1', type: 'income', title: ' Salary ', amount: 500 },
      { type: 'expense', title: 'Lunch', amount: 20 },
      { type: 'wrong', title: 'ignore', amount: 5 },
    ]),
  });

  const list = loadEntries({ storage, createId: () => 'new-id' });

  assert.equal(list.length, 2);
  assert.deepEqual(list[0], { id: '1', type: 'income', title: 'Salary', amount: 500 });
  assert.deepEqual(list[1], { id: 'new-id', type: 'expense', title: 'Lunch', amount: 20 });
});

test('loadEntries clears invalid persisted payload', () => {
  const storage = createStorage({
    [DEFAULT_CONFIG.storageKey]: '{bad-json',
  });

  const list = loadEntries({ storage });

  assert.deepEqual(list, []);
  assert.equal(storage.getItem(DEFAULT_CONFIG.storageKey), null);
});

test('saveEntries persists entries and returns true', () => {
  const storage = createStorage();
  const entries = [{ id: '1', type: 'income', title: 'Salary', amount: 500 }];

  const saved = saveEntries({ entries, storage });

  assert.equal(saved, true);
  assert.equal(storage.getItem(DEFAULT_CONFIG.storageKey), JSON.stringify(entries));
});

test('saveEntries returns false and reports storage failures', () => {
  const errors = [];
  const storage = {
    setItem() {
      throw new Error('Storage unavailable');
    },
  };

  const saved = saveEntries({
    entries: [],
    storage,
    onError: (error) => errors.push(error.message),
  });

  assert.equal(saved, false);
  assert.deepEqual(errors, ['Storage unavailable']);
});

test('calculateTotal sums only requested type', () => {
  const list = [
    { type: 'income', amount: 100 },
    { type: 'expense', amount: 40 },
    { type: 'income', amount: 60 },
  ];

  assert.equal(calculateTotal('income', list), 160);
  assert.equal(calculateTotal('expense', list), 40);
});

test('calculateBalance subtracts outcome from income', () => {
  assert.equal(calculateBalance(200, 50), 150);
  assert.equal(calculateBalance(50, 200), -150);
});
